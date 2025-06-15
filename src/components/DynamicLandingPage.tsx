import { useParams } from 'react-router-dom';
import { useLandingPageData } from '@/hooks/useLandingPageData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicHero from '@/components/dynamic/DynamicHero';
import DynamicAbout from '@/components/dynamic/DynamicAbout';
import DynamicServices from '@/components/dynamic/DynamicServices';
import Experience from '@/components/Experience';
import Timeline from '@/components/Timeline';
import Differentials from '@/components/Differentials';
import SpecialRituals from '@/components/SpecialRituals';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import ServiceArea from '@/components/ServiceArea';
import FinalCTA from '@/components/FinalCTA';
import ContactSection from '@/components/ContactSection';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WebChat from '@/components/WebChat';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';

const DynamicLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { template, loading, error } = useLandingPageData(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Se não encontrar template ou erro, renderiza página padrão
  if (error || !template) {
    return <Index />;
  }

  const { sections } = template;

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        <DynamicHero
          title={sections.hero?.title}
          subtitle={sections.hero?.subtitle}
          backgroundImage={sections.hero?.background_image}
          ctaPrimary={sections.hero?.cta_primary}
          ctaSecondary={sections.hero?.cta_secondary}
          whatsappLink={sections.hero?.whatsapp_link}
        />
        
        <DynamicAbout
          title={sections.about?.title}
          content={sections.about?.content}
          image={sections.about?.image}
        />
        
        <Experience />
        
        <DynamicServices
          title={sections.services?.title}
          items={sections.services?.items}
        />
        
        <Timeline />
        <Differentials />
        <SpecialRituals />
        <Gallery />
        <Testimonials />
        <ServiceArea />
        <FinalCTA />
        
        {sections.contact?.show_form && <ContactSection />}
      </main>
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default DynamicLandingPage;
