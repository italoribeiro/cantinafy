// src/app/(auth)/cadastro/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { handleCadastroWizard, fetchCnpjData, fetchCepData } from './actions';

/**
 * @description Página de Onboarding e Cadastro (Wizard de 2 Etapas).
 * Responsável por coletar as credenciais do usuário e os dados estruturais da cantina (Tenant).
 * 
 * Implementa integrações ativas de UI:
 * - ReceitaWS: Autopreenchimento de dados e endereço a partir de um CNPJ válido.
 * - ViaCEP: Autopreenchimento de localização a partir do CEP.
 *
 * @returns {JSX.Element} A interface interativa de cadastro renderizada.
 */
export default function CadastroWizardPage() {
  const router = useRouter();
  
  // ==========================================
  // ESTADOS DO COMPONENTE
  // ==========================================
  
  // Controle de fluxo do Wizard e feedback visual
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modelo de dados centralizado do formulário (State Machine)
  const [formData, setFormData] = useState({
    email: '', password: '', tipoDocumento: 'PJ', documento: '',
    nomeFantasia: '', razaoSocial: '', whatsapp: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
  });

  // ==========================================
  // CONTROLADORES DE EVENTOS (HANDLERS)
  // ==========================================

  /**
   * @description Valida os dados de credenciais da Etapa 1 e avança para a Etapa 2.
   * @param {React.FormEvent} e - Evento de submissão do formulário padrão.
   */
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || formData.password.length < 6) {
      setErrorMsg('Preencha um e-mail válido e senha de no mínimo 6 caracteres.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  /**
   * @description Acionado no `onBlur` do campo de Documento.
   * Consulta a Server Action do ReceitaWS caso seja Pessoa Jurídica.
   * Promove o autopreenchimento reativo sem recarregar a tela.
   */
  const handleBuscaCnpj = async () => {
    // Evita chamadas desnecessárias se for PF ou CNPJ incompleto
    if (formData.tipoDocumento !== 'PJ' || formData.documento.length < 14) return;
    
    setIsLoading(true);
    const result = await fetchCnpjData(formData.documento);
    setIsLoading(false);

    if (result.success) {
      setFormData(prev => ({
        ...prev,
        nomeFantasia: result.nomeFantasia || prev.nomeFantasia,
        razaoSocial: result.razaoSocial || prev.razaoSocial,
        cep: result.cep || prev.cep,
        logradouro: result.logradouro || prev.logradouro,
        numero: result.numero || prev.numero,
        complemento: result.complemento || prev.complemento,
        bairro: result.bairro || prev.bairro,
        cidade: result.cidade || prev.cidade,
        estado: result.estado || prev.estado
      }));
    }
  };

  /**
   * @description Acionado no `onBlur` do campo de CEP.
   * Consulta a Server Action do ViaCEP para enriquecer os dados de localização.
   */
  const handleBuscaCep = async () => {
    if (formData.cep.length < 8) return;
    
    setIsLoading(true);
    const result = await fetchCepData(formData.cep);
    setIsLoading(false);

    if (result.success) {
      setFormData(prev => ({
        ...prev,
        logradouro: result.logradouro || '',
        bairro: result.bairro || '',
        cidade: result.cidade || '',
        estado: result.estado || ''
      }));
    } else if (result.error) {
      setErrorMsg(result.error);
    }
  };

  /**
   * @description Orquestra a submissão final do cadastro (Etapa 2).
   * Converte o estado React para FormData e delega a execução à Server Action.
   * @param {React.FormEvent} e - Evento de submissão do formulário.
   */
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Prepara os dados nativos para a Server Action trafegar via rede
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value as string));

    const result = await handleCadastroWizard(data);

    if (result.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      // Sucesso: Redireciona o novo dono de cantina para o Login
      router.push('/login');
    }
  };

  // ==========================================
  // RENDERIZAÇÃO DA INTERFACE (VIEWS)
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 my-8">
        
        {/* Cabeçalho do Wizard */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black tracking-tighter mb-2">
            <span className="text-slate-900">cantina</span><span className="text-red-600">fy</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            {step === 1 ? 'Crie sua conta de acesso' : 'Dados da sua Cantina'}
          </h1>
          
          {/* Indicadores Visuais de Etapa (Steps) */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-red-600' : 'bg-slate-200'}`} />
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-red-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Feedback Visual de Erros */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* ========================================================
            ETAPA 1: CREDENCIAIS DE ACESSO
            ======================================================== */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5 max-w-md mx-auto">
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail do Administrador</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-medium"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Senha Segura</label>
              <input 
                type="password" required minLength={6}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-medium"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
              Continuar ➔
            </button>
            <div className="text-center text-sm font-medium text-slate-500 mt-4">
              Já tem conta? <Link href="/login" className="text-red-600 hover:underline">Faça login</Link>
            </div>
          </form>
        )}

        {/* ========================================================
            ETAPA 2: DADOS ESTRUTURAIS E ENDEREÇO DO NEGÓCIO
            ======================================================== */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            {/* Bloco 1: Identificação e Documentação */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-5">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Identificação</h3>
              
              {/* Botões Toggle de Seleção de Natureza Jurídica */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, tipoDocumento: 'PJ', documento: ''})}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${formData.tipoDocumento === 'PJ' ? 'border-red-600 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  Pessoa Jurídica (CNPJ)
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, tipoDocumento: 'PF', documento: ''})}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${formData.tipoDocumento === 'PF' ? 'border-red-600 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  Pessoa Física (CPF)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {formData.tipoDocumento === 'PJ' ? 'CNPJ' : 'CPF'}
                  </label>
                  <input 
                    type="text" required
                    value={formData.documento}
                    onChange={e => setFormData({...formData, documento: e.target.value})}
                    onBlur={handleBuscaCnpj}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                    placeholder={formData.tipoDocumento === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nome Fantasia</label>
                  <input 
                    type="text" required
                    value={formData.nomeFantasia}
                    onChange={e => setFormData({...formData, nomeFantasia: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
                <input 
                  type="text" required
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                  placeholder="(00) 90000-0000"
                />
              </div>
            </div>

            {/* Bloco 2: Localização Geográfica */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Localização</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">CEP</label>
                  <input 
                    type="text" required maxLength={9}
                    value={formData.cep}
                    onChange={e => setFormData({...formData, cep: e.target.value})}
                    onBlur={handleBuscaCep}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                    placeholder="00000-000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Logradouro / Rua</label>
                  <input 
                    type="text" required
                    value={formData.logradouro}
                    onChange={e => setFormData({...formData, logradouro: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Número</label>
                  <input 
                    type="text" required
                    value={formData.numero}
                    onChange={e => setFormData({...formData, numero: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Complemento</label>
                  <input 
                    type="text"
                    value={formData.complemento}
                    onChange={e => setFormData({...formData, complemento: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                    placeholder="Sala, Andar, etc. (Opcional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Bairro</label>
                  <input 
                    type="text" required
                    value={formData.bairro}
                    onChange={e => setFormData({...formData, bairro: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Cidade</label>
                  <input 
                    type="text" required
                    value={formData.cidade}
                    onChange={e => setFormData({...formData, cidade: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Estado (UF)</label>
                  <input 
                    type="text" required maxLength={2}
                    value={formData.estado}
                    onChange={e => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                    placeholder="UF"
                  />
                </div>
              </div>
            </div>

            {/* Ações Finais do Wizard */}
            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Voltar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-70 shadow-lg shadow-red-600/20 transition-all"
              >
                {isLoading ? 'Finalizando...' : 'Concluir Cadastro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}