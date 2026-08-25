// src/app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

/**
 * @description Configuração Global de SEO (Search Engine Optimization).
 * Inclui palavras-chave estratégicas para ranqueamento no Google de donos 
 * de cantinas e pequenos restaurantes, além de metadados para redes sociais.
 */
export const metadata: Metadata = {
  title: 'Cantinafy | Sistema de Gestão para Cantinas e Lanchonetes',
  description: 'O melhor software ERP e PDV para donos de cantinas escolares e pequenos restaurantes. Controle vendas, comandas, estoque e acabe com o fiado descontrolado.',
  keywords: [
    'sistema para cantina', 
    'software para cantina escolar', 
    'pdv para lanchonete', 
    'gestão de cantina', 
    'controle de fiado escolar', 
    'erp para lanchonetes', 
    'sistema multi-tenant', 
    'comanda eletronica'
  ],
  authors: [{ name: 'Cantinafy' }],
  openGraph: {
    title: 'Cantinafy | Transforme a gestão da sua cantina',
    description: 'Reduza filas e controle o fiado com o sistema definitivo para cantinas escolares.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cantinafy',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${montserrat.className} bg-white text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}