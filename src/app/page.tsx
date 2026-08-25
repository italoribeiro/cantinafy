// src/app/page.tsx
import HeroSection from '@/components/marketing/hero-section';
import FeaturesSection from '@/components/marketing/feature-section';
import PricingSection from '@/components/marketing/pricing-section';
import FooterSection from '@/components/marketing/footer-section';
import WhatsappButton from '@/components/marketing/whatsapp-button';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FooterSection />
      
      {/* Botão flutuante injetado globalmente na Landing Page */}
      <WhatsappButton />
    </main>
  );
}