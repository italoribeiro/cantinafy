// src/components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';

/**
 * @interface SidebarProps
 * @description Propriedades para controle do estado da Sidebar retrátil.
 */
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * @component Sidebar
 * @description Barra lateral retrátil de navegação corporativa.
 * Expande e recolhe mantendo ícones e rotas principais acessíveis.
 * 
 * @param {SidebarProps} props - Propriedades de visibilidade e ação de toggle.
 * @returns {JSX.Element} A Sidebar renderizada.
 */
export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside 
      className={`bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col justify-between flex-shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Cabeçalho da Sidebar com Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          {isOpen ? (
            <div className="text-2xl font-black tracking-tighter text-white">
              cantina<span className="text-red-600">fy</span>
            </div>
          ) : (
            <div className="text-2xl font-black tracking-tighter text-white mx-auto">
              c<span className="text-red-600">f</span>
            </div>
          )}
          <button 
            type="button"
            onClick={onToggle} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Recolher ou expandir menu lateral"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* Links de Módulos */}
        <nav className="p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-600/20"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {isOpen && <span className="text-sm">Visão Geral</span>}
          </Link>

          <Link 
            href="/dashboard/pdv" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white font-medium transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {isOpen && <span className="text-sm">Frente de Caixa (PDV)</span>}
          </Link>

          <Link 
            href="/dashboard/produtos" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white font-medium transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {isOpen && <span className="text-sm">Produtos</span>}
          </Link>

          <Link 
            href="/dashboard/financeiro" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white font-medium transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isOpen && <span className="text-sm">Contas a Receber</span>}
          </Link>

          <Link 
            href="/dashboard/configuracoes" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white font-medium transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {isOpen && <span className="text-sm">Configurações</span>}
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        {isOpen ? 'Cantinafy v1.0' : 'v1.0'}
      </div>
    </aside>
  );
}