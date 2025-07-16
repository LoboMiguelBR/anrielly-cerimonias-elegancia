-- FASE 2: AUTOMAÇÕES DO FUNIL
-- 1. Criar sistema de automação de status e fluxo

-- Tabela para controlar automações e fluxos
CREATE TABLE IF NOT EXISTS public.automation_flows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_name text NOT NULL,
    trigger_table text NOT NULL,
    trigger_event text NOT NULL, -- INSERT, UPDATE, DELETE
    conditions jsonb DEFAULT '{}'::jsonb,
    actions jsonb NOT NULL, -- Array de ações a executar
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabela para log de automações executadas
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id uuid REFERENCES public.automation_flows(id),
    trigger_record_id uuid NOT NULL,
    trigger_table text NOT NULL,
    status text DEFAULT 'pending', -- pending, success, error
    actions_executed jsonb DEFAULT '[]'::jsonb,
    error_message text,
    execution_time_ms integer,
    created_at timestamp with time zone DEFAULT now()
);

-- Tabela para follow-ups automáticos
CREATE TABLE IF NOT EXISTS public.scheduled_followups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id uuid NOT NULL,
    record_table text NOT NULL,
    followup_type text NOT NULL, -- email, task, notification
    scheduled_for timestamp with time zone NOT NULL,
    template_data jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending', -- pending, sent, failed, cancelled
    retry_count integer DEFAULT 0,
    max_retries integer DEFAULT 3,
    sent_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_followups ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para automações (apenas admins)
CREATE POLICY "Admins can manage automation flows" ON public.automation_flows
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view automation logs" ON public.automation_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can insert automation logs" ON public.automation_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage scheduled followups" ON public.scheduled_followups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can manage scheduled followups" ON public.scheduled_followups
  FOR ALL WITH CHECK (true);

-- Função para executar automações
CREATE OR REPLACE FUNCTION public.execute_automation_flow(
    p_trigger_table text,
    p_trigger_event text,
    p_record_id uuid,
    p_old_record jsonb DEFAULT NULL,
    p_new_record jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    flow_record record;
    action_item jsonb;
    log_id uuid;
    start_time timestamp;
    execution_time integer;
    actions_executed jsonb[] := '{}';
BEGIN
    start_time := clock_timestamp();
    
    -- Buscar fluxos ativos para esta tabela e evento
    FOR flow_record IN 
        SELECT * FROM automation_flows 
        WHERE trigger_table = p_trigger_table 
        AND trigger_event = p_trigger_event 
        AND is_active = true
    LOOP
        -- Criar log de execução
        INSERT INTO automation_logs (flow_id, trigger_record_id, trigger_table, status)
        VALUES (flow_record.id, p_record_id, p_trigger_table, 'pending')
        RETURNING id INTO log_id;
        
        BEGIN
            -- Executar cada ação do fluxo
            FOR action_item IN SELECT jsonb_array_elements(flow_record.actions)
            LOOP
                -- Adicionar ação executada ao array
                actions_executed := actions_executed || action_item;
                
                -- Executar ação baseada no tipo
                CASE action_item->>'type'
                    WHEN 'notification' THEN
                        -- Criar notificação
                        INSERT INTO notifications (
                            title, message, type, metadata, user_id
                        ) VALUES (
                            action_item->>'title',
                            action_item->>'message',
                            COALESCE(action_item->>'notification_type', 'info'),
                            jsonb_build_object(
                                'trigger_table', p_trigger_table,
                                'trigger_event', p_trigger_event,
                                'record_id', p_record_id
                            ),
                            CASE 
                                WHEN action_item->>'target_user' = 'admin' THEN 
                                    (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
                                ELSE NULL
                            END
                        );
                        
                    WHEN 'email_followup' THEN
                        -- Agendar follow-up por email
                        INSERT INTO scheduled_followups (
                            record_id, record_table, followup_type,
                            scheduled_for, template_data
                        ) VALUES (
                            p_record_id, p_trigger_table, 'email',
                            now() + INTERVAL '1 minute' * COALESCE((action_item->>'delay_minutes')::integer, 5),
                            action_item->'template_data'
                        );
                        
                    WHEN 'status_update' THEN
                        -- Atualizar status baseado na tabela
                        CASE p_trigger_table
                            WHEN 'quote_requests' THEN
                                UPDATE quote_requests 
                                SET status = action_item->>'new_status'
                                WHERE id = p_record_id;
                            WHEN 'proposals' THEN
                                UPDATE proposals 
                                SET status = action_item->>'new_status'
                                WHERE id = p_record_id;
                            WHEN 'contracts' THEN
                                UPDATE contracts 
                                SET status = action_item->>'new_status'
                                WHERE id = p_record_id;
                        END CASE;
                        
                    WHEN 'create_client' THEN
                        -- Converter lead em cliente automaticamente
                        IF p_trigger_table = 'quote_requests' THEN
                            INSERT INTO clientes (
                                name, email, phone, event_type, event_date, 
                                event_location, message, quote_id, origin, status
                            ) 
                            SELECT 
                                p_new_record->>'name',
                                p_new_record->>'email', 
                                p_new_record->>'phone',
                                p_new_record->>'event_type',
                                (p_new_record->>'event_date')::date,
                                p_new_record->>'event_location',
                                p_new_record->>'message',
                                p_record_id,
                                'lead_automatico',
                                'ativo'
                            WHERE NOT EXISTS (
                                SELECT 1 FROM clientes WHERE quote_id = p_record_id
                            );
                        END IF;
                END CASE;
            END LOOP;
            
            -- Calcular tempo de execução
            execution_time := EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000;
            
            -- Atualizar log como sucesso
            UPDATE automation_logs 
            SET status = 'success', 
                actions_executed = array_to_json(actions_executed)::jsonb,
                execution_time_ms = execution_time
            WHERE id = log_id;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log de erro
            UPDATE automation_logs 
            SET status = 'error', 
                error_message = SQLERRM,
                actions_executed = array_to_json(actions_executed)::jsonb,
                execution_time_ms = EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000
            WHERE id = log_id;
        END;
    END LOOP;
END;
$$;

-- Função trigger para automações
CREATE OR REPLACE FUNCTION public.trigger_automation_flow()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    -- Executar automações para INSERT
    IF TG_OP = 'INSERT' THEN
        PERFORM execute_automation_flow(
            TG_TABLE_NAME::text,
            'INSERT',
            NEW.id,
            NULL,
            row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    END IF;
    
    -- Executar automações para UPDATE
    IF TG_OP = 'UPDATE' THEN
        PERFORM execute_automation_flow(
            TG_TABLE_NAME::text,
            'UPDATE',
            NEW.id,
            row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    END IF;
    
    -- Executar automações para DELETE
    IF TG_OP = 'DELETE' THEN
        PERFORM execute_automation_flow(
            TG_TABLE_NAME::text,
            'DELETE',
            OLD.id,
            row_to_json(OLD)::jsonb,
            NULL
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Criar triggers para automação nas tabelas principais
CREATE TRIGGER automation_trigger_quote_requests
    AFTER INSERT OR UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE FUNCTION trigger_automation_flow();

CREATE TRIGGER automation_trigger_proposals
    AFTER INSERT OR UPDATE ON public.proposals
    FOR EACH ROW EXECUTE FUNCTION trigger_automation_flow();

CREATE TRIGGER automation_trigger_contracts
    AFTER INSERT OR UPDATE ON public.contracts
    FOR EACH ROW EXECUTE FUNCTION trigger_automation_flow();

CREATE TRIGGER automation_trigger_events
    AFTER INSERT OR UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION trigger_automation_flow();

-- Inserir fluxos de automação padrão
INSERT INTO public.automation_flows (flow_name, trigger_table, trigger_event, actions) VALUES

-- Fluxo 1: Novo lead recebido
('Novo Lead Recebido', 'quote_requests', 'INSERT', '[
    {
        "type": "notification",
        "title": "Novo Lead Recebido",
        "message": "Um novo lead foi cadastrado no sistema",
        "notification_type": "info",
        "target_user": "admin"
    },
    {
        "type": "email_followup",
        "delay_minutes": 5,
        "template_data": {
            "template": "welcome_lead",
            "subject": "Obrigado pelo seu interesse!"
        }
    }
]'),

-- Fluxo 2: Lead qualificado (status contatado)
('Lead Qualificado', 'quote_requests', 'UPDATE', '[
    {
        "type": "notification",
        "title": "Lead Qualificado",
        "message": "Lead foi qualificado e está pronto para proposta",
        "notification_type": "success",
        "target_user": "admin"
    },
    {
        "type": "email_followup",
        "delay_minutes": 60,
        "template_data": {
            "template": "followup_proposal",
            "subject": "Sua proposta personalizada está sendo preparada"
        }
    }
]'),

-- Fluxo 3: Proposta criada
('Proposta Criada', 'proposals', 'INSERT', '[
    {
        "type": "notification",
        "title": "Nova Proposta Criada",
        "message": "Uma nova proposta foi gerada no sistema",
        "notification_type": "info",
        "target_user": "admin"
    },
    {
        "type": "email_followup",
        "delay_minutes": 1440,
        "template_data": {
            "template": "proposal_followup",
            "subject": "Já teve tempo de analisar nossa proposta?"
        }
    }
]'),

-- Fluxo 4: Contrato assinado
('Contrato Assinado', 'contracts', 'UPDATE', '[
    {
        "type": "notification",
        "title": "Contrato Assinado!",
        "message": "Um contrato foi assinado com sucesso",
        "notification_type": "success",
        "target_user": "admin"
    },
    {
        "type": "create_client",
        "convert_lead": true
    },
    {
        "type": "email_followup",
        "delay_minutes": 5,
        "template_data": {
            "template": "contract_welcome",
            "subject": "Bem-vindo! Próximos passos do seu evento"
        }
    }
]'),

-- Fluxo 5: Evento criado
('Evento Criado', 'events', 'INSERT', '[
    {
        "type": "notification",
        "title": "Novo Evento Criado",
        "message": "Um novo evento foi adicionado ao cronograma",
        "notification_type": "info",
        "target_user": "admin"
    },
    {
        "type": "email_followup",
        "delay_minutes": 10080,
        "template_data": {
            "template": "event_week_reminder",
            "subject": "Seu evento se aproxima - Checklist final"
        }
    }
]');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_automation_flows_trigger ON public.automation_flows(trigger_table, trigger_event, is_active);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON public.automation_logs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_followups_status ON public.scheduled_followups(status, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_followups_record ON public.scheduled_followups(record_id, record_table);

-- Comentários explicativos
COMMENT ON TABLE public.automation_flows IS 'Fluxos de automação configuráveis do sistema';
COMMENT ON TABLE public.automation_logs IS 'Log de execução das automações';
COMMENT ON TABLE public.scheduled_followups IS 'Follow-ups agendados automaticamente';
COMMENT ON FUNCTION public.execute_automation_flow IS 'Executa fluxos de automação baseados em triggers';
COMMENT ON FUNCTION public.trigger_automation_flow IS 'Trigger function para executar automações';