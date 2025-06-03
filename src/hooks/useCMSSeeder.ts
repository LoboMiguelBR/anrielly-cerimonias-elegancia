
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCMSSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDefaultData = async () => {
    try {
      setIsSeeding(true);
      
      // 1. Criar página principal se não existir
      const { data: existingPage } = await supabase
        .from('website_pages')
        .select('id')
        .eq('slug', 'home')
        .maybeSingle();

      let pageId = existingPage?.id;

      if (!existingPage) {
        const { data: newPage, error: pageError } = await supabase
          .from('website_pages')
          .insert({
            title: 'Página Principal - Anrielly Gomes',
            slug: 'home',
            page_type: 'home',
            status: 'published',
            meta_description: 'Cerimônias com emoção, elegância e significado - Anrielly Gomes',
            order_index: 0
          })
          .select('id')
          .single();

        if (pageError) throw pageError;
        pageId = newPage.id;
      }

      // 2. Migrar serviços da tabela services para website_sections
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (services && services.length > 0) {
        // Verificar se já existe seção de serviços
        const { data: existingServicesSection } = await supabase
          .from('website_sections')
          .select('id')
          .eq('page_id', pageId)
          .eq('section_type', 'services')
          .maybeSingle();

        if (!existingServicesSection) {
          const servicesData = {
            title: 'Nossos Serviços',
            items: services.map(service => ({
              title: service.title,
              description: service.description,
              icon: service.icon
            }))
          };

          await supabase
            .from('website_sections')
            .insert({
              page_id: pageId,
              section_type: 'services',
              title: 'Serviços',
              content: servicesData,
              is_active: true,
              order_index: 2
            });
        }
      }

      // 3. Criar seções padrão se não existirem
      const defaultSections = [
        {
          section_type: 'hero',
          title: 'Banner Principal',
          order_index: 0,
          content: {
            title: 'Anrielly Gomes',
            subtitle: 'Cerimônias com emoção, elegância e significado.',
            background_image: '/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png',
            cta_primary: 'Solicitar Orçamento',
            cta_secondary: 'Fale no WhatsApp',
            whatsapp_link: 'https://wa.me/5524992689947'
          }
        },
        {
          section_type: 'about',
          title: 'Sobre',
          order_index: 1,
          content: {
            title: 'Sobre a Anrielly',
            content: 'Olá! Sou Anrielly Gomes, uma apaixonada Mestre de Cerimônias com mais de 20 anos de trajetória profissional, marcada por sensibilidade, elegância e compromisso com momentos inesquecíveis.',
            image: '/lovable-uploads/99442f1a-9c10-4e95-a063-bd0bda0a998c.png'
          }
        },
        {
          section_type: 'contact',
          title: 'Contato',
          order_index: 3,
          content: {
            show_form: true,
            title: 'Entre em Contato',
            subtitle: 'Vamos conversar sobre seu evento especial'
          }
        }
      ];

      for (const section of defaultSections) {
        const { data: existingSection } = await supabase
          .from('website_sections')
          .select('id')
          .eq('page_id', pageId)
          .eq('section_type', section.section_type)
          .maybeSingle();

        if (!existingSection) {
          await supabase
            .from('website_sections')
            .insert({
              page_id: pageId,
              ...section,
              is_active: true
            });
        }
      }

      toast.success('Dados iniciais do CMS criados com sucesso!');
      return pageId;
    } catch (error) {
      console.error('Erro ao criar dados iniciais:', error);
      toast.error('Erro ao criar dados iniciais do CMS');
      throw error;
    } finally {
      setIsSeeding(false);
    }
  };

  return { seedDefaultData, isSeeding };
};
