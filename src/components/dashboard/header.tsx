// src/components/dashboard/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/core/contexts/tenant-context';

/**
 * @component Header
 * @description Cabeçalho corporativo do dashboard dinâmico.
 * Consome o estado global (useTenant) para renderizar a identidade real do usuário logado,
 * respeitar a filial ativa e preencher o Popover de Perfil com os dados transacionais do banco.
 * 
 * @returns {JSX.Element | null} O Header reativo renderizado ou null se a sessão estiver carregando.
 */
export default function Header() {
  // 1. Extração do Estado Global e funções de mutação
  const { session, mudarFilialAtiva, logout } = useTenant();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 2. Fallback de Segurança: Aguarda a hidratação antes de desenhar a UI
  if (!session) return null;

  /**
   * @function toggleProfileMenu
   * @description Alterna a visibilidade do modal flutuante de perfil.
   */
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between relative shadow-sm z-20 transition-all">
      
      {/* ========================================================
          SELETOR DE CONTEXTO OPERACIONAL (FILIAIS)
          ======================================================== */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          Operando em:
        </span>
        <select 
          value={session.filial_ativa_id}
          onChange={(e) => mudarFilialAtiva(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-600 cursor-pointer transition-all"
        >
          {/* Renderização dinâmica das filiais atreladas ao CNPJ/Tenant */}
          {session.filiais_disponiveis.map(filial => (
            <option key={filial.id} value={filial.id}>
              {filial.nome}
            </option>
          ))}
        </select>
      </div>

      {/* ========================================================
          BLOCO DO PERFIL (AVATAR E POPMENU)
          ======================================================== */}
      <div className="relative">
        
        {/* Botão Gatilho do Avatar */}
        <button 
          type="button"
          onClick={toggleProfileMenu}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none"
          aria-label="Menu do usuário"
        >
          <div className="text-right hidden sm:block">
            {/* Identidade injetada do Supabase */}
            <p className="text-sm font-bold text-slate-800">{session.nome_usuario}</p>
            <p className="text-xs font-medium text-slate-500">{session.perfil_nome}</p>
          </div>
          <div className="w-11 h-11 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-red-600/20 text-lg">
            {session.iniciais}
          </div>
        </button>

        {/* Modal Flutuante de Perfil (Dropdown) */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold border border-slate-200">
                {session.iniciais}
              </div>
              <h4 className="font-bold text-slate-900 text-base">{session.nome_usuario}</h4>
              <p className="text-xs text-slate-500 font-medium">{session.email}</p>
              
              {/* Tag informativa de Upsell baseada no plano atual */}
              <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase border border-slate-200">
                Plano: {session.plano_atual}
              </span>
              
              <div className="mt-3">
                <Link 
                  href="/dashboard/configuracoes" 
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="inline-block px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Editar perfil
                </Link>
              </div>
            </div>

            {/* Ações de Navegação */}
            <div className="py-3 space-y-1">
              <Link 
                href="/dashboard/ajuda" 
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <span>Central de Ajuda</span>
                <span className="text-xs text-slate-400">Suporte</span>
              </Link>
              <Link 
                href="/dashboard/configuracoes" 
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <span>Configurações do Sistema</span>
              </Link>
            </div>

            {/* Ação de Logout (Destrói a Sessão e os Cookies) */}
            <div className="pt-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={logout} 
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Sair da Plataforma
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}