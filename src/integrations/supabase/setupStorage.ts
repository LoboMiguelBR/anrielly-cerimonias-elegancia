
import { supabase } from './client';

export const createStorageBuckets = async () => {
  try {
    // Verificar se os buckets existem, mas não tentar criá-los no cliente
    // pois isso já foi feito via SQL migration
    try {
      const { data: testimonialsBucket } = await supabase
        .storage
        .getBucket('testimonials');
      
      if (testimonialsBucket) {
        console.log('Testimonials bucket exists');
      }
    } catch (error) {
      console.error('Error checking testimonials bucket:', error);
    }

    try {
      const { data: galleryBucket } = await supabase
        .storage
        .getBucket('gallery');
      
      if (galleryBucket) {
        console.log('Gallery bucket exists');
      }
    } catch (error) {
      console.error('Error checking gallery bucket:', error);
    }

    // Verificar se podemos gerar URLs públicas
    try {
      const { data } = supabase.storage.from('gallery').getPublicUrl('test.jpg');
      console.log('Public URL generation successful:', data.publicUrl);
    } catch (error) {
      console.error('Error testing public URL generation:', error);
    }

    return {
      testimonialsBucket: { name: 'testimonials', id: 'testimonials' },
      galleryBucket: { name: 'gallery', id: 'gallery' }
    };
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
    return null;
  }
};
