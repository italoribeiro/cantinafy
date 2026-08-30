// src/app/(auth)/cadastro/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { handleCadastroWizard, fetchCnpjData, fetchCepData, fetchPlanosAtivos } from './actions';

/**
 * @interface PlanoAssinatura
 * @description Espelho da tipagem da tabela adm_planos_assinatura para controle de estado interno.
 */
interface PlanoAssinatura {
  codigo: string;
  nome: string;
  descricao: string;
  preco_mensal: number;
  limite_usuarios: number;
  features: any; // Armazenado como JSONB
  is_destaque: boolean;
  dias_trial: number; // <-- Nova propriedade adicionada para o SaaS de Teste
}

/**
 * @component CadastroWizardPage
 * @description View de Onboarding (Máquina de Estado UI com 2 Passos).
 * Etapa 1: Credenciais de Acesso.
 * Etapa 2: Seleção Dinâmica de Plano SaaS (carregada do banco) e Dados Estruturais da Cantina,
 * incluindo regras de compliance para designação de Responsável Legal (PF) em cadastros PJ.
 * 
 * @returns {JSX.Element} A interface interativa de cadastro.
 */
export default function CadastroWizardPage() {
  const router = useRouter();
  
  // ==========================================
  // ESTADOS DO COMPONENTE (STATE MACHINE)
  // ==========================================
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estado para armazenar o catálogo de planos vindos do banco de dados
  const [planosDb, setPlanosDb] = useState<PlanoAssinatura[]>([]);
  
  const [formData, setFormData] = useState({
    email: '', password: '', 
    tipoDocumento: 'PJ', 
    documento: '', // CNPJ ou CPF principal
    nomeFantasia: '', 
    razaoSocial: '', 
    nomeResponsavel: '', // Nome da PF ou do Responsável Legal PJ
    cpfResponsavel: '',  // CPF do Responsável (Exigido apenas para cadastros PJ)
    whatsapp: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', 
    cidade: '', estado: '', 
    plano: 'basico' // Mudamos o fallback inicial para basico, já que o free não existe mais
  });

  // ==========================================
  // EFEITOS DE CICLO DE VIDA (DATA FETCHING)
  // ==========================================
  useEffect(() => {
    /**
     * @description Carrega os planos parametrizados no Backoffice de forma assíncrona
     * no momento em que a página de cadastro é montada no navegador.
     */
    async function loadPlanos() {
      const planos = await fetchPlanosAtivos();
      setPlanosDb(planos);
      
      // Auto-seleção amigável: se a tabela de planos retornou dados mas não tem plano atual selecionado,
      // seleciona automaticamente o primeiro plano da lista para evitar form quebrado.
      if (planos.length > 0 && !planos.find(p => p.codigo === formData.plano)) {
        setFormData(prev => ({ ...prev, plano: planos[0].codigo }));
      }
    }
    loadPlanos();
  }, []);

  // ==========================================
  // CONTROLADORES DE FLUXO (HANDLERS)
  // ==========================================

  /**
   * @description Valida a Etapa 1 (Email/Senha) e avança para a escolha do plano.
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
   * @description Gatilho OnBlur para consumir a API da Receita Federal via Server Action.
   */
  const handleBuscaCnpj = async () => {
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
   * @description Gatilho OnBlur para consumir a API ViaCEP e preencher ruas/cidades.
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
   * @description Submissão final (Etapa 2) que empacota o estado no FormData e aciona o motor transacional.
   * Aplica validação estrita de compliance jurídico antes de despachar a carga para o servidor.
   */
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Validação de Frontend: Compliance de Responsável Legal
    if (formData.tipoDocumento === 'PJ' && (!formData.nomeResponsavel || !formData.cpfResponsavel)) {
        setErrorMsg('Compliance SaaS: Para cadastros PJ, é obrigatório designar o Nome e CPF do responsável legal.');
        setIsLoading(false);
        return;
    }
    
    if (formData.tipoDocumento === 'PF' && !formData.nomeResponsavel) {
        setErrorMsg('Por favor, informe seu Nome Completo para prosseguir.');
        setIsLoading(false);
        return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value as string));

    const result = await handleCadastroWizard(data);

    if (result.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    } else {
      router.push('/login');
    }
  };

  // ==========================================
  // RENDERIZAÇÃO DA INTERFACE (VIEWS)
  // ==========================================
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {/* Max-w-4xl implementado para expandir horizontalmente e acomodar os cards de planos */}
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 my-8 transition-all">
        
        {/* Cabeçalho Global do Wizard */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black tracking-tighter mb-2">
            <span className="text-slate-900">cantina</span><span className="text-red-600">fy</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            {step === 1 ? 'Crie sua conta de acesso' : 'Escolha seu plano e dados da cantina'}
          </h1>
          
          {/* Indicadores Visuais de Etapa (Steps Bar) */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-red-600' : 'bg-slate-200'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-red-600' : 'bg-slate-200'}`} />
          </div>
        </div>

        {/* Feedback Visual de Erros Centralizado */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* ========================================================
            ETAPA 1: CREDENCIAIS
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
            <button type="submit" className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md">
              Continuar ➔
            </button>
            <div className="text-center text-sm font-medium text-slate-500 mt-4">
              Já tem conta? <Link href="/login" className="text-red-600 hover:underline">Faça login</Link>
            </div>
          </form>
        )}

        {/* ========================================================
            ETAPA 2: DADOS E PLANOS (AGORA DINÂMICOS)
            ======================================================== */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            {/* Bloco 1: Seleção Dinâmica do Plano SaaS gerada via banco */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Planos Disponíveis</h3>
              
              {/* Tratamento UX: Feedback visual enquanto a API carrega os planos */}
              {planosDb.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
                  Carregando planos de assinatura seguros...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Função Map itera sobre os planos retornados pelo Supabase criando os cartões */}
                  {planosDb.map((plano) => (
                    <button
                      key={plano.codigo}
                      type="button"
                      onClick={() => setFormData({...formData, plano: plano.codigo})}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between ${
                        formData.plano === plano.codigo 
                          ? 'border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-600/20' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {/* Flag Visual de Destaque Comercial */}
                      {plano.is_destaque && (
                        <span className="absolute -top-2.5 right-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          Mais Escolhido
                        </span>
                      )}
                      
                      <div>
                        <span className={`text-xs font-bold uppercase block ${plano.is_destaque ? 'text-red-600' : 'text-slate-500'}`}>
                          {plano.nome}
                        </span>
                        <p className="text-lg font-black text-slate-900 mt-1">
                          {plano.preco_mensal === 0 ? 'Grátis' : `R$ ${plano.preco_mensal}`}
                          {plano.preco_mensal > 0 && <span className="text-[10px] font-normal text-slate-500">/mês</span>}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1.5 font-medium leading-tight min-h-[2rem]">
                          {plano.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-1 mt-3">
                        {/* TAG DINÂMICA DO TRIAL */}
                        {plano.dias_trial && plano.dias_trial > 0 && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-800 uppercase border border-green-200">
                            {plano.dias_trial} Dias Grátis
                          </span>
                        )}
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${plano.limite_usuarios > 10 ? 'bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-700'}`}>
                          {plano.limite_usuarios === 999 ? 'Usuários Ilimitados' : `Até ${plano.limite_usuarios} usuários`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bloco 2: Identificação Jurídica/Física */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Identificação Empresarial</h3>
              
              {/* Botões Toggle de Natureza Jurídica (Limpa os campos de Responsável ao alternar) */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, tipoDocumento: 'PJ', documento: '', cpfResponsavel: ''})}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${formData.tipoDocumento === 'PJ' ? 'border-red-600 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  Pessoa Jurídica (CNPJ)
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, tipoDocumento: 'PF', documento: '', cpfResponsavel: ''})}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-all ${formData.tipoDocumento === 'PF' ? 'border-red-600 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  Pessoa Física (CPF)
                </button>
              </div>

              {/* Campos Principais da Entidade (CNPJ ou CPF) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {formData.tipoDocumento === 'PJ' ? 'CNPJ da Empresa' : 'Seu CPF'}
                  </label>
                  <input 
                    type="text" required
                    value={formData.documento}
                    onChange={e => setFormData({...formData, documento: e.target.value})}
                    onBlur={handleBuscaCnpj} // Aciona a inteligência da ReceitaWS
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                    placeholder={formData.tipoDocumento === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {formData.tipoDocumento === 'PJ' ? 'Nome Fantasia' : 'Nome da Cantina'}
                  </label>
                  <input 
                    type="text" required
                    value={formData.nomeFantasia}
                    onChange={e => setFormData({...formData, nomeFantasia: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium bg-slate-100"
                  />
                </div>
              </div>

              {/* ========================================================
                  BLOCO DE COMPLIANCE: RESPONSÁVEL LEGAL (Condicional) 
                  ======================================================== */}
              {formData.tipoDocumento === 'PJ' ? (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                    <span className="font-bold block mb-1">Compliance Legal (SaaS)</span>
                    É obrigatório designar uma pessoa física (CPF) como responsável legal pela assinatura corporativa.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo do Responsável</label>
                      <input 
                        type="text" required
                        value={formData.nomeResponsavel}
                        onChange={e => setFormData({...formData, nomeResponsavel: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                        placeholder="Nome da pessoa física responsável"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">CPF do Responsável</label>
                      <input 
                        type="text" required
                        value={formData.cpfResponsavel}
                        onChange={e => setFormData({...formData, cpfResponsavel: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Seu Nome Completo</label>
                    <input 
                      type="text" required
                      value={formData.nomeResponsavel}
                      onChange={e => setFormData({...formData, nomeResponsavel: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                      placeholder="Nome do dono da conta"
                    />
                </div>
              )}
              {/* ======================================================== */}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 mt-4">WhatsApp de Contato</label>
                <input 
                  type="text" required
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium"
                  placeholder="(00) 90000-0000"
                />
              </div>
            </div>

            {/* Bloco 3: Localização Geográfica */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Localização</h3>
              
              {/* Linha 1: CEP e Logradouro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">CEP</label>
                  <input 
                    type="text" required maxLength={9}
                    value={formData.cep}
                    onChange={e => setFormData({...formData, cep: e.target.value})}
                    onBlur={handleBuscaCep} // Aciona a inteligência do ViaCEP
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

              {/* Linha 2: Número e Complemento (Restauração da quebra solicitada) */}
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

              {/* Linha 3: Bairro, Cidade e UF (Separados) */}
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

            {/* Ações Finais (Botões de Navegação e Submit) */}
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
                {isLoading ? 'Configurando ambiente...' : 'Começar Teste Grátis'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}