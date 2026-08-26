// src/app/(auth)/cadastro/actions.ts
'use server';

import { createTenantOnboarding } from '@/core/services/tenant-service';

/**
 * @function fetchCnpjData
 * @description Proxy Server-Side para consumo da API pública ReceitaWS.
 * Ao executar no servidor do Next.js, mitigamos os bloqueios de política de CORS do navegador 
 * e protegemos a lógica de formatação de documento.
 * 
 * @param {string} cnpj - String bruta enviada pelo formulário (pode conter pontuação).
 * @returns {Promise<Object>} DTO contendo os dados fiscais e geográficos normalizados ou mensagem de erro.
 */
export async function fetchCnpjData(cnpj: string) {
  // Higienização de entrada: Remove tudo que não for dígito
  const cleanCnpj = cnpj.replace(/\D/g, '');
  if (cleanCnpj.length !== 14) return { error: 'CNPJ inválido ou incompleto.' };

  try {
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCnpj}`);
    const data = await response.json();
    
    if (data.status === 'ERROR') return { error: data.message };
    
    // Normalização semântica: Traduz as chaves da API de terceiros para o padrão da nossa aplicação
    return {
      success: true,
      nomeFantasia: data.fantasia || data.nome,
      razaoSocial: data.nome,
      cep: data.cep ? data.cep.replace(/\D/g, '') : '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '', // A API retorna 'municipio', nosso banco espera 'cidade'
      estado: data.uf || '',        
    };
  } catch (error) {
    return { error: 'Falha de comunicação de rede com o serviço da Receita Federal.' };
  }
}

/**
 * @function fetchCepData
 * @description Proxy Server-Side para consulta de logradouros no ViaCEP.
 * Otimiza a experiência do usuário promovendo autopreenchimento de dados geográficos.
 * 
 * @param {string} cep - String bruta do CEP (com ou sem hífen).
 * @returns {Promise<Object>} DTO contendo bairro, rua, cidade e UF.
 */
export async function fetchCepData(cep: string) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return { error: 'CEP estruturalmente inválido.' };

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    // O ViaCEP retorna sucesso HTTP mesmo quando o CEP não existe, mas envia a flag { erro: true }
    if (data.erro) return { error: 'CEP não encontrado na base de dados dos Correios.' };
    
    return {
      success: true,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade, // Tradução de nomenclatura
      estado: data.uf,
    };
  } catch (error) {
    return { error: 'Falha de comunicação de rede com o serviço de CEP.' };
  }
}

/**
 * @function handleCadastroWizard
 * @description Orquestrador Controller (Action). Responsável por interceptar o submit do formulário 
 * no Frontend, extrair o FormData tipado, realizar as validações defensivas primárias e acionar o Core Service.
 * 
 * @param {FormData} formData - Objeto nativo Web API contendo o estado submetido pela View.
 * @returns {Promise<Object>} Resposta unificada de sucesso (boolean) ou falha amigável (string).
 */
export async function handleCadastroWizard(formData: FormData) {
  // 1. Extração Dinâmica e Tipagem do Payload de Rede
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const tipoDocumento = formData.get('tipoDocumento') as string;
  const documento = formData.get('documento') as string;
  const nomeFantasia = formData.get('nomeFantasia') as string;
  const razaoSocial = formData.get('razaoSocial') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const cep = formData.get('cep') as string;
  const logradouro = formData.get('logradouro') as string;
  const numero = formData.get('numero') as string;
  const complemento = formData.get('complemento') as string;
  const bairro = formData.get('bairro') as string;
  const cidade = formData.get('cidade') as string;
  const estado = formData.get('estado') as string;
  
  // Extração do Plano SaaS: Aplica fallback rigoroso caso a interface envie um valor nulo
  const plano = (formData.get('plano') as any) || 'free';

  // 2. Validação Defensiva (Sanitization Level 1)
  // Previne chamadas desnecessárias ao banco de dados garantindo a integridade mínima
  if (!email || password.length < 6 || !nomeFantasia || !documento) {
    return { error: 'A integridade dos dados falhou. Preencha todos os campos vitais corretamente.' };
  }

  // 3. Invocação da Regra de Negócio Transacional (Camada Core)
  try {
    await createTenantOnboarding({
      email,
      senha_pura: password,
      tipoDocumento,
      documento,
      nomeFantasia,
      razaoSocial,
      whatsapp,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      plano // Repassa a escolha do licenciamento
    });
    
    // Sinaliza à View que a operação foi concluída e o redirecionamento pode ocorrer
    return { success: true };
  } catch (error: any) {
    // Intercepta exceções lançadas pelo Service (ex: usuário existente, falha no banco)
    return { error: error.message };
  }
}