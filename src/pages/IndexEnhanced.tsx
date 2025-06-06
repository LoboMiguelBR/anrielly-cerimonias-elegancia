
import { useEffect } from 'react';
import { useCMSLandingPageEnhanced } from '@/hooks/useCMSLandingPageEnhanced';
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

const IndexEnhanced = () => {
  const { landingPage, loading, error, lastUpdated } = useCMSLandingPageEnhanced('home');
  
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
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
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

  // Loading state otimizado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4"></div>
          <p className="text-gray-600">Carregando página...</p>
          <p className="text-xs text-gray-400 mt-1">Verificando dados do CMS...</p>
        </div>
      </div>
    );
  }

  // Determinar se deve usar dados do CMS
  const useCMSData = landingPage && Object.keys(landingPage.sections).length > 0;

  console.log('🎯 IndexEnhanced - Status:', {
    useCMSData,
    landingPageTitle: landingPage?.title,
    sectionsCount: landingPage ? Object.keys(landingPage.sections).length : 0,
    availableSections: landingPage ? Object.keys(landingPage.sections) : [],
    error,
    loading,
    lastUpdated: lastUpdated?.toLocaleTimeString()
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        {/* Hero Section - Priorizar CMS */}
        {useCMSData && landingPage.sections.hero ? (
          <div className="animate-on-scroll">
            <DynamicHero
              title={landingPage.sections.hero.title}
              subtitle={landingPage.sections.hero.subtitle}
              backgroundImage={landingPage.sections.hero.background_image}
              ctaPrimary={landingPage.sections.hero.cta_primary}
              ctaSecondary={landingPage.sections.hero.cta_secondary}
              whatsappLink={landingPage.sections.hero.whatsapp_link}
            />
          </div>
        ) : (
          <div className="animate-on-scroll">
            <Hero />
          </div>
        )}

        {/* About Section - Priorizar CMS */}
        {useCMSData && landingPage.sections.about ? (
          <div className="animate-on-scroll">
            <DynamicAbout
              title={landingPage.sections.about.title}
              content={landingPage.sections.about.content}
              image={landingPage.sections.about.image}
            />
          </div>
        ) : (
          <div className="animate-on-scroll">
            <About />
          </div>
        )}

        <div className="animate-on-scroll">
          <Experience />
        </div>

        {/* Services Section - Priorizar CMS */}
        {useCMSData && landingPage.sections.services ? (
          <div className="animate-on-scroll">
            <DynamicServices
              title={landingPage.sections.services.title}
              items={landingPage.sections.services.items}
            />
          </div>
        ) : (
          <div className="animate-on-scroll">
            <Services />
          </div>
        )}

        <div className="animate-on-scroll">
          <Timeline />
        </div>

        <div className="animate-on-scroll">
          <Differentials />
        </div>

        <div className="animate-on-scroll">
          <SpecialRituals />
        </div>

        <div className="animate-on-scroll">
          <Gallery />
        </div>

        <div className="animate-on-scroll">
          <Testimonials />
        </div>

        <div className="animate-on-scroll">
          <ServiceArea />
        </div>

        <div className="animate-on-scroll">
          <FinalCTA />
        </div>

        {/* Contact Section - Mostrar sempre, a menos que explicitamente desabilitado */}
        {useCMSData && landingPage.sections.contact?.show_form === false ? null : (
          <div className="animate-on-scroll">
            <ContactSection />
          </div>
        )}
      </main>
      
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
      
      {/* Debug info em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && useCMSData && (
        <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded opacity-75 z-50">
          CMS: {Object.keys(landingPage.sections).length} seções | 
          Última atualização: {lastUpdated?.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default IndexEnhanced;
