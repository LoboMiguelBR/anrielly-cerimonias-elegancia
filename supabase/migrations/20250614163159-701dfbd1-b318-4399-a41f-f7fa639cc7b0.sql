
-- Corrige possíveis índices duplicados e sequencia corretamente os order_index das seções ATIVAS
WITH ord AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY order_index ASC, created_at ASC, id) AS new_index
  FROM cms_home_sections
  WHERE active = TRUE
)
UPDATE cms_home_sections
SET order_index = ord.new_index
FROM ord
WHERE cms_home_sections.id = ord.id
  AND cms_home_sections.order_index <> ord.new_index;

-- Opcional: Mostrar novo estado dos índices após correção:
SELECT id, title, order_index, active FROM cms_home_sections ORDER BY order_index ASC;

