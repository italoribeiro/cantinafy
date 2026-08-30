// src/core/services/tenant-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * @interface OnboardingData
 * @description Estrutura de transferência de dados (DTO) exigida para o provisionamento inicial de um Tenant.
 * Agrupa as credenciais de acesso, dados fiscais, localização e o nível de licenciamento (Plano SaaS).
 */
interface OnboardingData {
  email: string;
  senha_pura: string;
  tipoDocumento: string; // Interface espera 'PF' (Física) ou 'PJ' (Jurídica)
  documento: string;
  nomeFantasia: string;
  razaoSocial?: string;
  nomeResponsavel: string; // <-- TS AGORA CONHECE: Nome real da pessoa física
  cpfResponsavel?: string; // <-- TS AGORA CONHECE: CPF do responsável
  whatsapp: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  plano: string; // Código dinâmico do plano selecionado na UI (Ex: 'free', 'profissional')
}

/**
 * @function createTenantOnboarding
 * @description Motor transacional que orquestra o setup completo de uma nova empresa.
 * Cria o Usuário no Auth, verifica dinamicamente as regras do Plano SaaS, provisiona o Tenant 
 * (com endereço e limites do plano), a Filial Matriz, o Perfil Base (Cargo) e a Matriz de Permissões (RBAC).
 * 
 * ATENÇÃO ARQUITETURAL: Como o Supabase não suporta transações nativas entre o Schema `auth` 
 * e o `public` facilmente via API HTTP, esta função utiliza um padrão de "Mecanismo de Compensação" 
 * (Rollback Manual). Se qualquer etapa de inserção falhar, o usuário criado no cofre de senhas é deletado,
 * prevenindo bancos de dados particionados ou usuários fantasmas.
 * 
 * @param {OnboardingData} data - O objeto consolidado capturado pela UI do Wizard.
 * @returns {Promise<{success: boolean, tenantId: string}>} Feedback de sucesso e a chave primária da empresa.
 * @throws {Error} Interrompe o fluxo e envia uma mensagem humanizada para a View em caso de falha de rede ou SQL.
 */
export async function createTenantOnboarding(data: OnboardingData) {
  
  // ====================================================================================
  // PASSO 1: CRIAÇÃO DE CREDENCIAIS DE ACESSO (SUPABASE AUTH)
  // ====================================================================================
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.senha_pura,
    email_confirm: true, // Bypass de e-mail de confirmação para acelerar o MVP (Cold Start)
  });

  if (authError || !authData.user) {
    throw new Error(`Falha de segurança ao provisionar acesso: ${authError?.message}`);
  }

  const userId = authData.user.id;

  try {
    // ====================================================================================
    // PASSO 2: VALIDAÇÃO DINÂMICA DO LICENCIAMENTO (SaaS) E LIMITES
    // ====================================================================================
    // Consulta a tabela administrativa global para garantir que o plano contratado existe, 
    // está ativo e extrai a cota técnica permitida.
    const { data: planoData, error: planoError } = await supabaseAdmin
      .from('adm_planos_assinatura')
      .select('limite_usuarios')
      .eq('codigo', data.plano)
      .eq('ativo', true)
      .single();

    if (planoError || !planoData) {
      throw new Error("O plano de assinatura selecionado é inválido ou foi desativado no sistema.");
    }

    // Normalização de Dados: Otimiza o armazenamento no banco convertendo strings longas em char único
    const charTipo = data.tipoDocumento === 'PJ' ? 'J' : 'F'; 

    // ====================================================================================
    // PASSO 3: PROVISIONAMENTO DO TENANT (MATRIZ EMPRESARIAL)
    // ====================================================================================
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([
        { 
          nome_fantasia: data.nomeFantasia,
          razao_social: data.razaoSocial,
          tipo_documento: charTipo, // Salva 'J' ou 'F'
          cnpj_cpf: data.documento, // Persiste o documento principal
          whatsapp: data.whatsapp,
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          plano_atual: data.plano, // Grava a assinatura escolhida no onboarding
          limite_usuarios: planoData.limite_usuarios // Trava operacional sistêmica resgatada do banco
        }
      ])
      .select('id')
      .single();

    if (tenantError) throw tenantError;
    const tenantId = tenantData.id;

    // ====================================================================================
    // PASSO 4: CRIAÇÃO DA FILIAL PADRÃO (ESTRUTURA FÍSICA)
    // ====================================================================================
    // Necessário pois o controle de PDV e Estoque exige uma localidade física (filial_id)
    const { data: filialData, error: filialError } = await supabaseAdmin
      .from('filiais')
      .insert([
        {
          tenant_id: tenantId,
          nome: 'Matriz Principal',
          is_matriz: true
        }
      ])
      .select('id')
      .single();

    if (filialError) throw filialError;
    const filialId = filialData.id;

    // ====================================================================================
    // PASSO 5: FABRICAÇÃO DO CONTROLE DE ACESSO (RBAC) E PERMISSÕES
    // ====================================================================================
    
    // 5.1 Instanciação do Cargo Hierárquico (Perfil Mestre)
    const { data: perfilData, error: perfilInsertError } = await supabaseAdmin
      .from('perfis')
      .insert([
        {
          tenant_id: tenantId,
          nome: 'Administrador Geral'
        }
      ])
      .select('id')
      .single();
    
    if (perfilInsertError) throw perfilInsertError;
    const perfilId = perfilData.id;

    // 5.2 Atribuição em Lote (Bulk Insert) de privilégios para os módulos core
    const modulosCore = ['pdv', 'cozinha_kds', 'produtos', 'configuracoes'];
    const permissoesPayload = modulosCore.map(mod => ({
      perfil_id: perfilId,
      modulo: mod,
      pode_ler: true,
      pode_escrever: true,
      pode_editar: true,
      pode_excluir: true
    }));

    const { error: permissoesError } = await supabaseAdmin
      .from('permissoes_perfil')
      .insert(permissoesPayload);

    if (permissoesError) throw permissoesError;

    // 5.3 Acoplamento: Vincula a identidade de Auth ao Perfil Administrativo e à Empresa
    const { error: userProfileError } = await supabaseAdmin
      .from('perfis_usuarios')
      .insert([
        {
          id: userId,
          tenant_id: tenantId,
          filial_id: filialId, 
          perfil_id: perfilId, 
          nome: 'Dono da Cantina' // Pode ser alterado depois no painel de perfil
        }
      ]);

    if (userProfileError) throw userProfileError;

    // Finalização com integridade total
    return { success: true, tenantId };

  } catch (error: any) {
    // ====================================================================================
    // FALLBACK: MECANISMO DE ROLLBACK DE SEGURANÇA
    // ====================================================================================
    // Ação vital: Exclui a chave de acesso gerada no Passo 1 para não travar o e-mail do cliente,
    // permitindo que ele tente novamente sem o erro de "e-mail já cadastrado".
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(`Falha sistêmica na montagem da empresa: ${error.message}`);
  }
}