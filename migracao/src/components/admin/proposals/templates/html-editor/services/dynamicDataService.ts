
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage } from '@/components/admin/hooks/gallery/types';
import { Testimonial } from '@/components/admin/hooks/testimonials/types';

export interface DynamicDataOptions {
  limit?: number;
  layout?: 'grid' | 'carousel' | 'list';
  columns?: number;
  showDescription?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
}

/**
 * Busca imagens da galeria para usar em templates
 */
export const fetchGalleryForTemplate = async (options: DynamicDataOptions = {}): Promise<GalleryImage[]> => {
  try {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('order_index', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery for template:', error);
    return [];
  }
};

/**
 * Busca depoimentos aprovados para usar em templates
 */
export const fetchTestimonialsForTemplate = async (options: DynamicDataOptions = {}): Promise<Testimonial[]> => {
  try {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('order_index', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Type assertion to ensure status field matches Testimonial type
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'approved' | 'pending' | 'rejected'
    }));
  } catch (error) {
    console.error('Error fetching testimonials for template:', error);
    return [];
  }
};

/**
 * Gera HTML para galeria de imagens
 */
export const generateGalleryHtml = (images: GalleryImage[], options: DynamicDataOptions = {}): string => {
  const { layout = 'grid', columns = 3, showDescription = true, imageSize = 'medium' } = options;
  
  if (!images || images.length === 0) {
    return '<div class="gallery-placeholder">Nenhuma imagem disponível na galeria</div>';
  }

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48', 
    large: 'w-64 h-64'
  };

  const containerClass = layout === 'grid' 
    ? `grid grid-cols-${columns} gap-4` 
    : layout === 'carousel'
    ? 'flex overflow-x-auto space-x-4 pb-4'
    : 'space-y-4';

  const imageItems = images.map(image => `
    <div class="gallery-item ${layout === 'carousel' ? 'flex-shrink-0' : ''}">
      <img 
        src="${image.image_url}" 
        alt="${image.title || ''}"
        class="${sizeClasses[imageSize]} object-cover rounded-lg shadow-md"
        loading="lazy"
      />
      ${showDescription && image.title ? `
        <div class="gallery-caption mt-2">
          <h4 class="font-medium text-sm">${image.title}</h4>
          ${image.description ? `<p class="text-xs text-gray-600 mt-1">${image.description}</p>` : ''}
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
    <div class="gallery-container ${containerClass}">
      ${imageItems}
    </div>
  `;
};

/**
 * Gera HTML para depoimentos
 */
export const generateTestimonialsHtml = (testimonials: Testimonial[], options: DynamicDataOptions = {}): string => {
  const { layout = 'list', showDescription = true } = options;
  
  if (!testimonials || testimonials.length === 0) {
    return '<div class="testimonials-placeholder">Nenhum depoimento aprovado disponível</div>';
  }

  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
    : layout === 'carousel'
    ? 'flex overflow-x-auto space-x-6 pb-4'
    : 'space-y-6';

  const testimonialItems = testimonials.map(testimonial => `
    <div class="testimonial-item ${layout === 'carousel' ? 'flex-shrink-0 w-80' : ''} bg-gray-50 p-6 rounded-lg">
      <blockquote class="text-gray-700 italic mb-4">
        "${testimonial.quote}"
      </blockquote>
      <div class="testimonial-author flex items-center">
        ${testimonial.image_url ? `
          <img 
            src="${testimonial.image_url}" 
            alt="${testimonial.name}"
            class="w-12 h-12 rounded-full object-cover mr-4"
          />
        ` : ''}
        <div>
          <div class="font-semibold text-gray-900">${testimonial.name}</div>
          <div class="text-sm text-gray-600">${testimonial.role}</div>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="testimonials-container ${containerClass}">
      ${testimonialItems}
    </div>
  `;
};
