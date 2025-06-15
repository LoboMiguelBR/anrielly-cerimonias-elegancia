
ALTER TABLE public.event_tasks
ADD COLUMN order_index integer DEFAULT 0;

-- Opcional: atualize o valor do campo order_index conforme a ordem de criação para tarefas já existentes
UPDATE public.event_tasks
SET order_index = sub.rownum - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY created_at ASC) as rownum
  FROM public.event_tasks
) as sub
WHERE public.event_tasks.id = sub.id;
