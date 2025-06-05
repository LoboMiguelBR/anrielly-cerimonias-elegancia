
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGalleryImages } from '@/components/gallery/useGalleryImages';
import { useTestimonials } from '@/components/admin/hooks/useTestimonials';
import { toast } from 'sonner';

interface HtmlSectionRendererProps {
  htmlTemplate: string;
  variables: Record<string, any>;
  sectionType: string;
  className?: string;
}

const HtmlSectionRenderer: React.FC<HtmlSectionRendererProps> = ({ 
  htmlTemplate, 
  variables, 
  sectionType,
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { images: galleryImages } = useGalleryImages();
  const { testimonials } = useTestimonials();

  // Função para renderizar variáveis no HTML
  const renderHtml = (template: string, vars: Record<string, any>): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return vars[key] || match;
    });
  };

  // Função para carregar galeria dinamicamente
  const loadGallery = () => {
    const container = document.getElementById('gallery-container');
    if (!container || sectionType !== 'gallery') return;

    container.innerHTML = '';
    
    galleryImages.forEach((image) => {
      const imageElement = document.createElement('div');
      imageElement.className = 'group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300';
      imageElement.innerHTML = `
        <div class="aspect-square overflow-hidden">
          <img 
            src="${image.image_url}" 
            alt="${image.title}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div class="p-4">
          <h3 class="font-medium text-gray-900 mb-1">${image.title}</h3>
          ${image.description ? `<p class="text-sm text-gray-600">${image.description}</p>` : ''}
        </div>
      `;
      container.appendChild(imageElement);
    });
  };

  // Função para carregar depoimentos dinamicamente
  const loadTestimonials = () => {
    const container = document.getElementById('testimonials-container');
    if (!container || sectionType !== 'testimonials') return;

    container.innerHTML = '';
    
    const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
    
    approvedTestimonials.forEach((testimonial) => {
      const testimonialElement = document.createElement('div');
      testimonialElement.className = 'bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow';
      testimonialElement.innerHTML = `
        <div class="flex items-center mb-4">
          ${testimonial.image_url ? 
            `<img src="${testimonial.image_url}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover mr-4" />` :
            `<div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mr-4 font-semibold">${testimonial.name.charAt(0)}</div>`
          }
          <div>
            <h4 class="font-semibold text-gray-900">${testimonial.name}</h4>
            <p class="text-sm text-gray-600">${testimonial.role}</p>
          </div>
        </div>
        <p class="text-gray-700 italic">"${testimonial.quote}"</p>
      `;
      container.appendChild(testimonialElement);
    });
  };

  // Função para configurar formulário de contato
  const setupContactForm = () => {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form || sectionType !== 'contact') return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(form);
      
      try {
        const { error } = await supabase
          .from('quote_requests')
          .insert({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            event_type: formData.get('event_type') as string,
            event_date: formData.get('event_date') as string || null,
            event_location: formData.get('event_location') as string,
            message: formData.get('message') as string,
            status: 'aguardando'
          });

        if (error) throw error;

        toast.success('Solicitação enviada com sucesso! Entraremos em contato em breve.');
        form.reset();
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        toast.error('Erro ao enviar solicitação. Tente novamente.');
      }
    };

    form.removeEventListener('submit', handleSubmit);
    form.addEventListener('submit', handleSubmit);
  };

  // Função para configurar modal de depoimentos
  const setupTestimonialModal = () => {
    const button = document.getElementById('add-testimonial-btn');
    if (!button || sectionType !== 'testimonials') return;

    const showModal = () => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-xl font-semibold mb-4">Envie seu Depoimento</h3>
          <form id="testimonial-form" class="space-y-4">
            <input type="text" name="name" placeholder="Seu nome" required class="w-full p-3 border rounded-lg" />
            <input type="email" name="email" placeholder="Seu email" required class="w-full p-3 border rounded-lg" />
            <input type="text" name="role" placeholder="Ex: Noiva, Mãe da noiva..." required class="w-full p-3 border rounded-lg" />
            <textarea name="quote" placeholder="Conte sua experiência..." rows="4" required class="w-full p-3 border rounded-lg resize-none"></textarea>
            <input type="file" name="image" accept="image/*" class="w-full p-2 border rounded-lg" />
            <p class="text-sm text-gray-600">O depoimento será exibido após aprovação do administrador.</p>
            <div class="flex gap-3">
              <button type="submit" class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90">
                Enviar
              </button>
              <button type="button" id="close-modal" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);

      const form = modal.querySelector('#testimonial-form') as HTMLFormElement;
      const closeBtn = modal.querySelector('#close-modal') as HTMLButtonElement;

      const closeModal = () => {
        document.body.removeChild(modal);
      };

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
          const { error } = await supabase
            .from('testimonials')
            .insert({
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              role: formData.get('role') as string,
              quote: formData.get('quote') as string,
              status: 'pending'
            });

          if (error) throw error;

          toast.success('Depoimento enviado! Será exibido após aprovação.');
          closeModal();
        } catch (error) {
          console.error('Erro ao enviar depoimento:', error);
          toast.error('Erro ao enviar depoimento. Tente novamente.');
        }
      });
    };

    button.removeEventListener('click', showModal);
    button.addEventListener('click', showModal);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Renderizar HTML com variáveis
    const processedHtml = renderHtml(htmlTemplate, variables);
    containerRef.current.innerHTML = processedHtml;

    // Configurar funcionalidades específicas por tipo de seção
    setTimeout(() => {
      if (sectionType === 'gallery') {
        loadGallery();
      } else if (sectionType === 'testimonials') {
        loadTestimonials();
        setupTestimonialModal();
      } else if (sectionType === 'contact') {
        setupContactForm();
      }
    }, 100);

  }, [htmlTemplate, variables, sectionType, galleryImages, testimonials]);

  return (
    <div 
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: '' }}
    />
  );
};

export default HtmlSectionRenderer;
