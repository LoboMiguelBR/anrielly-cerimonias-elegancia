-- FASE 3: MELHORIAS DE UX - Relatórios, Analytics e Performance

-- Tabela para armazenar relatórios personalizados
CREATE TABLE IF NOT EXISTS public.custom_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('financial', 'clients', 'proposals', 'events', 'performance')),
  filters JSONB NOT NULL DEFAULT '{}',
  chart_config JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para métricas e analytics
CREATE TABLE IF NOT EXISTS public.analytics_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('revenue', 'conversion', 'leads', 'events', 'satisfaction')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para cache de dashboards
CREATE TABLE IF NOT EXISTS public.dashboard_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Melhorar sistema de templates existente - adicionar categorização e tags
ALTER TABLE public.proposal_template_html 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE;

-- Adicionar sistema de versionamento para templates
CREATE TABLE IF NOT EXISTS public.template_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.proposal_template_html(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  html_content TEXT NOT NULL,
  css_content TEXT DEFAULT '',
  variables JSONB DEFAULT '{}',
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, version_number)
);

-- Sistema de aprovação para templates
CREATE TABLE IF NOT EXISTS public.template_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.proposal_template_html(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.template_versions(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approval_notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para feedback de templates
CREATE TABLE IF NOT EXISTS public.template_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.proposal_template_html(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  usage_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_feedback ENABLE ROW LEVEL SECURITY;

-- Policies para custom_reports
CREATE POLICY "Authenticated users can manage custom reports" ON public.custom_reports
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies para analytics_metrics
CREATE POLICY "Authenticated users can read analytics metrics" ON public.analytics_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert analytics metrics" ON public.analytics_metrics
  FOR INSERT WITH CHECK (true);

-- Policies para dashboard_cache
CREATE POLICY "System can manage dashboard cache" ON public.dashboard_cache
  FOR ALL USING (true);

-- Policies para template_versions
CREATE POLICY "Authenticated users can manage template versions" ON public.template_versions
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies para template_approvals
CREATE POLICY "Authenticated users can manage template approvals" ON public.template_approvals
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies para template_feedback
CREATE POLICY "Authenticated users can manage template feedback" ON public.template_feedback
  FOR ALL USING (auth.role() = 'authenticated');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_date_type ON public.analytics_metrics(metric_date, metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_name ON public.analytics_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_custom_reports_type ON public.custom_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON public.template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_feedback_template_rating ON public.template_feedback(template_id, rating);

-- Melhorar índices existentes para performance
CREATE INDEX IF NOT EXISTS idx_proposals_status_date ON public.proposals(status, created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_status_date ON public.contracts(status, created_at);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status_date ON public.quote_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_clientes_status_created ON public.clientes(status, created_at);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date_type ON public.financial_transactions(transaction_date, type);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_reports_updated_at
    BEFORE UPDATE ON public.custom_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular métricas automaticamente
CREATE OR REPLACE FUNCTION public.calculate_daily_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_date_val DATE := CURRENT_DATE;
    revenue_total NUMERIC;
    leads_count INTEGER;
    proposals_count INTEGER;
    contracts_count INTEGER;
    conversion_rate NUMERIC;
BEGIN
    -- Calcular receita do dia
    SELECT COALESCE(SUM(amount), 0) INTO revenue_total
    FROM financial_transactions 
    WHERE transaction_date = current_date_val AND type = 'receita';
    
    -- Contar leads do dia
    SELECT COUNT(*) INTO leads_count
    FROM quote_requests 
    WHERE created_at::date = current_date_val;
    
    -- Contar propostas do dia
    SELECT COUNT(*) INTO proposals_count
    FROM proposals 
    WHERE created_at::date = current_date_val;
    
    -- Contar contratos do dia
    SELECT COUNT(*) INTO contracts_count
    FROM contracts 
    WHERE created_at::date = current_date_val;
    
    -- Calcular taxa de conversão (leads para contratos)
    IF leads_count > 0 THEN
        conversion_rate := (contracts_count::NUMERIC / leads_count::NUMERIC) * 100;
    ELSE
        conversion_rate := 0;
    END IF;
    
    -- Inserir ou atualizar métricas
    INSERT INTO analytics_metrics (metric_name, metric_value, metric_date, metric_type)
    VALUES 
        ('daily_revenue', revenue_total, current_date_val, 'revenue'),
        ('daily_leads', leads_count, current_date_val, 'leads'),
        ('daily_proposals', proposals_count, current_date_val, 'leads'),
        ('daily_contracts', contracts_count, current_date_val, 'leads'),
        ('conversion_rate', conversion_rate, current_date_val, 'conversion')
    ON CONFLICT (metric_name, metric_date) DO UPDATE SET
        metric_value = EXCLUDED.metric_value,
        created_at = now();
        
EXCEPTION WHEN OTHERS THEN
    -- Log error silently
    NULL;
END;
$$;

-- Função para gerar relatórios personalizados
CREATE OR REPLACE FUNCTION public.generate_custom_report(
    p_report_type TEXT,
    p_filters JSONB DEFAULT '{}',
    p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB := '{}';
    query_text TEXT;
BEGIN
    CASE p_report_type
        WHEN 'financial' THEN
            result := (
                SELECT jsonb_build_object(
                    'total_revenue', COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0),
                    'total_expenses', COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0),
                    'net_profit', COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE -amount END), 0),
                    'transaction_count', COUNT(*),
                    'period_start', p_date_from,
                    'period_end', p_date_to
                )
                FROM financial_transactions
                WHERE transaction_date BETWEEN p_date_from AND p_date_to
            );
            
        WHEN 'clients' THEN
            result := (
                SELECT jsonb_build_object(
                    'total_clients', COUNT(*),
                    'new_clients', SUM(CASE WHEN created_at::date BETWEEN p_date_from AND p_date_to THEN 1 ELSE 0 END),
                    'active_clients', SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END),
                    'by_event_type', jsonb_object_agg(event_type, type_count)
                )
                FROM (
                    SELECT 
                        event_type,
                        COUNT(*) as type_count
                    FROM clientes
                    WHERE created_at::date BETWEEN p_date_from AND p_date_to
                    GROUP BY event_type
                ) grouped
            );
            
        WHEN 'proposals' THEN
            result := (
                SELECT jsonb_build_object(
                    'total_proposals', COUNT(*),
                    'approved_proposals', SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END),
                    'pending_proposals', SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END),
                    'average_value', ROUND(AVG(total_price), 2),
                    'total_value', SUM(total_price),
                    'period_start', p_date_from,
                    'period_end', p_date_to
                )
                FROM proposals
                WHERE created_at::date BETWEEN p_date_from AND p_date_to
            );
    END CASE;
    
    RETURN result;
END;
$$;