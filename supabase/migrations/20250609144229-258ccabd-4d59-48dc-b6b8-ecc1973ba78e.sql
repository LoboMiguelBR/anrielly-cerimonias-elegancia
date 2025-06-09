
-- Criar tabela para gerenciar assets do CMS
CREATE TABLE public.cms_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  alt_text TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_cms_assets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER cms_assets_updated_at
  BEFORE UPDATE ON public.cms_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cms_assets_updated_at();

-- Criar bucket para armazenar imagens do CMS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-assets', 
  'cms-assets', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Criar políticas para o bucket cms-assets
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'cms-assets');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cms-assets');

CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'cms-assets');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'cms-assets');
