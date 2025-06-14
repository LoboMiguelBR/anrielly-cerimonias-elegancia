
import React from 'react';
import { useCMSHomeSections } from '@/hooks/useCMSHomeSections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import WebChat from '@/components/WebChat';
import { Toaster } from 'sonner';

const SimplifiedHomePage = () => {
  const { sections, loading, error, timedOut } = useCMSHomeSections();

  const processContentVariables = (content: string, section: any) => {
    return content
      .replace(/\{\{title\}\}/g, section.title || '')
      .replace(/\{\{subtitle\}\}/g, section.subtitle || '')
      .replace(/\{\{cta_label\}\}/g, section.cta_label || '')
      .replace(/\{\{cta_link\}\}/g, section.cta_link || '');
  };

  // Nova verificação: Timeout na consulta ou erro crítico
  if (timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center animate-fade-in">
          <p className="text-red-600 text-lg font-semibold mb-2">
            Tempo limite excedido ao carregar as seções do CMS 😓
          </p>
          <p className="text-gray-500 text-sm">Tente recarregar a página ou entre em contato com o administrador.</p>
          <button
            className="mt-6 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando página CMS personalizada...</p>
          <p className="text-xs text-gray-400 mt-2">Aguarde, estamos buscando o conteúdo &#x2026;</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">Erro ao carregar página inicial 🚨</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <p className="text-xs text-gray-400 mt-4">Verifique sua conexão ou tente recarregar.</p>
        </div>
      </div>
    );
  }

  // Nova verificação: detectar índices duplicados, caso aconteça no banco
  if (
    Array.isArray(sections) &&
    sections.length > 0 &&
    new Set(sections.map(s => s.order_index)).size !== sections.length
  ) {
    // pelo menos 2 indices duplicados
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-orange-600 text-lg font-semibold mb-2">
            Problema de configuração nas seções do CMS 🚧
          </p>
          <p className="text-gray-500 text-sm">
            Existem seções da Home com índices de ordenação duplicados. Peça a um administrador para corrigir no CMS.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Corrija a ordem das seções manualmente no painel do CMS e recarregue esta página.
          </p>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-playfair text-gray-800 mb-2 animate-fade-in">
              Bem-vindo(a) ao site!
            </h2>
            <p className="text-gray-600 text-lg mb-6">Nenhuma seção personalizada cadastrada no CMS.</p>
            <p className="text-xs text-gray-400">Entre na área administrativa para configurar!</p>
          </div>
        </main>
        <Footer />
        <PWAInstallPrompt />
        <WebChat />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main id="main-content">
        {/* Renderizar seções dinâmicas do CMS */}
        {sections.map((section) => (
          <div 
            key={section.id}
            style={{
              backgroundColor: section.bg_color,
              backgroundImage: section.background_image
                ? `url(${section.background_image})`
                : undefined,
              backgroundSize: section.background_image ? 'cover' : undefined,
              backgroundRepeat: section.background_image ? 'no-repeat' : undefined,
              backgroundPosition: section.background_image ? 'center' : undefined
            }}
            className="cms-section animate-fade-in"
          >
            {section.content_html ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: processContentVariables(section.content_html, section)
                }}
              />
            ) : (
              /* Fallback básico se não houver HTML */
              <section className="py-20">
                <div className="container mx-auto px-4 text-center bg-opacity-80">
                  <h2 className="text-4xl font-serif text-primary mb-4">{section.title}</h2>
                  {section.subtitle && (
                    <p className="text-xl text-gray-600 mb-8">{section.subtitle}</p>
                  )}
                  {section.cta_label && section.cta_link && (
                    <a 
                      href={section.cta_link}
                      className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      {section.cta_label}
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        ))}
        
        {/* Seções fixas que devem permanecer inalteradas */}
        <Gallery />
        <Testimonials />
        <ContactSection />
      </main>
      
      <Footer />
      <PWAInstallPrompt />
      <WebChat />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default SimplifiedHomePage;
