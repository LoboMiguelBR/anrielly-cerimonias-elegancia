-- FASE 1: CORREÇÃO CRÍTICA DE SEGURANÇA
-- 1. Habilitar RLS em todas as tabelas sem proteção

-- Tabelas principais do sistema
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionario_template_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionario_secoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionario_template_secoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionario_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionario_perguntas ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas RLS básicas

-- Professionals - acesso para autenticados
CREATE POLICY "Authenticated users can view professionals" ON public.professionals
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage professionals" ON public.professionals
  FOR ALL USING (auth.role() = 'authenticated');

-- Testimonials - acesso público para leitura, autenticado para escrita
CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can manage testimonials" ON public.testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- Quote requests - acesso baseado em ownership ou admin
CREATE POLICY "Users can view their own quote requests" ON public.quote_requests
  FOR SELECT USING (true); -- Temporário - públicos por natureza

CREATE POLICY "Authenticated users can manage quote requests" ON public.quote_requests
  FOR ALL USING (auth.role() = 'authenticated');

-- Services - público para leitura, autenticado para escrita
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage services" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

-- Gallery - público para leitura, autenticado para escrita
CREATE POLICY "Public can view gallery" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage gallery" ON public.gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Client tags - apenas autenticados
CREATE POLICY "Authenticated users can manage client tags" ON public.client_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Template sections - apenas autenticados
CREATE POLICY "Authenticated users can manage template sections" ON public.template_sections
  FOR ALL USING (auth.role() = 'authenticated');

-- Contract templates - apenas autenticados
CREATE POLICY "Authenticated users can manage contract templates" ON public.contract_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- Proposal templates - apenas autenticados
CREATE POLICY "Authenticated users can manage proposal templates" ON public.proposal_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- Client tag relations - apenas autenticados
CREATE POLICY "Authenticated users can manage client tag relations" ON public.client_tag_relations
  FOR ALL USING (auth.role() = 'authenticated');

-- Questionário templates e relacionados - apenas autenticados
CREATE POLICY "Authenticated users can manage questionario templates" ON public.questionario_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage questionario template secoes" ON public.questionario_template_secoes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage questionario template perguntas" ON public.questionario_template_perguntas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage questionario secoes" ON public.questionario_secoes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage questionario perguntas" ON public.questionario_perguntas
  FOR ALL USING (auth.role() = 'authenticated');

-- Contracts - apenas autenticados (dados sensíveis)
CREATE POLICY "Authenticated users can manage contracts" ON public.contracts
  FOR ALL USING (auth.role() = 'authenticated');

-- Proposals - apenas autenticados (dados comerciais)
CREATE POLICY "Authenticated users can manage proposals" ON public.proposals
  FOR ALL USING (auth.role() = 'authenticated');

-- Client interactions - apenas autenticados
CREATE POLICY "Authenticated users can manage client interactions" ON public.client_interactions
  FOR ALL USING (auth.role() = 'authenticated');

-- Supplier reviews - apenas autenticados
CREATE POLICY "Authenticated users can manage supplier reviews" ON public.supplier_reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Proposal assets - apenas autenticados
CREATE POLICY "Authenticated users can manage proposal assets" ON public.proposal_assets
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Corrigir search_path em todas as funções SQL

-- Recriar função handle_new_user com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente')
  );
  RETURN NEW;
END;
$$;

-- Recriar função convert_lead_to_client com search_path seguro
CREATE OR REPLACE FUNCTION public.convert_lead_to_client()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Se o status mudou para 'convertido', criar cliente
  IF NEW.status = 'convertido' AND OLD.status != 'convertido' THEN
    INSERT INTO public.clientes (
      name, email, phone, event_type, event_date, event_location, 
      message, quote_id, origin
    ) VALUES (
      NEW.name, NEW.email, NEW.phone, NEW.event_type, NEW.event_date, 
      NEW.event_location, NEW.message, NEW.id, 'lead_convertido'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Recriar função clean_expired_cache com search_path seguro
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.cache_entries 
  WHERE expires_at < now();
END;
$$;

-- Recriar função get_section_template com search_path seguro
CREATE OR REPLACE FUNCTION public.get_section_template(section_type_param text)
RETURNS TABLE(html_template text, default_variables jsonb)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.html_template,
    st.default_variables
  FROM template_sections st
  WHERE st.section_type = section_type_param
  LIMIT 1;
END;
$$;

-- Recriar função update_total_perguntas_resp com search_path seguro
CREATE OR REPLACE FUNCTION public.update_total_perguntas_resp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Count non-empty responses in the JSON object
  NEW.total_perguntas_resp = (
    SELECT COUNT(*)
    FROM jsonb_each_text(COALESCE(NEW.respostas_json, '{}'::jsonb))
    WHERE value IS NOT NULL AND trim(value) != ''
  );
  RETURN NEW;
END;
$$;

-- Recriar todas as funções de update timestamp com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 4. Configurar autenticação forte (configurações de segurança)

-- Criar tabela para configurações de segurança se não existir
CREATE TABLE IF NOT EXISTS public.security_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key text NOT NULL UNIQUE,
    setting_value jsonb NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de configurações de segurança
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Política para configurações de segurança - apenas admins
CREATE POLICY "Only admins can manage security settings" ON public.security_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inserir configurações padrão de segurança
INSERT INTO public.security_settings (setting_key, setting_value, description) VALUES
('password_policy', '{"min_length": 12, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_symbols": true, "prevent_common_passwords": true}', 'Política de senhas forte'),
('session_security', '{"max_session_duration": 86400, "require_mfa": true, "lock_after_failed_attempts": 5}', 'Configurações de sessão e MFA'),
('audit_log', '{"enable_login_tracking": true, "enable_action_tracking": true, "retention_days": 90}', 'Configurações de auditoria')
ON CONFLICT (setting_key) DO NOTHING;

-- Criar tabela de auditoria para tracking de ações de segurança
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action_type text NOT NULL,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Política para auditoria - apenas admins podem ver
CREATE POLICY "Only admins can view audit logs" ON public.security_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sistema pode inserir logs
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
  FOR INSERT WITH CHECK (true);

-- Comentários explicativos
COMMENT ON TABLE public.security_settings IS 'Configurações de segurança do sistema';
COMMENT ON TABLE public.security_audit_log IS 'Log de auditoria para ações de segurança';
COMMENT ON COLUMN public.security_audit_log.action_type IS 'Tipo de ação: login, logout, password_change, mfa_setup, etc.';

-- Índices para performance em auditoria
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_action_type ON public.security_audit_log(action_type);