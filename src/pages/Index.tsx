
import { useEffect } from 'react';
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
import FloatingWebChat from '@/components/FloatingWebChat';

const Index = () => {
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
      // Clean up the style element
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

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
      <FloatingWebChat />
    </div>
  );
};

export default Index;
