// src/components/marketing/feature-section.tsx

/**
 * @interface FeatureProps
 * @description Estrutura de dados para cada item de recurso do sistema.
 */
interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * @description Componente visual que exibe os recursos do sistema.
 * Implementa o design pattern de "Features Grid" sem bordas, 
 * com ícones vazados na cor principal (vermelho) conforme a identidade visual.
 * 
 * @returns {JSX.Element} A seção de recursos renderizada.
 */
export default function FeaturesSection() {
  const features: FeatureProps[] = [
    {
      title: "PDV Rápido e Intuitivo",
      description: "Frente de caixa ultra simples e ágil para vender mais em menos tempo.",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Comandas e Mesas",
      description: "Controle comandas e balcões de forma eficiente e sem erros de anotação.",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Fila de Pedidos",
      description: "Organize a fila de preparo e entregue pedidos na ordem certa (KDS).",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    },
    {
      title: "Estoque Inteligente",
      description: "Controle seu estoque e receba alertas de produtos baixos automaticamente.",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Relatórios Completos",
      description: "Acompanhe vendas, produtos, horários e indicadores em tempo real.",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Financeiro Integrado",
      description: "Receitas, despesas, fluxo de caixa e conciliação (fiado) em um só lugar.",
      icon: (
        <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    }
  ];

  return (
    <section id="recursos" className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Cabeçalho da Seção */}
        <div className="mb-16">
          <span className="text-red-600 text-xs font-bold uppercase tracking-widest mb-4 block">Recursos</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Tudo que sua cantina precisa <br/>
            <span className="text-slate-400 font-medium">para funcionar melhor</span>
          </h2>
        </div>
        
        {/* Grid de Recursos (3 colunas no desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-6 p-4 rounded-2xl bg-red-50 group-hover:bg-red-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}