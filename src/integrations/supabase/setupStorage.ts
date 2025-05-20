import { supabase } from './client';

export const createStorageBuckets = async () => {
  const bucketNames = ['testimonials', 'gallery'];

  for (const bucketName of bucketNames) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('');

      if (error) {
        console.warn(`Bucket '${bucketName}' pode não estar acessível ou não existe:`, error.message);
      } else {
        console.log(`Bucket '${bucketName}' está acessível. Contém ${data.length} arquivos.`);
      }
    } catch (error) {
      console.error(`Erro ao acessar bucket '${bucketName}':`, error);
    }
  }

  try {
    const { data } = supabase.storage.from('gallery').getPublicUrl('test.jpg');
    console.log('Public URL de teste:', data.publicUrl);
  } catch (error) {
    console.error('Erro ao gerar URL pública:', error);
  }

  return {
    testimonialsBucket: { name: 'testimonials', id: 'testimonials' },
    galleryBucket: { name: 'gallery', id: 'gallery' }
  };
};
