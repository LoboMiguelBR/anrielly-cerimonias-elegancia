
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCMSSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDefaultData = async () => {
    try {
      setIsSeeding(true);
      console.log('🌱 Iniciando seed dos dados CMS...');

      // 1. Criar página principal se não existir
      const { data: existingPage } = await supabase
        .from('website_pages')
        .select('id')
        .eq('slug', 'home')
        .maybeSingle();

      let pageId = existingPage?.id;

      if (!pageId) {
        const { data: newPage, error: pageError } = await supabase
          .from('website_pages')
          .insert({
            title: 'Página Principal',
            slug: 'home',
            status: 'published',
            page_type: 'home',
            order_index: 0,
            meta_description: 'Cerimônias com emoção, elegância e significado - Anrielly Gomes',
            meta_keywords: 'casamento, cerimônia, celebrante, anrielly gomes'
          })
          .select('id')
          .single();

        if (pageError) throw pageError;
        pageId = newPage.id;
        console.log('✅ Página principal criada:', pageId);
      }

      // 2. Criar seções padrão
      const defaultSections = [
        {
          title: 'Banner Principal',
          section_type: 'hero',
          content: {
            title: 'Anrielly Gomes',
            subtitle: 'Cerimônias com emoção, elegância e significado.',
            background_image: '/lovable-uploads/51ec6ddc-43be-45c4-9c33-1f407dba1411.png',
            cta_primary: 'Solicitar Orçamento',
            cta_secondary: 'Fale no WhatsApp',
            whatsapp_link: 'https://wa.me/5524992689947'
          },
          order_index: 1,
          is_active: true
        },
        {
          title: 'Sobre Mim',
          section_type: 'about',
          content: {
            title: 'Sobre Anrielly Gomes',
            content: 'Com anos de experiência criando momentos únicos e inesquecíveis, transformo cerimônias em celebrações cheias de significado, emoção e personalidade.',
            image: '/lovable-uploads/c2283906-77d8-4d1c-a901-5453ea6dd515.png'
          },
          order_index: 2,
          is_active: true
        },
        {
          title: 'Serviços',
          section_type: 'services',
          content: {
            title: 'Meus Serviços',
            items: [
              {
                title: 'Casamentos',
                description: 'Cerimônias de casamento personalizadas e emocionantes',
                icon: 'Heart'
              },
              {
                title: 'Renovação de Votos',
                description: 'Celebre um novo capítulo da sua história de amor',
                icon: 'Calendar'
              },
              {
                title: 'Cerimônias Especiais',
                description: 'Momentos únicos com o toque especial que merecem',
                icon: 'Award'
              }
            ]
          },
          order_index: 3,
          is_active: true
        },
        {
          title: 'Contato',
          section_type: 'contact',
          content: {
            show_form: true,
            title: 'Entre em Contato'
          },
          order_index: 4,
          is_active: true
        }
      ];

      // Verificar seções existentes
      const { data: existingSections } = await supabase
        .from('website_sections')
        .select('section_type')
        .eq('page_id', pageId);

      const existingTypes = existingSections?.map(s => s.section_type) || [];

      // Inserir apenas seções que não existem
      const sectionsToInsert = defaultSections
        .filter(section => !existingTypes.includes(section.section_type))
        .map(section => ({
          ...section,
          page_id: pageId
        }));

      if (sectionsToInsert.length > 0) {
        const { error: sectionsError } = await supabase
          .from('website_sections')
          .insert(sectionsToInsert);

        if (sectionsError) throw sectionsError;
        console.log('✅ Seções criadas:', sectionsToInsert.map(s => s.section_type));
      }

      // 3. Ativar seções existentes se estiverem inativas
      const { error: updateError } = await supabase
        .from('website_sections')
        .update({ is_active: true })
        .eq('page_id', pageId)
        .eq('is_active', false);

      if (updateError) throw updateError;

      console.log('🎉 Seed concluído com sucesso!');
      toast.success('Sistema CMS inicializado com sucesso!');

    } catch (error) {
      console.error('❌ Erro no seed:', error);
      toast.error('Erro ao inicializar o CMS');
      throw error;
    } finally {
      setIsSeeding(false);
    }
  };

  return {
    seedDefaultData,
    isSeeding
  };
};
