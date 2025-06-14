
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Timeline from "@/components/Timeline";
import Differentials from "@/components/Differentials";
import SpecialRituals from "@/components/SpecialRituals";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ServiceArea from "@/components/ServiceArea";
import FinalCTA from "@/components/FinalCTA";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import WebChat from "@/components/WebChat";
import { Toaster } from "sonner";

const IndexEnhanced = () => (
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

export default IndexEnhanced;
