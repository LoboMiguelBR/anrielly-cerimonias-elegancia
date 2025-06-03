
import { useEffect } from 'react';
import { useCMSLandingPage } from '@/hooks/useCMSLandingPage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Differentials from '@/components/Differentials';
import Gallery from '@/components/Gallery';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import SpecialRituals from '@/components/SpecialRituals';
import Testimonials from '@/components/Testimonials';
import Experience from '@/components/Experience';
import ServiceArea from '@/components/ServiceArea';
import FinalCTA from '@/components/FinalCTA';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WebChat from '@/components/WebChat';
import { Toaster } from 'sonner';

// Componentes dinâmicos para CMS
import DynamicHero from '@/components/dynamic/DynamicHero';
import DynamicAbout from '@/components/dynamic/DynamicAbout';
import DynamicServices from '@/components/dynamic/DynamicServices';

const Index = () => {
  const { landingPage, loading } = useCMSLandingPage('home');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // Add CSS for the animated class
    const style = document.createElement('style');
    style.textContent = `
      .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Se estiver carregando dados do CMS, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Se houver dados do CMS, usar componentes dinâmicos
  const useCMSData = landingPage && Object.keys(landingPage.sections).length > 0;

  console.log('Usando dados do CMS:', useCMSData);
  console.log('Landing page data:', landingPage);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        {/* Hero Section - usar CMS se disponível */}
        {useCMSData && landingPage.sections.hero ? (
          <DynamicHero
            title={landingPage.sections.hero.title}
            subtitle={landingPage.sections.hero.subtitle}
            backgroundImage={landingPage.sections.hero.background_image}
            ctaPrimary={landingPage.sections.hero.cta_primary}
            ctaSecondary={landingPage.sections.hero.cta_secondary}
            whatsappLink={landingPage.sections.hero.whatsapp_link}
          />
        ) : (
          <Hero />
        )}

        {/* About Section - usar CMS se disponível */}
        {useCMSData && landingPage.sections.about ? (
          <DynamicAbout
            title={landingPage.sections.about.title}
            content={landingPage.sections.about.content}
            image={landingPage.sections.about.image}
          />
        ) : (
          <About />
        )}

        <Experience />

        {/* Services Section - usar CMS se disponível */}
        {useCMSData && landingPage.sections.services ? (
          <DynamicServices
            title={landingPage.sections.services.title}
            items={landingPage.sections.services.items}
          />
        ) : (
          <Services />
        )}

        <Timeline />
        <Differentials />
        <SpecialRituals />
        <Gallery />
        <Testimonials />
        <ServiceArea />
        <FinalCTA />

        {/* Contact Section - mostrar se configurado no CMS */}
        {useCMSData && landingPage.sections.contact?.show_form !== false ? (
          <ContactSection />
        ) : !useCMSData ? (
          <ContactSection />
        ) : null}
      </main>
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Index;
