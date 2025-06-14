
import { supabase } from './client';

export const createStorageBuckets = async () => {
  try {
    // Check existing buckets
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketNames = buckets?.map(b => b.name) || [];
    
    const requiredBuckets = ['gallery', 'proposals', 'testimonials'];
    
    for (const bucketName of requiredBuckets) {
      if (!bucketNames.includes(bucketName)) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (error) {
          console.warn(`Erro ao criar bucket ${bucketName}:`, error.message);
        } else {
          console.log(`Bucket ${bucketName} criado com sucesso`);
        }
      }
    }
    
    // Verify buckets are accessible
    for (const bucketName of requiredBuckets) {
      try {
        const { data, error } = await supabase.storage.from(bucketName).list();
        if (error) {
          console.warn(`Bucket ${bucketName} não está acessível:`, error.message);
        } else {
          console.log(`Bucket '${bucketName}' está acessível. Contém ${data?.length || 0} arquivos.`);
        }
      } catch (err) {
        console.warn(`Erro ao verificar bucket ${bucketName}:`, err);
      }
    }
    
    // Test public URL generation
    const testUrl = supabase.storage.from('gallery').getPublicUrl('test.jpg');
    console.log('Public URL de teste para referência:', testUrl.data.publicUrl);
    
  } catch (error) {
    console.error('Erro crítico na configuração de storage:', error);
  }
};
