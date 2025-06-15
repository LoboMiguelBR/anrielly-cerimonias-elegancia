
-- Adicionar flag 'ativo' para ativar/desativar usuários no painel admin
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true;

-- Atualizar todos os usuários existentes para ativos por padrão
UPDATE public.profiles SET ativo = true WHERE ativo IS NULL;
