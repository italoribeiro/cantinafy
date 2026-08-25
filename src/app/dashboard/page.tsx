// src/app/(dashboard)/page.tsx

/**
 * @description Página inicial do Dashboard (Visão Geral).
 * Exibirá os indicadores principais da cantina no futuro.
 * 
 * @returns {JSX.Element} A interface de visão geral.
 */
export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">Acompanhe o desempenho da sua cantina hoje.</p>
      </div>

      {/* Cards de Resumo Temporários para compor o visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-1">Vendas Hoje</div>
          <div className="text-3xl font-bold text-slate-900">R$ 0,00</div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-1">Comandas Abertas</div>
          <div className="text-3xl font-bold text-slate-900">0</div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="text-sm font-semibold text-slate-500 mb-1">Fiados a Receber</div>
          <div className="text-3xl font-bold text-slate-900">R$ 0,00</div>
        </div>
      </div>
    </div>
  );
}