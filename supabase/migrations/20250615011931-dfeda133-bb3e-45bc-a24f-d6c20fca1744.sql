
-- Criação da tabela event_tasks vinculada à tabela events
CREATE TABLE public.event_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date,
  assigned_to text, -- nome ou e-mail do responsável (futuramente pode virar FK para profiles)
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security (regras a serem ajustadas depois conforme a estratégia multi-tenant)
ALTER TABLE public.event_tasks ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir tudo para usuários autenticados (ajustar se houver usuários externos)
CREATE POLICY "Permitir tudo para autenticados" ON public.event_tasks
  USING (true);

