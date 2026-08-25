// src/app/(auth)/cadastro/actions.ts
'use server';

import { createTenantOnboarding } from '@/core/services/tenant-service';

/**
 * @function fetchCnpjData
 * @description Realiza uma chamada HTTP para a API pública do ReceitaWS.
 * Feito no ambiente Server-Side para proteger a requisição e evitar bloqueios CORS do navegador.
 * 
 * @param {string} cnpj - A string do CNPJ, com ou sem máscara.
 * @returns {Promise<Object>} Um objeto contendo status de erro ou os dados consolidados (sucesso).
 */
export async function fetchCnpjData(cnpj: string) {
  // Limpeza da máscara para garantir que apenas números cheguem na API
  const cleanCnpj = cnpj.replace(/\D/g, '');
  if (cleanCnpj.length !== 14) return { error: 'CNPJ inválido' };

  try {
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCnpj}`);
    const data = await response.json();
    
    if (data.status === 'ERROR') return { error: data.message };
    
    // Mapeamento semântico do payload da Receita Federal
    return {
      success: true,
      nomeFantasia: data.fantasia || data.nome,
      razaoSocial: data.nome,
      cep: data.cep ? data.cep.replace(/\D/g, '') : '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.municipio || '', 
      estado: data.uf || '',        
    };
  } catch (error) {
    return { error: 'Falha de rede ao consultar a Receita Federal.' };
  }
}

/**
 * @function fetchCepData
 * @description Realiza uma chamada HTTP para a API pública do ViaCEP.
 * Retorna os dados padronizados de logradouro para autopreenchimento no Frontend.
 * 
 * @param {string} cep - A string do CEP, com ou sem máscara.
 * @returns {Promise<Object>} Um objeto contendo status de erro ou os dados geográficos.
 */
export async function fetchCepData(cep: string) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return { error: 'CEP inválido' };

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) return { error: 'CEP não encontrado na base dos Correios.' };
    
    return {
      success: true,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch (error) {
    return { error: 'Falha de rede ao consultar o serviço de CEP.' };
  }
}

/**
 * @function handleCadastroWizard
 * @description Orquestrador principal acionado no `onSubmit` da tela final do Wizard.
 * Responsável por extrair os dados do FormData instanciado pelo cliente, validar campos vitais
 * e invocar a camada de serviço (Core) para persistência no banco.
 * 
 * @param {FormData} formData - Objeto nativo contendo todos os inputs do usuário.
 * @returns {Promise<Object>} Status de sucesso ou a mensagem de erro formatada.
 */
export async function handleCadastroWizard(formData: FormData) {
  // 1. Extração tipada de dados do FormData
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

  // 2. Validação Defensiva Básica
  if (!email || password.length < 6 || !nomeFantasia || !documento) {
    return { error: 'Dados incompletos. Verifique os campos obrigatórios na etapa final.' };
  }

  // 3. Invocação da Regra de Negócio (Camada Core)
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
      estado
    });
    
    return { success: true };
  } catch (error: any) {
    // Retorna a exceção formatada para ser exibida no componente visual de erro
    return { error: error.message };
  }
}