// src/app/dashboard/configuracoes/page.tsx
'use client';

import { useState } from 'react';
import { useTenant } from '@/core/contexts/tenant-context';
import TabPerfil from '@/components/dashboard/configuracoes/tab-perfil';
import TabCantina from '@/components/dashboard/configuracoes/tab-cantina';
import TabEquipe from '@/components/dashboard/configuracoes/tab-equipe';


/**
 * @component ConfiguracoesPage
 * @description Orquestrador do Módulo de Configurações (SaaS Manager do Tenant).
 * Implementa o padrão estrutural de "Tabs" (Abas) para roteamento interno de estado,
 * delegando a lógica de negócio de cada aba para seus respectivos componentes filhos.
 * 
 * @returns {JSX.Element | null} A interface do painel ou null se a sessão estiver bloqueada.
 */
export default function ConfiguracoesPage() {
  const { session } = useTenant();
  
  // Estado local para controle da aba ativa
  const [activeTab, setActiveTab] = useState<'perfil' | 'cantina' | 'equipe'>('perfil');

  // Proteção estrutural: não renderiza o módulo se a sessão não existir
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* ========================================================
          CABEÇALHO GERAL DO MÓDULO
          ======================================================== */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Configurações do Sistema</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie suas preferências de acesso, os dados operacionais da cantina e sua equipe.
        </p>
      </div>

      {/* ========================================================
          NAVEGAÇÃO POR ABAS (TABS MENU)
          ======================================================== */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          <button 
            onClick={() => setActiveTab('perfil')}
            className={`py-3 text-sm font-bold border-b-2 transition-all outline-none ${
              activeTab === 'perfil' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Meu Perfil
          </button>
          
          <button 
            onClick={() => setActiveTab('cantina')}
            className={`py-3 text-sm font-bold border-b-2 transition-all outline-none ${
              activeTab === 'cantina' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dados da Cantina
          </button>
          
          <button 
            onClick={() => setActiveTab('equipe')}
            className={`py-3 text-sm font-bold border-b-2 transition-all outline-none flex items-center gap-2 ${
              activeTab === 'equipe' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Equipe e Acessos
            {/* Tag visual sutil no menu */}
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
              Usuários
            </span>
          </button>
        </nav>
      </div>

      {/* ========================================================
          RENDERIZADOR DE COMPONENTES (VIEWPORT)
          ======================================================== */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        {activeTab === 'perfil' && <TabPerfil />}
        {activeTab === 'cantina' && <TabCantina />}
        {activeTab === 'equipe' && <TabEquipe />}
      </div>

    </div>
  );
}