
-- Criar bucket para propostas se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('proposals', 'proposals', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas de acesso para o bucket proposals
CREATE POLICY "Allow public read access on proposals bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'proposals');

CREATE POLICY "Allow authenticated upload to proposals bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'proposals' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on proposals bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'proposals' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on proposals bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'proposals' AND auth.role() = 'authenticated');
