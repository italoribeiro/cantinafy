// src/components/dashboard/configuracoes/tab-cantina.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/core/contexts/tenant-context';

/**
 * @component TabCantina
 * @description Submódulo de gerenciamento da empresa (Tenant) e status do licenciamento (SaaS).
 * Exibe as informações fiscais básicas e o widget de status da assinatura, incluindo a 
 * regra de negócio de Trial (contagem regressiva) para forçar o Upsell.
 * 
 * @returns {JSX.Element | null} Formulário de dados da cantina e painel de assinatura.
 */
export default function TabCantina() {
  const { session } = useTenant();
  
  // Estado local para controle do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nomeFantasia: session?.nome_fantasia || '',
    // Em um cenário real, esses dados viriam pré-preenchidos do banco via fetch no carregamento
    cnpj: '', 
    telefone: ''
  });

  if (!session) return null;

  // ==========================================
  // REGRA DE NEGÓCIO: CÁLCULO DE TRIAL
  // ==========================================
  // Nota de Engenharia: No futuro, o `diasRestantes` será calculado subtraindo o NOW() do 
  // campo `trial_iniciado_em` que adicionamos na tabela tenants. 
  // Aqui, usamos um valor estático (ex: 5) para validar a UI do MVP.
  const diasRestantesTrial = 5; 
  const isTrialAtivo = diasRestantesTrial > 0;

  /**
   * @function handleUpdateCantina
   * @description Simula a atualização dos dados do Tenant no banco de dados.
   */
  const handleUpdateCantina = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Dados da cantina atualizados com sucesso!');
    }, 800);
  };

  return (
    <div className="max-w-4xl animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Coluna Esquerda: Formulário de Dados Cadastrais */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Dados da Empresa</h3>
          <p className="text-sm text-slate-500">Informações que aparecerão nos cupons e recibos dos clientes.</p>
        </div>

        <form onSubmit={handleUpdateCantina} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Nome Fantasia</label>
            <input 
              type="text" 
              required
              value={formData.nomeFantasia}
              onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">CNPJ / CPF</label>
              <input 
                type="text" 
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700">WhatsApp de Contato</label>
              <input 
                type="text" 
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 90000-0000"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-70"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Coluna Direita: Status da Assinatura (SaaS) */}
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Seu Plano Atual</h3>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-black text-slate-800 uppercase">{session.plano_atual}</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Ativo</span>
          </div>
          
          <p className="text-sm text-slate-600 font-medium mb-6">
            Você tem direito a <strong>{session.limite_usuarios === 999 ? 'usuários ilimitados' : `${session.limite_usuarios} usuários`}</strong>.
          </p>

          {/* Widget Dinâmico do Trial */}
          {isTrialAtivo && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-orange-800 uppercase">Período de Teste</span>
              </div>
              <p className="text-sm font-bold text-orange-900">
                Faltam {diasRestantesTrial} dias para o fim do seu trial.
              </p>
            </div>
          )}

          <Link 
            href="/dashboard/upgrade" 
            className="block w-full py-2.5 bg-red-600 text-white text-center font-bold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
          >
            Assinar Definitivo
          </Link>
        </div>
      </div>

    </div>
  );
}