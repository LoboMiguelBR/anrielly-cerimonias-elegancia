
import React from 'react';
import { useCMSLandingPageEnhanced } from '@/hooks/useCMSLandingPageEnhanced';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HtmlSectionRenderer from '@/components/dynamic/HtmlSectionRenderer';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WebChat from '@/components/WebChat';
import { Toaster } from 'sonner';

// Componentes de fallback para quando não há CMS
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Experience from '@/components/Experience';
import Timeline from '@/components/Timeline';
import Differentials from '@/components/Differentials';
import SpecialRituals from '@/components/SpecialRituals';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import ServiceArea from '@/components/ServiceArea';
import FinalCTA from '@/components/FinalCTA';
import ContactSection from '@/components/ContactSection';

const CMSLandingPage = () => {
  const { landingPage, loading, error } = useCMSLandingPageEnhanced('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Carregando página...</p>
          <p className="text-xs text-gray-400 mt-1">Verificando dados do CMS...</p>
        </div>
      </div>
    );
  }

  // Verificar se o CMS está configurado
  const useCMSData = landingPage && Object.keys(landingPage.sections || {}).length > 0;

  console.log('🎯 CMSLandingPage - Status:', {
    useCMSData,
    landingPageTitle: landingPage?.title,
    sectionsCount: landingPage ? Object.keys(landingPage.sections || {}).length : 0,
    availableSections: landingPage ? Object.keys(landingPage.sections || {}) : [],
    error,
    loading
  });

  if (error || !useCMSData) {
    // Fallback para componentes estáticos se CMS não estiver configurado
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Services />
          <Timeline />
          <Differentials />
          <SpecialRituals />
          <Gallery />
          <Testimonials />
          <ServiceArea />
          <FinalCTA />
          <ContactSection />
        </main>
        <Footer />
        <PWAInstallPrompt />
        <WebChat />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Renderizar usando sistema CMS
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        {/* Renderizar seções dinamicamente do CMS */}
        {Object.entries(landingPage.sections).map(([sectionType, sectionData]) => (
          <HtmlSectionRenderer
            key={sectionType}
            htmlTemplate={(sectionData as any).html_template || ''}
            variables={(sectionData as any).variables || sectionData}
            sectionType={sectionType}
            className="cms-section"
          />
        ))}
        
        {/* Seções de fallback se não estiverem no CMS */}
        {!landingPage.sections.experience && <Experience />}
        {!landingPage.sections.timeline && <Timeline />}
        {!landingPage.sections.differentials && <Differentials />}
        {!landingPage.sections.special_rituals && <SpecialRituals />}
        {!landingPage.sections.service_area && <ServiceArea />}
        {!landingPage.sections.final_cta && <FinalCTA />}
      </main>
      
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
      
      {/* Debug info em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && useCMSData && (
        <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded opacity-75 z-50">
          CMS: {Object.keys(landingPage.sections).length} seções | 
          Página: {landingPage.title}
        </div>
      )}
    </div>
  );
};

export default CMSLandingPage;
