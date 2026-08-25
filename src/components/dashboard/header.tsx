// src/components/dashboard/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * @component Header
 * @description Cabeçalho corporativo do dashboard com seletor de contexto operacional
 * e menu flutuante (dropdown) de perfil do usuário.
 * 
 * @returns {JSX.Element} O Header renderizado.
 */
export default function Header() {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between relative shadow-sm z-20">
      
      {/* Seletor Operacional de Filial / Escola */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          Operando em:
        </span>
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-600 cursor-pointer">
          <option>Matriz Principal</option>
          <option>Filial 02 - Unidade Norte</option>
        </select>
      </div>

      {/* Perfil e Dropdown Popover */}
      <div className="relative">
        <button 
          type="button"
          onClick={toggleProfileMenu}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none"
          aria-label="Menu do usuário"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">Administrador</p>
            <p className="text-xs font-medium text-slate-500">Dono da Cantina</p>
          </div>
          <div className="w-11 h-11 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center shadow-md shadow-red-600/20 text-lg">
            A
          </div>
        </button>

        {/* Card Dropdown do Perfil */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold border border-slate-200">
                A
              </div>
              <h4 className="font-bold text-slate-900 text-base">Administrador</h4>
              <p className="text-xs text-slate-500 font-medium">totvs.italo@gmail.com</p>
              
              <Link 
                href="/dashboard/perfil" 
                onClick={() => setIsProfileMenuOpen(false)}
                className="mt-3 inline-block px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Editar perfil
              </Link>
            </div>

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

            <div className="pt-3 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => router.push('/login')} 
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