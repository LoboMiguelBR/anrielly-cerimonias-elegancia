
import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Differentials from '@/components/Differentials';
import Gallery from '@/components/Gallery';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import SpecialRituals from '@/components/SpecialRituals';
import Testimonials from '@/components/Testimonials';
import Experience from '@/components/Experience';
import ServiceArea from '@/components/ServiceArea';
import FinalCTA from '@/components/FinalCTA';

const Index = () => {
  useEffect(() => {
    // Observer for animation on scroll
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

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
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
        <ContactForm />
      </main>
      <Footer />
      
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5524992689947"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] z-50 transition-all hover:scale-110"
        aria-label="Contato via WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
};

export default Index;
