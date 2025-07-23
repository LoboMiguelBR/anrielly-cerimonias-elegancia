-- FASE 4: INTEGRAÇÕES
-- Tabela para configuração de webhooks
CREATE TABLE public.webhook_configs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL, -- ['lead_created', 'proposal_approved', 'contract_signed', etc.]
    is_active BOOLEAN NOT NULL DEFAULT true,
    secret_key TEXT, -- Para validação de assinatura
    headers JSONB DEFAULT '{}', -- Headers customizados
    retry_attempts INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para logs de webhooks
CREATE TABLE public.webhook_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_config_id UUID NOT NULL REFERENCES public.webhook_configs(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    attempt_number INTEGER DEFAULT 1,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para integrações externas
CREATE TABLE public.external_integrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- 'zapier', 'google_calendar', 'mailchimp', etc.
    type TEXT NOT NULL, -- 'webhook', 'api', 'oauth'
    config JSONB NOT NULL DEFAULT '{}', -- Configurações específicas da integração
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'idle', -- 'idle', 'syncing', 'error'
    sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para backups automáticos
CREATE TABLE public.backup_configs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    backup_type TEXT NOT NULL, -- 'full', 'data_only', 'schema_only'
    schedule_cron TEXT NOT NULL, -- Expressão cron para agendamento
    storage_location TEXT NOT NULL, -- 'supabase_storage', 'external_s3', etc.
    retention_days INTEGER DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_backup TIMESTAMP WITH TIME ZONE,
    backup_status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para logs de backup
CREATE TABLE public.backup_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_config_id UUID NOT NULL REFERENCES public.backup_configs(id) ON DELETE CASCADE,
    backup_size BIGINT, -- Tamanho em bytes
    file_path TEXT,
    status TEXT NOT NULL, -- 'completed', 'failed'
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para configurações de automação avançada
CREATE TABLE public.advanced_automations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL, -- Condições mais complexas
    actions JSONB NOT NULL, -- Ações a serem executadas
    is_active BOOLEAN NOT NULL DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advanced_automations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (apenas admins podem acessar integrações)
CREATE POLICY "Only admins can manage webhooks" ON public.webhook_configs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can view webhook logs" ON public.webhook_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can manage integrations" ON public.external_integrations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can manage backups" ON public.backup_configs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can view backup logs" ON public.backup_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can manage advanced automations" ON public.advanced_automations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Triggers para updated_at
CREATE TRIGGER update_webhook_configs_updated_at
    BEFORE UPDATE ON public.webhook_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_integrations_updated_at
    BEFORE UPDATE ON public.external_integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backup_configs_updated_at
    BEFORE UPDATE ON public.backup_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advanced_automations_updated_at
    BEFORE UPDATE ON public.advanced_automations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_webhook_logs_webhook_config_id ON public.webhook_logs(webhook_config_id);
CREATE INDEX idx_webhook_logs_event_type ON public.webhook_logs(event_type);
CREATE INDEX idx_webhook_logs_sent_at ON public.webhook_logs(sent_at DESC);
CREATE INDEX idx_backup_logs_backup_config_id ON public.backup_logs(backup_config_id);
CREATE INDEX idx_backup_logs_started_at ON public.backup_logs(started_at DESC);

-- Função para disparar webhooks
CREATE OR REPLACE FUNCTION public.trigger_webhooks(
    p_event_type TEXT,
    p_payload JSONB
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Inserir job para processar webhooks via edge function
    INSERT INTO public.webhook_logs (
        webhook_config_id, event_type, payload, attempt_number
    )
    SELECT 
        wc.id, p_event_type, p_payload, 1
    FROM public.webhook_configs wc
    WHERE wc.is_active = true
    AND p_event_type = ANY(wc.events);
END;
$$;

-- Função para limpeza automática de logs antigos
CREATE OR REPLACE FUNCTION public.cleanup_integration_logs()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Manter apenas logs dos últimos 90 dias
    DELETE FROM public.webhook_logs 
    WHERE created_at < now() - INTERVAL '90 days';
    
    DELETE FROM public.backup_logs 
    WHERE created_at < now() - INTERVAL '90 days';
    
    -- Log da limpeza
    INSERT INTO public.automation_logs (
        trigger_record_id, trigger_table, status, 
        actions_executed, execution_time_ms
    ) VALUES (
        gen_random_uuid(), 'cleanup_integrations', 'success',
        '["cleanup_webhook_logs", "cleanup_backup_logs"]'::jsonb, 0
    );
END;
$$;