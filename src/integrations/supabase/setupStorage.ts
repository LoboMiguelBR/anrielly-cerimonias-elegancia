
import { supabase } from './client';

export const createStorageBuckets = async () => {
  const bucketNames = ['testimonials', 'gallery', 'proposals'];

  for (const bucketName of bucketNames) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list('');

      if (error) {
        console.warn(`Bucket '${bucketName}' pode não estar acessível ou não existe:`, error.message);
        
        // Try to create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: bucketName === 'proposals'
        });
        
        if (createError) {
          console.error(`Erro ao criar bucket '${bucketName}':`, createError.message);
        } else {
          console.log(`Bucket '${bucketName}' criado com sucesso.`);
        }
      } else {
        console.log(`Bucket '${bucketName}' está acessível. Contém ${data.length} arquivos.`);
      }
    } catch (error) {
      console.error(`Erro ao acessar bucket '${bucketName}':`, error);
    }
  }

  try {
    // Teste de geração de URL pública para verificar o formato
    const { data } = supabase.storage.from('gallery').getPublicUrl('test.jpg');
    console.log('Public URL de teste para referência:', data.publicUrl);
  } catch (error) {
    console.error('Erro ao gerar URL pública:', error);
  }

  return {
    testimonialsBucket: { name: 'testimonials', id: 'testimonials' },
    galleryBucket: { name: 'gallery', id: 'gallery' },
    proposalsBucket: { name: 'proposals', id: 'proposals' }
  };
};
