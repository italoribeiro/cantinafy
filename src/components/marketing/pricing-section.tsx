// src/components/marketing/pricing-section.tsx

/**
 * @description Componente da Tabela de Preços (Pricing).
 * Estrutura 4 planos (Básico, Profissional, Avançado, Premium).
 * O plano Profissional recebe destaque visual (borda, botão sólido e badge) 
 * para guiar a decisão de compra do usuário.
 * 
 * @returns {JSX.Element} A seção de planos renderizada.
 */
export default function PricingSection() {
  return (
    <section id="planos" className="w-full py-24 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Cabeçalho */}
        <div className="mb-12">
          <span className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4 block">Planos</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Escolha o plano ideal<br/>para sua cantina
          </h2>
        </div>

        {/* Toggle Mensal/Anual (Apenas visual por enquanto) */}
        <div className="flex items-center justify-center mb-16">
          <div className="bg-white p-1 rounded-full border border-slate-200 inline-flex items-center">
            <button className="px-6 py-2 rounded-full text-sm font-bold bg-slate-100 text-slate-900">Mensal</button>
            <button className="px-6 py-2 rounded-full text-sm font-bold text-slate-500 flex items-center gap-2 hover:text-slate-900 transition-colors">
              Anual <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Economize 20%</span>
            </button>
          </div>
        </div>

        {/* Grid de 4 Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch text-left">
          
          {/* 1. PLANO BÁSICO */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col hover:border-red-200 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Básico</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Ideal para cantinas pequenas.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">R$ 79</span>
              <span className="text-sm font-medium text-slate-500"> /mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> PDV</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Comandas</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Estoque básico</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Relatórios essenciais</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Até 1 usuário</li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors mt-auto">
              Começar agora
            </button>
          </div>

          {/* 2. PLANO PROFISSIONAL (DESTAQUE) */}
          <div className="bg-white rounded-2xl p-8 border-2 border-red-600 flex flex-col relative shadow-xl shadow-red-600/10 transform lg:-translate-y-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              Mais Escolhido
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Profissional</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Para cantinas que querem crescer.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">R$ 149</span>
              <span className="text-sm font-medium text-slate-500"> /mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-700 font-semibold">
              <li className="flex items-center gap-3"><span className="text-red-600">✓</span> Tudo do plano Básico</li>
              <li className="flex items-center gap-3"><span className="text-red-600">✓</span> Fila de pedidos</li>
              <li className="flex items-center gap-3"><span className="text-red-600">✓</span> Financeiro</li>
              <li className="flex items-center gap-3"><span className="text-red-600">✓</span> Relatórios avançados</li>
              <li className="flex items-center gap-3"><span className="text-red-600">✓</span> Até 3 usuários</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition-colors mt-auto">
              Começar agora
            </button>
          </div>

          {/* 3. PLANO AVANÇADO */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col hover:border-red-200 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Avançado</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Mais controle e integração para sua gestão.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">R$ 229</span>
              <span className="text-sm font-medium text-slate-500"> /mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Tudo do plano Profissional</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Estoque avançado</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Integração financeira</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Múltiplas unidades</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Até 10 usuários</li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors mt-auto">
              Começar agora
            </button>
          </div>

          {/* 4. PLANO PREMIUM */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col hover:border-red-200 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Premium</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">Para redes de cantinas e operações maiores.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-slate-900">R$ 379</span>
              <span className="text-sm font-medium text-slate-500"> /mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Tudo do plano Avançado</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Usuários ilimitados</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Relatórios personalizados</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> Suporte prioritário</li>
              <li className="flex items-center gap-3"><span className="text-red-500">✓</span> API e integrações</li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors mt-auto">
              Começar agora
            </button>
          </div>

        </div>

        {/* Rodapé Informativo */}
        <p className="text-sm font-medium text-slate-500 mt-12">
          Todos os planos incluem: atualizações gratuitas • backup diário • suporte via chat
        </p>
      </div>
    </section>
  );
}