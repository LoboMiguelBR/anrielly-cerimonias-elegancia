
-- Adicionar campo origin na tabela quote_requests
ALTER TABLE quote_requests 
ADD COLUMN origin text DEFAULT 'site';

-- Comentário para documentar os valores possíveis
COMMENT ON COLUMN quote_requests.origin IS 'Origem do lead: instagram, whatsapp, site, indicacao, outros';

-- Atualizar leads existentes com valor padrão mais realista
UPDATE quote_requests 
SET origin = CASE 
  WHEN RANDOM() < 0.4 THEN 'instagram'
  WHEN RANDOM() < 0.7 THEN 'whatsapp'
  WHEN RANDOM() < 0.9 THEN 'site'
  ELSE 'indicacao'
END
WHERE origin = 'site';
