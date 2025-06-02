
import { supabase } from '@/integrations/supabase/client';
import { templateStructures } from './templateStructures';

export async function createTemplateStructures() {
  try {
    console.log('Iniciando criação das estruturas de templates...');
    
    // Buscar todos os templates
    const { data: templates, error: templatesError } = await supabase
      .from('questionario_templates')
      .select('*');
    
    if (templatesError) throw templatesError;
    
    for (const template of templates) {
      const structure = templateStructures[template.tipo_evento];
      if (!structure) {
        console.log(`Estrutura não encontrada para tipo: ${template.tipo_evento}`);
        continue;
      }
      
      console.log(`Criando estrutura para template: ${template.nome}`);
      
      // Verificar se já existem seções para este template
      const { data: existingSections } = await supabase
        .from('questionario_template_secoes')
        .select('id')
        .eq('template_id', template.id)
        .limit(1);
      
      if (existingSections && existingSections.length > 0) {
        console.log(`Template ${template.nome} já possui estrutura, pulando...`);
        continue;
      }
      
      // Criar seções
      for (const section of structure.sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('questionario_template_secoes')
          .insert({
            template_id: template.id,
            titulo: section.titulo,
            descricao: section.descricao,
            ordem: section.ordem,
            ativo: true
          })
          .select()
          .single();
        
        if (sectionError) throw sectionError;
        
        // Criar perguntas para a seção
        for (const question of section.questions) {
          const { error: questionError } = await supabase
            .from('questionario_template_perguntas')
            .insert({
              template_id: template.id,
              secao_id: newSection.id,
              texto: question.texto,
              tipo_resposta: question.tipo_resposta,
              placeholder: question.placeholder,
              obrigatoria: question.obrigatoria,
              ordem: question.ordem,
              ativo: true
            });
          
          if (questionError) throw questionError;
        }
      }
      
      console.log(`Estrutura criada para template: ${template.nome}`);
    }
    
    console.log('Criação das estruturas concluída!');
    return true;
  } catch (error) {
    console.error('Erro ao criar estruturas de templates:', error);
    throw error;
  }
}
