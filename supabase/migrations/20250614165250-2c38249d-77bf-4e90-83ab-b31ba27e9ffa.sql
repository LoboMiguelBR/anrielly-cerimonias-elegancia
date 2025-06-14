
-- Remover constraints que fazem referência a tabelas do CMS/landing pages (faça isso antes de dropar tabelas):
-- Adapte/adicione se necessário, dependendo de dependências em seu banco.

-- 1. Remover tabelas do CMS Home
DROP TABLE IF EXISTS cms_assets CASCADE;
DROP TABLE IF EXISTS cms_home_sections CASCADE;

-- 2. Landing Pages & Website Editor
DROP TABLE IF EXISTS landing_page_templates CASCADE;
DROP TABLE IF EXISTS website_pages CASCADE;
DROP TABLE IF EXISTS website_sections CASCADE;
DROP TABLE IF EXISTS website_theme_settings CASCADE;

-- 3. Outros possíveis resíduos (dependendo do seu histórico de migrações):
-- DROP FUNCTION IF EXISTS update_cms_home_sections_updated_at() CASCADE;

-- Não é necessário remover policies explicitamente, pois elas serão removidas com as tabelas.

-- *** Revisar se deseja remover qualquer outra tabela/relacionamento derivado ***

