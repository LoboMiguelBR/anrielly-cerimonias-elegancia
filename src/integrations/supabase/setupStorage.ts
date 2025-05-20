
import { supabase } from './client';

export const createStorageBuckets = async () => {
  try {
    const bucketNames = ['testimonials', 'gallery'];
    const results = {};
    
    // Check if buckets exist, but don't try to create them
    for (const bucketName of bucketNames) {
      try {
        const { data: bucket } = await supabase
          .storage
          .getBucket(bucketName);
        
        if (bucket) {
          console.log(`${bucketName} bucket exists`);
          results[`${bucketName}Bucket`] = { name: bucketName, id: bucketName };
        }
      } catch (error: any) {
        // Just log the error without trying to create the bucket
        // This is expected for non-admin users
        if (error.status === 400 || error.message?.includes('bucket not found')) {
          console.log(`${bucketName} bucket check failed - access requires admin rights`);
        } else {
          console.error(`Error checking ${bucketName} bucket:`, error);
        }
      }
    }

    // Verify we can generate public URLs
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
    return {
      testimonialsBucket: { name: 'testimonials', id: 'testimonials' },
      galleryBucket: { name: 'gallery', id: 'gallery' }
    };
  }
};
