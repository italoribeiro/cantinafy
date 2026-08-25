// src/core/services/tenant-service.ts
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * @interface OnboardingData
 * @description Estrutura de dados exigida (Payload) para a criação de um novo Tenant no sistema.
 * Agrupa credenciais, identificação jurídica e localização geográfica.
 */
interface OnboardingData {
  email: string;
  senha_pura: string;
  tipoDocumento: string; // Espera 'PF' ou 'PJ' do frontend
  documento: string;
  nomeFantasia: string;
  razaoSocial?: string;
  whatsapp: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * @function createTenantOnboarding
 * @description Orquestra a criação do Usuário Auth, Tenant com Endereço, Filial Matriz, 
 * Perfil Mestre (Cargo) e Matriz de Acessos (RBAC Modular).
 * Atua de forma pseudo-transacional: se qualquer inserção no banco falhar, realiza o rollback 
 * manual excluindo o usuário do Auth para evitar dados órfãos e inconsistência.
 * 
 * @param {OnboardingData} data - Objeto contendo todos os dados do Wizard de Cadastro.
 * @returns {Promise<{success: boolean, tenantId: string}>} O ID do novo Tenant criado.
 * @throws {Error} Lança um erro descritivo caso qualquer etapa da orquestração falhe.
 */
export async function createTenantOnboarding(data: OnboardingData) {
  
  // ==========================================
  // PASSO 1: CRIAÇÃO DE CREDENCIAIS (AUTH)
  // ==========================================
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.senha_pura,
    email_confirm: true, // Força a confirmação para agilizar a entrada no MVP
  });

  if (authError || !authData.user) {
    throw new Error(`Erro ao criar usuário: ${authError?.message}`);
  }

  const userId = authData.user.id;

  try {
    // ==========================================
    // PASSO 2: CRIAÇÃO DO TENANT (EMPRESA/GRUPO)
    // ==========================================
    // Otimização de armazenamento: Converte 'PF' para 'F' e 'PJ' para 'J'
    const charTipo = data.tipoDocumento === 'PJ' ? 'J' : 'F'; 

    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([
        { 
          nome_fantasia: data.nomeFantasia,
          razao_social: data.razaoSocial,
          tipo_documento: charTipo, // Salva apenas 'F' ou 'J'
          cnpj_cpf: data.documento, // Correção: apontando para a coluna correta no banco
          whatsapp: data.whatsapp,
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          plano_atual: 'free_6_meses' // Liberação estratégica de inauguração
        }
      ])
      .select('id')
      .single();

    if (tenantError) throw tenantError;
    const tenantId = tenantData.id;

    // ==========================================
    // PASSO 3: CRIAÇÃO DA FILIAL MATRIZ
    // ==========================================
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

    // ==========================================
    // PASSO 4: CRIAÇÃO DO PERFIL E ACESSOS MODULARES (RBAC)
    // ==========================================
    
    // 4.1 Cria o perfil mestre (O Cargo na empresa)
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

    // 4.2 Atribui poder total (Full Access) em todos os módulos core para o Perfil Mestre
    const modulosCore = ['pdv', 'financeiro', 'produtos', 'configuracoes'];
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

    // 4.3 Vincula o Usuário Auth ao Perfil Administrativo (RBAC)
    const { error: userProfileError } = await supabaseAdmin
      .from('perfis_usuarios')
      .insert([
        {
          id: userId,
          tenant_id: tenantId,
          filial_id: filialId, // Vincula à matriz inicialmente
          perfil_id: perfilId, // Chave estrangeira para a tabela de perfis
          nome: 'Administrador do Sistema' // Editável no painel posteriormente
        }
      ]);

    if (userProfileError) throw userProfileError;

    // Conclusão bem-sucedida da esteira de fabricação
    return { success: true, tenantId };

  } catch (error: any) {
    // ==========================================
    // FALLBACK (MECANISMO DE ROLLBACK)
    // ==========================================
    // Se o banco falhar, excluímos o usuário no Cofre (Auth) para permitir nova tentativa
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(`Falha na estruturação do Tenant: ${error.message}`);
  }
}