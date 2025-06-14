
-- 1. Tabela de assets para imagens/mídias do CMS
CREATE TABLE IF NOT EXISTS public.cms_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  file_type text,
  alt_text text,
  title text,
  description text,
  tags text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Storage bucket para arquivos do CMS (será bucket público)
insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do nothing;

-- 3. Políticas permissivas para uploads/downloads do bucket
-- (Opcional se bucket já é público. Caso necessário adaptar permissão!)

-- 4. Adiciona coluna de imagem de fundo nas seções home do CMS, caso ainda não exista
ALTER TABLE public.cms_home_sections
ADD COLUMN IF NOT EXISTS background_image text;

-- 5. Adiciona coluna de imagem de fundo nas seções de landing pages (website_sections), caso use futura integração
ALTER TABLE public.website_sections
ADD COLUMN IF NOT EXISTS background_image text;

-- 6. Trigger de updated_at nas assets (idempotente com funções padrão)
CREATE OR REPLACE FUNCTION public.update_cms_assets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_cms_assets_updated_at ON public.cms_assets;
CREATE TRIGGER update_cms_assets_updated_at
BEFORE UPDATE ON public.cms_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_cms_assets_updated_at();
