
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import WebChat from "@/components/WebChat";
import { Toaster } from "sonner";

const StaticHomePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        <section className="py-16 text-center bg-gradient-to-b from-purple-100 to-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary font-playfair">
            Bem-vindo à plataforma de eventos e cerimonial!
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            Soluções modernas para eventos únicos e memoráveis.
          </p>
        </section>
        <section className="py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Sobre Nós</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Conectando pessoas, ideias e celebrações. Gerencie contratos, propostas, questionários e garanta a melhor experiência em seu evento!
          </p>
        </section>
        <Gallery />
        <Testimonials />
        <section className="py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Diferenciais</h2>
          <ul className="max-w-xl mx-auto text-gray-700 list-disc list-inside text-left">
            <li>Gestão completa online de clientes e eventos</li>
            <li>Criação e assinatura digital de contratos</li>
            <li>Painel administrativo intuitivo</li>
            <li>Propostas e questionários automáticos</li>
            <li>Atendimento personalizado</li>
          </ul>
        </section>
        <ContactSection />
      </main>
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default StaticHomePage;
