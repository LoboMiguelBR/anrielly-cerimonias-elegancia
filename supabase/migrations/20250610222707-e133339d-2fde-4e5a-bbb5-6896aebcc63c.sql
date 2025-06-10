
-- Tabela para fornecedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  address JSONB DEFAULT '{}',
  rating NUMERIC DEFAULT 0.0,
  price_range TEXT,
  verified BOOLEAN DEFAULT false,
  preferred BOOLEAN DEFAULT false,
  portfolio_images TEXT[],
  website TEXT,
  instagram TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para integrações
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'pending', 'error')),
  enabled BOOLEAN DEFAULT false,
  logo_url TEXT,
  documentation_url TEXT,
  features TEXT[],
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para cache
CREATE TABLE public.cache_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  cache_value JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_suppliers_category ON public.suppliers(category);
CREATE INDEX idx_suppliers_rating ON public.suppliers(rating DESC);
CREATE INDEX idx_integrations_status ON public.integrations(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_cache_key ON public.cache_entries(cache_key);
CREATE INDEX idx_cache_expires ON public.cache_entries(expires_at);

-- RLS policies
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para suppliers (públicas para leitura)
CREATE POLICY "Suppliers can be viewed by everyone" ON public.suppliers
  FOR SELECT USING (true);

CREATE POLICY "Suppliers can be managed by authenticated users" ON public.suppliers
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para integrations (admin only)
CREATE POLICY "Integrations can be managed by authenticated users" ON public.integrations
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para notifications (usuário próprio)
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Políticas para cache (sistema)
CREATE POLICY "Cache can be managed by system" ON public.cache_entries
  FOR ALL USING (true);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Função para limpar cache expirado
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cache_entries 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Popular dados iniciais para integrações
INSERT INTO public.integrations (name, category, description, status, features) VALUES
('Stripe', 'Pagamentos', 'Sistema de pagamentos online', 'inactive', ARRAY['Pagamentos recorrentes', 'Checkout seguro', 'Webhooks']),
('OpenAI', 'AI/ML', 'Inteligência artificial para automação', 'inactive', ARRAY['Geração de texto', 'Análise de sentimento', 'Chatbots']),
('Resend', 'Email', 'Envio de emails transacionais', 'inactive', ARRAY['Templates responsivos', 'Analytics', 'APIs simples']),
('WhatsApp Business', 'Automação', 'Automação de mensagens WhatsApp', 'inactive', ARRAY['Mensagens automáticas', 'Templates aprovados', 'Webhooks']);

-- Popular dados iniciais para fornecedores
INSERT INTO public.suppliers (name, email, phone, category, description, rating, price_range) VALUES
('Foto & Arte Studio', 'contato@fotoarte.com', '(11) 99999-1111', 'fotografia', 'Fotografia profissional para casamentos', 4.8, 'R$ 2.000 - R$ 5.000'),
('Flores & Charme', 'flores@charme.com', '(11) 99999-2222', 'floricultura', 'Arranjos florais personalizados', 4.5, 'R$ 800 - R$ 2.500'),
('Buffet Elegância', 'buffet@elegancia.com', '(11) 99999-3333', 'buffet', 'Buffet completo para eventos', 4.9, 'R$ 80 - R$ 150 por pessoa'),
('DJ Musicália', 'dj@musicalia.com', '(11) 99999-4444', 'musica', 'DJ e sonorização profissional', 4.7, 'R$ 1.200 - R$ 3.000');
