
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Differentials from '@/components/Differentials';
import Timeline from '@/components/Timeline';
import Experience from '@/components/Experience';
import SpecialRituals from '@/components/SpecialRituals';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import ServiceArea from '@/components/ServiceArea';
import ContactSection from '@/components/ContactSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-white to-purple-50">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Differentials />
        <Timeline />
        <Experience />
        <SpecialRituals />
        <Testimonials />
        <Gallery />
        <ServiceArea />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
