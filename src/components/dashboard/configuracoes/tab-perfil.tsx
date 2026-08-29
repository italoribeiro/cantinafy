// src/components/dashboard/configuracoes/tab-perfil.tsx
'use client';

import { useState } from 'react';
import { useTenant } from '@/core/contexts/tenant-context';

/**
 * @component TabPerfil
 * @description Submódulo de Configurações para gestão de dados do próprio usuário autenticado.
 * Controla a exibição e os formulários de atualização de nome, e-mail (readonly) e segurança.
 * Isolado logicamente para manter o orquestrador (page.tsx) limpo.
 * 
 * @returns {JSX.Element | null} Formulário de preferências pessoais.
 */
export default function TabPerfil() {
  const { session } = useTenant();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: session?.nome_usuario || '',
    email: session?.email || ''
  });

  if (!session) return null;

  /**
   * @function handleUpdateProfile
   * @description Aciona a persistência de atualização do perfil no banco de dados.
   * Em implementações futuras, despachará o payload via Server Action.
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação temporária de latência de rede para feedback visual da UI
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Perfil atualizado com sucesso!');
    }, 800);
  };

  return (
    <div className="max-w-2xl animate-in fade-in zoom-in-95 duration-200">
      
      {/* Cabeçalho do Perfil (Identidade Visual) */}
      <div className="mb-6 border-b border-slate-100 pb-6 flex items-center gap-5">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl font-black shadow-inner border border-red-100">
          {session.iniciais}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{session.nome_usuario}</h2>
          <p className="text-sm font-medium text-slate-500">{session.perfil_nome}</p>
          <button className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
            Alterar foto de perfil
          </button>
        </div>
      </div>

      {/* Formulário Base de Dados Cadastrais */}
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">Nome Completo</label>
            <input 
              type="text" 
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-medium transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">E-mail de Acesso</label>
            <input 
              type="email" 
              value={formData.email}
              disabled
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm font-medium bg-slate-50 text-slate-400 cursor-not-allowed"
              title="Para alterar o e-mail de acesso, contate o suporte."
            />
          </div>
        </div>

        {/* Zona de Segurança / Controle de Acesso */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Segurança da Conta</h3>
          <button 
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
          >
            Redefinir minha senha
          </button>
        </div>

        {/* Gatilho de Submissão */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all shadow-md disabled:opacity-70"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>
    </div>
  );
}