// src/app/dashboard/layout.tsx
'use client';

import { useState, ReactNode } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';

/**
 * @interface DashboardLayoutProps
 * @description Propriedades do layout mestre contendo os filhos a serem renderizados.
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * @component DashboardRootLayout
 * @description Orquestrador mestre da área restrita da aplicação.
 * Integra a Sidebar retrátil ao Header corporativo e encapsula a área de conteúdo.
 * 
 * @param {DashboardLayoutProps} props - Children das rotas filhas.
 * @returns {JSX.Element} Layout estruturado.
 */
export default function DashboardRootLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar Retrátil */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(prev => !prev)} 
      />

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}