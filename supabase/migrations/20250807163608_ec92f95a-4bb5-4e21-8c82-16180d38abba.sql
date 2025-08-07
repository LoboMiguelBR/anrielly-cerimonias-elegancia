-- Portal do Cliente - Estrutura completa
-- Tabela de acesso ao portal do cliente
CREATE TABLE public.client_portal_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_accessed TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de notificações do cliente
CREATE TABLE public.client_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, reminder
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de timeline do projeto
CREATE TABLE public.project_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  is_visible_to_client BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de documentos do cliente
CREATE TABLE public.client_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, image, document
  file_size INTEGER,
  category TEXT NOT NULL DEFAULT 'general', -- contract, proposal, questionnaire, photo, other
  is_downloadable BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de mensagens entre cliente e cerimonialista
CREATE TABLE public.client_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- client, admin
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]',
  reply_to_id UUID REFERENCES public.client_messages(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de aprovações do cliente
CREATE TABLE public.client_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- proposal, contract, timeline_item, document
  item_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, revision_requested
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  revision_notes TEXT,
  approved_by_name TEXT,
  approved_by_email TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de sessões do portal do cliente
CREATE TABLE public.client_portal_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token_id UUID REFERENCES public.client_portal_access(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  user_agent TEXT,
  ip_address TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_portal_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso do portal
CREATE POLICY "Admins can manage portal access" ON public.client_portal_access
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clients can view their portal access" ON public.client_portal_access
  FOR SELECT USING (true);

-- Políticas para notificações
CREATE POLICY "Admins can manage client notifications" ON public.client_notifications
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can create notifications" ON public.client_notifications
  FOR INSERT WITH CHECK (true);

-- Políticas para timeline
CREATE POLICY "Admins can manage timeline" ON public.project_timeline
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can view visible timeline items" ON public.project_timeline
  FOR SELECT USING (is_visible_to_client = true);

-- Políticas para documentos
CREATE POLICY "Admins can manage documents" ON public.client_documents
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can view downloadable documents" ON public.client_documents
  FOR SELECT USING (is_downloadable = true);

-- Políticas para mensagens
CREATE POLICY "Admins can manage messages" ON public.client_messages
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can view messages" ON public.client_messages
  FOR SELECT USING (true);

CREATE POLICY "Public can create messages" ON public.client_messages
  FOR INSERT WITH CHECK (sender_type = 'client');

-- Políticas para aprovações
CREATE POLICY "Admins can manage approvals" ON public.client_approvals
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can view and update approvals" ON public.client_approvals
  FOR ALL USING (true);

-- Políticas para sessões
CREATE POLICY "System can manage sessions" ON public.client_portal_sessions
  FOR ALL USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_client_portal_access_updated_at
  BEFORE UPDATE ON public.client_portal_access
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_notifications_updated_at
  BEFORE UPDATE ON public.client_notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_timeline_updated_at
  BEFORE UPDATE ON public.project_timeline
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_documents_updated_at
  BEFORE UPDATE ON public.client_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_messages_updated_at
  BEFORE UPDATE ON public.client_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_approvals_updated_at
  BEFORE UPDATE ON public.client_approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_client_portal_access_token ON public.client_portal_access(access_token);
CREATE INDEX idx_client_portal_access_client_id ON public.client_portal_access(client_id);
CREATE INDEX idx_client_notifications_client_id ON public.client_notifications(client_id);
CREATE INDEX idx_client_notifications_is_read ON public.client_notifications(is_read);
CREATE INDEX idx_project_timeline_client_id ON public.project_timeline(client_id);
CREATE INDEX idx_project_timeline_status ON public.project_timeline(status);
CREATE INDEX idx_client_documents_client_id ON public.client_documents(client_id);
CREATE INDEX idx_client_documents_category ON public.client_documents(category);
CREATE INDEX idx_client_messages_client_id ON public.client_messages(client_id);
CREATE INDEX idx_client_messages_sender_type ON public.client_messages(sender_type);
CREATE INDEX idx_client_approvals_client_id ON public.client_approvals(client_id);
CREATE INDEX idx_client_approvals_status ON public.client_approvals(status);
CREATE INDEX idx_client_portal_sessions_token ON public.client_portal_sessions(session_token);

-- Função para gerar token de acesso
CREATE OR REPLACE FUNCTION public.generate_client_portal_access(p_client_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  access_token TEXT;
BEGIN
  -- Desativar tokens existentes
  UPDATE public.client_portal_access 
  SET is_active = false 
  WHERE client_id = p_client_id;
  
  -- Criar novo token
  INSERT INTO public.client_portal_access (client_id)
  VALUES (p_client_id)
  RETURNING access_token INTO access_token;
  
  RETURN access_token;
END;
$$;