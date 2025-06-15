
-- Tabela CLIENTES (já existe, garantindo campos essenciais para CRM)
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS historical_interactions jsonb DEFAULT '[]'::jsonb;

-- Tabela FORNECEDORES (suppliers - já existe, garantindo campos para avaliações e contratos)
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS contracts jsonb DEFAULT '[]'::jsonb;

-- Tabela CONFIGURAÇÕES GERAIS DO SISTEMA
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para system_settings (extensível no futuro)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para admin (customize conforme lógica do projeto depois)
CREATE POLICY "Admins podem acessar system_settings"
  ON public.system_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- [PARA EDGE FUNCTIONS e NOTIFICAÇÕES, usaremos as estruturas existentes de proposals/contracts/quote_requests.]

-- Tabela de LOG/NOTIFICAÇÕES internas (opcional)
CREATE TABLE IF NOT EXISTS public.internal_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  user_id uuid,
  read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.internal_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all notifications" ON public.internal_notifications FOR ALL USING (true) WITH CHECK (true);

