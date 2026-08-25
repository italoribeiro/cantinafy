// src/components/marketing/hero-section.tsx
import Link from 'next/link';

/**
 * @description Hero Section baseada em conversão para SaaS.
 * Utiliza paleta quente (Vermelho/Laranja) para estimular ação no nicho alimentício.
 * Tipografia Montserrat com pesos altos (font-extrabold / font-black).
 * 
 * @returns {JSX.Element} A interface do cabeçalho e primeira dobra.
 */
export default function HeroSection() {
  return (
    <div className="w-full bg-white relative overflow-hidden">
      
      {/* NAVBAR SIMPLIFICADA (Topo) */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* LOGO TIPOGRÁFICA CANTINAFY */}
        <div className="text-3xl font-black tracking-tighter">
          <span className="text-slate-900">cantina</span>
          <span className="text-red-600">fy</span>
        </div>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <Link href="#recursos" className="hover:text-red-600 transition-colors">Recursos</Link>
          <Link href="#planos" className="hover:text-red-600 transition-colors">Planos</Link>
          <Link href="#sobre" className="hover:text-red-600 transition-colors">Sobre</Link>
        </nav>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-red-600 hidden md:block">
            Entrar
          </Link>
          <Link href="/cadastro" className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 shadow-md shadow-red-200 transition-all">
            Começar agora
          </Link>
        </div>
      </header>

      {/* HERO CONTENT (Dividido em 2 colunas) */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* COLUNA ESQUERDA: COPY E CTA */}
        <div className="flex flex-col items-start text-left space-y-6 z-10">
          <div className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full border border-red-100">
            Sistema Completo para Cantinas
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Gestão inteligente para cantinas que <span className="text-red-600">vendem mais.</span>
          </h1>
          
          <p className="text-lg text-slate-600 font-medium max-w-lg">
            Organize vendas, comandas, fila de pedidos, estoque, financeiro e o fiado dos alunos em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/cadastro" 
              className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 hover:bg-red-700 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
            >
              Começar agora
            </Link>
            <Link 
              href="#demonstracao" 
              className="px-8 py-4 bg-white text-slate-800 font-bold rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all text-center flex items-center justify-center gap-2"
            >
              Ver demonstração 
              <span className="text-red-600">▶</span>
            </Link>
          </div>
        </div>

        {/* COLUNA DIREITA: MOCKUP DO SISTEMA (Placeholder elegante) */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col">
          {/* Falso cabeçalho de navegador/sistema */}
          <div className="h-8 bg-slate-800 w-full flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* Área interna do mockup onde no futuro colocaremos uma print real do seu painel */}
          <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 text-center">
             <span className="text-slate-400 font-bold text-xl border-2 border-dashed border-slate-300 p-8 rounded-xl">
               [ Espaço para a imagem do Dashboard Cantinafy ]
             </span>
          </div>
        </div>

      </section>
    </div>
  );
}