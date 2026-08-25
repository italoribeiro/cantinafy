// src/app/(marketing)/page.tsx
import HeroSection from '@/components/marketing/hero-section';
import FeaturesSection from '@/components/marketing/feature-section';
import PricingSection from '@/components/marketing/pricing-section';

/**
 * @description Landing Page Component (View Layer).
 * This is the main page for the Cantinafy SaaS marketing site.
 * It is composed purely of presentational components to maintain high cohesion
 * and low coupling.
 *
 * @returns {JSX.Element} The assembled landing page.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 
        Hero Section: The first impression. Focused on the core value proposition
        and the primary Call to Action (CTA).
      */}
      <HeroSection />

      {/* 
        Features Section: Details the specific problems the SaaS solves
        (e.g., queues, payments, management).
      */}
      <FeaturesSection />

      {/* 
        Pricing Section: Presents the subscription tiers (Multi-tenant structure).
      */}
      <PricingSection />
    </main>
  );
}