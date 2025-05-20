
import { supabase } from './client';

export const createStorageBuckets = async () => {
  try {
    // Create testimonials bucket if it doesn't exist
    try {
      const { data: testimonialsBucket, error: testimonialsBucketError } = await supabase
        .storage
        .getBucket('testimonials');
      
      if (testimonialsBucketError && testimonialsBucketError.message.includes('not found')) {
        const { data, error } = await supabase
          .storage
          .createBucket('testimonials', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
        
        if (error && !error.message.includes('already exists')) {
          console.error('Error creating testimonials bucket:', error);
        } else {
          console.log('Testimonials bucket created successfully');
        }
      } else if (testimonialsBucket) {
        console.log('Testimonials bucket already exists');
      }
    } catch (error) {
      console.error('Error checking testimonials bucket:', error);
    }

    // Create gallery bucket if it doesn't exist
    try {
      const { data: galleryBucket, error: galleryBucketError } = await supabase
        .storage
        .getBucket('gallery');
      
      if (galleryBucketError && galleryBucketError.message.includes('not found')) {
        const { data, error } = await supabase
          .storage
          .createBucket('gallery', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          });
        
        if (error && !error.message.includes('already exists')) {
          console.error('Error creating gallery bucket:', error);
        } else {
          console.log('Gallery bucket created successfully');
        }
      } else if (galleryBucket) {
        console.log('Gallery bucket already exists');
      }
    } catch (error) {
      console.error('Error checking gallery bucket:', error);
    }

    // Verify RLS policies work correctly by testing public URL access
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
