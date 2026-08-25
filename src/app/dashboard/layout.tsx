// src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';

/**
 * @description Layout principal para as rotas autenticadas do sistema.
 * Utiliza CSS Grid/Flexbox para estruturar a Sidebar lateral fixa e o 
 * conteúdo dinâmico (Header + Página) ao lado.
 * 
 * @param {React.ReactNode} children - A página específica que será renderizada no centro.
 * @returns {JSX.Element} A estrutura de layout mestre do painel.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fixa na esquerda */}
      <Sidebar />

      {/* Área principal de conteúdo à direita */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* O conteúdo dinâmico (telas) é injetado aqui */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}