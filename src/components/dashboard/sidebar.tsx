// src/components/dashboard/sidebar.tsx
import Link from 'next/link';

/**
 * @description Componente visual da Barra Lateral (Sidebar) do Dashboard.
 * Renderizado no servidor (Server Component) por padrão, mantendo a leveza no cliente.
 * Contém os links de navegação para os principais módulos do Cantinafy.
 * 
 * @returns {JSX.Element} A interface da barra de navegação lateral.
 */
export default function Sidebar() {
  // Lista de rotas para facilitar a manutenção futura e adição de ícones
  const navItems = [
    { name: 'Visão Geral', path: '/dashboard' },
    { name: 'Frente de Caixa (PDV)', path: '/dashboard/pdv' },
    { name: 'Painel da Cozinha', path: '/dashboard/kds' },
    { name: 'Contas a Receber', path: '/dashboard/financeiro' },
    { name: 'Produtos', path: '/dashboard/produtos' },
    { name: 'Configurações', path: '/dashboard/configuracoes' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col hidden md:flex">
      {/* Logotipo da Empresa */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wider">CANTINAFY</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Rodapé da Sidebar (ex: Logout ou Suporte) */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}