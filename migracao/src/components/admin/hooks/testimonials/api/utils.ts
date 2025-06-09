
import { supabase } from '@/integrations/supabase/client';

// Check if the testimonials bucket exists without trying to create it
export const ensureTestimonialsBucketExists = async (): Promise<boolean> => {
  try {
    // Use the correct function to list buckets and check if the 'testimonials' bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Erro ao verificar buckets:', error);
      return false;
    }
    
    const testimonialsBucketExists = buckets.some(bucket => bucket.name === 'testimonials');
    
    if (!testimonialsBucketExists) {
      console.warn('O bucket "testimonials" não existe');
    }
    
    return testimonialsBucketExists;
  } catch (err) {
    console.error('Erro inesperado ao verificar bucket:', err);
    return false;
  }
};

// Helper function to upload an image to the testimonials bucket
export const uploadTestimonialImage = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    // Check if bucket exists
    const bucketExists = await ensureTestimonialsBucketExists();
    if (!bucketExists) {
      console.warn('Testimonials bucket may not exist or user lacks permission to check');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // Upload file with public access
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Ensure correct content type for public access
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading testimonial image:', error);
    throw error;
  }
};

// Helper function to delete an image from the testimonials bucket
export const deleteTestimonialImage = async (imageUrl: string | null): Promise<void> => {
  if (!imageUrl) return;
  
  try {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;
    
    const { error } = await supabase.storage
      .from('testimonials')
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting image:', error);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
