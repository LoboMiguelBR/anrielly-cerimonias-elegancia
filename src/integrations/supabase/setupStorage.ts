
import { supabase } from './client';

export const createStorageBuckets = async () => {
  try {
    // Create testimonials bucket if it doesn't exist
    const { data: testimonialsBucket, error: testimonialsBucketError } = await supabase
      .storage
      .createBucket('testimonials', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });
    
    if (testimonialsBucketError && !testimonialsBucketError.message.includes('already exists')) {
      console.error('Error creating testimonials bucket:', testimonialsBucketError);
    } else {
      console.log('Testimonials bucket created or already exists');
    }

    // Create gallery bucket if it doesn't exist
    const { data: galleryBucket, error: galleryBucketError } = await supabase
      .storage
      .createBucket('gallery', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });
    
    if (galleryBucketError && !galleryBucketError.message.includes('already exists')) {
      console.error('Error creating gallery bucket:', galleryBucketError);
    } else {
      console.log('Gallery bucket created or already exists');
    }

    return {
      testimonialsBucket: testimonialsBucket || { name: 'testimonials', id: 'testimonials' },
      galleryBucket: galleryBucket || { name: 'gallery', id: 'gallery' }
    };
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
    return null;
  }
};
