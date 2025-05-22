import { useState } from 'react';
import { HtmlTemplateData } from '../types';
import { toast } from 'sonner';
import { saveHtmlTemplate, updateHtmlTemplate } from '../templateHtmlService';

export const useTemplateActions = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSave = async (
    template: HtmlTemplateData,
    htmlContent: string,
    cssContent: string,
    onSave?: (template: HtmlTemplateData) => Promise<boolean>
  ) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setDebugInfo(null);
      
      // Validate template data
      if (!template.name || template.name.trim() === '') {
        toast.error('O nome do template é obrigatório');
        setSaveError('Nome do template é obrigatório');
        return { success: false, template: null };
      }
      
      if (!htmlContent || htmlContent.trim() === '') {
        toast.error('O conteúdo HTML é obrigatório');
        setSaveError('Conteúdo HTML é obrigatório');
        return { success: false, template: null };
      }
      
      console.log('Saving template:', {
        id: template.id,
        name: template.name,
        htmlContent: htmlContent.length > 50 ? htmlContent.substring(0, 50) + '...' : htmlContent,
        cssContent: cssContent ? (cssContent.length > 50 ? cssContent.substring(0, 50) + '...' : cssContent) : '',
        isDefault: template.isDefault
      });
      
      // Ensure we have complete template data
      const templateToSave: HtmlTemplateData = {
        ...template,
        htmlContent,
        cssContent
      };
      
      let success = false;
      let updatedTemplate = templateToSave;
      
      // If we have onSave callback, use it
      if (onSave) {
        console.log('Using provided onSave callback');
        try {
          success = await onSave(templateToSave);
          console.log('onSave callback result:', success);
        } catch (error: any) {
          console.error('Error in onSave callback:', error);
          throw error;
        }
      } else {
        // Otherwise use our service directly
        console.log('Using direct save method');
        
        if (template.id === 'new') {
          console.log('Creating new template');
          try {
            // Create new template
            const newId = await saveHtmlTemplate({
              name: template.name,
              description: template.description || '',
              htmlContent,
              cssContent,
              variables: template.variables,
              isDefault: template.isDefault
            });
            
            console.log('saveHtmlTemplate returned ID:', newId);
            success = !!newId;
            
            if (success && newId) {
              updatedTemplate = {
                ...templateToSave,
                id: newId
              };
              setDebugInfo(`Template salvo com sucesso! ID: ${newId}`);
            } else {
              setDebugInfo(`Erro: ID não retornado após salvar. Verifique as políticas RLS da tabela.`);
              throw new Error('ID não retornado após salvar');
            }
          } catch (error: any) {
            console.error('Detailed save error:', error);
            setDebugInfo(`Erro ao salvar: ${error.message || JSON.stringify(error)}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
            throw error;
          }
        } else {
          console.log('Updating existing template:', template.id);
          try {
            // Update existing template
            success = await updateHtmlTemplate(template.id, {
              name: template.name,
              description: template.description || '',
              htmlContent,
              cssContent,
              variables: template.variables,
              isDefault: template.isDefault
            });
            
            console.log('updateHtmlTemplate result:', success);
            setDebugInfo(success 
              ? `Template atualizado com sucesso! ID: ${template.id}` 
              : 'Falha na atualização do template. Verifique as políticas RLS da tabela.');
          } catch (error: any) {
            console.error('Detailed update error:', error);
            setDebugInfo(`Erro ao atualizar: ${error.message || JSON.stringify(error)}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
            throw error;
          }
        }
      }
      
      if (success) {
        toast.success('Template salvo com sucesso!');
        return { success: true, template: updatedTemplate };
      } else {
        toast.error('Erro ao salvar template. Verifique as políticas RLS.');
        setSaveError('Falha ao salvar o template no banco de dados. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.');
        return { success: false, template: null };
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(`Erro ao salvar template: ${error.message}`);
      setSaveError(`Erro: ${error.message || "Problema desconhecido"}. Verifique se as políticas RLS estão configuradas na tabela proposal_template_html.`);
      return { success: false, template: null };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveError,
    debugInfo,
    handleSave
  };
};
