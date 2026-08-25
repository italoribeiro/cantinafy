// src/components/marketing/footer-section.tsx
import Link from 'next/link';

/**
 * @description Componente de Rodapé (Footer) e CTA Final.
 * Inclui o banner de conversão ("Pronto para transformar...") 
 * e a navegação estrutural para as páginas institucionais e suporte.
 * 
 * @returns {JSX.Element} O Footer completo da Landing Page.
 */
export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white mt-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BANNER CTA - Gradiente Vermelho Vibrante */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-red-500/20 transform -translate-y-12">
          <div className="text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              Pronto para transformar <br className="hidden md:block" /> a gestão da sua cantina?
            </h2>
            <p className="text-red-100 font-medium text-lg">
              Comece agora e veja a diferença no seu dia a dia.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Link 
              href="/cadastro" 
              className="px-10 py-4 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all text-lg mb-3"
            >
              Começar agora
            </Link>
            <span className="text-red-100 text-sm font-medium">
              Teste grátis por 7 dias. Sem compromisso.
            </span>
          </div>
        </div>

        {/* ESTRUTURA DO RODAPÉ (Grid 5 Colunas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-100">
          
          {/* Coluna 1: Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-black tracking-tighter mb-4">
              <span className="text-slate-900">cantina</span>
              <span className="text-red-600">fy</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              Sistema completo de gestão para cantinas, lanchonetes e estabelecimentos de alimentação.
            </p>
            {/* Ícones Sociais Simples */}
            <div className="flex gap-4 text-slate-400">
              <Link href="#" className="hover:text-red-600 transition-colors"><span>(FB)</span></Link>
              <Link href="#" className="hover:text-red-600 transition-colors"><span>(IG)</span></Link>
              <Link href="#" className="hover:text-red-600 transition-colors"><span>(LI)</span></Link>
            </div>
          </div>

          {/* Coluna 2: Produto */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produto</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="#recursos" className="hover:text-red-600 transition-colors">Recursos</Link></li>
              <li><Link href="#planos" className="hover:text-red-600 transition-colors">Planos</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Integrações</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Novidades</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Empresa */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="#" className="hover:text-red-600 transition-colors">Sobre nós</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Contato</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Trabalhe conosco</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Suporte */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Suporte</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="#" className="hover:text-red-600 transition-colors">Central de ajuda</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Tutoriais</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Fale conosco</Link></li>
              <li><Link href="#" className="hover:text-red-600 transition-colors">Status do sistema</Link></li>
            </ul>
          </div>

          {/* Coluna 5: Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-4">Newsletter</h4>
            <p className="text-slate-500 text-sm mb-4 font-medium leading-relaxed">
              Receba dicas e novidades sobre gestão de cantinas.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent font-medium"
              />
              <button 
                type="button" 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Inscrever-se na newsletter"
              >
                {/* Ícone de Seta/Avião de Papel Simples */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>

        </div>

        {/* Copyright e Links Legais */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between text-sm font-medium text-slate-400">
          <p>© {currentYear} Cantinafy. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-slate-600 transition-colors">Termos de uso</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Política de privacidade</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}