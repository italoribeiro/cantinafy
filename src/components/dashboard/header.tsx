// src/components/dashboard/header.tsx

/**
 * @description Componente visual do Cabeçalho (Header) do Dashboard.
 * Fornece contexto sobre a filial atual logada e opções de usuário.
 * 
 * @returns {JSX.Element} A interface do cabeçalho superior.
 */
export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      {/* Indicador de Filial (Contexto Multi-tenant) */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Operando em:
        </span>
        <select className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2">
          <option>Matriz - Colégio Central</option>
          <option>Filial - Colégio Zona Sul</option>
        </select>
      </div>

      {/* Informações do Usuário */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold text-slate-900">João da Silva</div>
          <div className="text-xs text-slate-500">Administrador</div>
        </div>
        {/* Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          J
        </div>
      </div>
    </header>
  );
}