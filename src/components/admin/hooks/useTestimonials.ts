
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string | null;
  order_index: number | null;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchTestimonials();
    
    // Ensure bucket exists when component mounts
    const ensureBucketExists = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('testimonials');
        
        if (error && error.message.includes('bucket not found')) {
          const { error: createError } = await supabase.storage.createBucket('testimonials', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
          
          if (createError) {
            console.error('Error creating testimonials bucket:', createError);
            toast.error('Erro ao criar bucket de armazenamento para depoimentos');
          } else {
            console.log('Testimonials bucket created successfully');
          }
        } else if (error) {
          console.error('Error checking testimonials bucket:', error);
        }
      } catch (err) {
        console.error('Unexpected error checking bucket:', err);
      }
    };
    
    ensureBucketExists();
    
    const channel = supabase
      .channel('public:testimonials')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        },
        () => {
          fetchTestimonials();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Erro ao carregar depoimentos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTestimonial = async (formData: { name: string; role: string; quote: string }, uploadImage: File | null) => {
    if (!formData.name || !formData.role || !formData.quote) {
      toast.error('Todos os campos de texto são obrigatórios');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // First check if bucket exists
      if (uploadImage) {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('testimonials');
        
        if (bucketError && bucketError.message.includes('bucket not found')) {
          const { error: createError } = await supabase.storage.createBucket('testimonials', {
            public: true,
            fileSizeLimit: 10485760,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
          
          if (createError) {
            throw new Error(`Erro ao criar bucket de armazenamento: ${createError.message}`);
          }
        } else if (bucketError) {
          throw new Error(`Erro ao verificar bucket de armazenamento: ${bucketError.message}`);
        }
      }
      
      let imageUrl = null;
      
      // Upload image if selected
      if (uploadImage) {
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Create testimonial record
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name,
          role: formData.role,
          quote: formData.quote,
          image_url: imageUrl,
          order_index: testimonials.length
        });
      
      if (insertError) throw insertError;
      
      toast.success('Depoimento adicionado com sucesso!');
      return true;
      
    } catch (error: any) {
      console.error('Error adding testimonial:', error);
      toast.error(`Erro ao adicionar depoimento: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTestimonial = async (
    testimonial: Testimonial, 
    formData: { name: string; role: string; quote: string }, 
    uploadImage: File | null
  ) => {
    if (!testimonial || !formData.name || !formData.role || !formData.quote) {
      toast.error('Todos os campos de texto são obrigatórios');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = testimonial.image_url;
      
      // Upload new image if selected
      if (uploadImage) {
        // Remove old image if exists
        if (testimonial.image_url) {
          const oldFileName = testimonial.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('testimonials')
              .remove([oldFileName]);
          }
        }
        
        // Upload new image
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Update testimonial record
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: formData.name,
          role: formData.role,
          quote: formData.quote,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', testimonial.id);
      
      if (error) throw error;
      
      toast.success('Depoimento atualizado com sucesso!');
      return true;
      
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      toast.error(`Erro ao atualizar depoimento: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTestimonial = async (testimonial: Testimonial) => {
    if (!testimonial) return false;
    
    try {
      // Remove image from storage if exists
      if (testimonial.image_url) {
        const fileName = testimonial.image_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('testimonials')
            .remove([fileName]);
          
          if (storageError) {
            console.error('Storage removal error:', storageError);
            // Continue with deletion from database even if storage removal fails
          }
        }
      }
      
      // Delete from testimonials table
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id);
      
      if (error) throw error;
      
      toast.success('Depoimento removido com sucesso!');
      return true;
      
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      toast.error(`Erro ao excluir: ${error.message}`);
      return false;
    }
  };

  return {
    testimonials,
    isLoading,
    isSubmitting,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
}
