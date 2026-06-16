import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import DemoChatWidget from "@/components/feature/DemoChatWidget";
import HeroSection from "./components/HeroSection";
import PlatformShowcase from "./components/PlatformShowcase";
import FeatureSections from "./components/FeatureSections";
import IntegrationHub from "./components/IntegrationHub";
import SecuritySection from "./components/SecuritySection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <>
      <DemoChatWidget />
      <Navbar />
      <main>
        <HeroSection />
        <PlatformShowcase />
        <FeatureSections />
        <IntegrationHub />
        <SecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}