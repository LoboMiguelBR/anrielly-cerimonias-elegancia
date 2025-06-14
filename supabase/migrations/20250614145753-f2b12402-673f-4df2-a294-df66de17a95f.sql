
-- Liberar acesso público de leitura nas tabelas de landing page do CMS para qualquer usuário (autenticado ou não)

-- Permitir SELECT na tabela de páginas (website_pages) para TODOS
CREATE POLICY "Public read for landing pages" 
  ON public.website_pages
  FOR SELECT
  USING (true);

-- Permitir SELECT na tabela de seções (website_sections) para TODOS
CREATE POLICY "Public read for website sections" 
  ON public.website_sections
  FOR SELECT
  USING (true);

-- Ativar Row-Level Security se ainda não estiver
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
