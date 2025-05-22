
import { HtmlTemplateData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { convertToVariablesRecord } from '../utils/converters';
import { saveHtmlTemplate } from './templateManagementService';

/**
 * Get default template or create a fallback if none exists
 */
export async function getDefaultHtmlTemplate(): Promise<HtmlTemplateData | null> {
  try {
    console.log('Getting default HTML template');
    const { data, error } = await supabase
      .from('proposal_template_html')
      .select('*')
      .eq('is_default', true)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - try to get any template
        console.log('No default template found, trying to get any template');
        return getFallbackTemplate();
      }
      throw error;
    }
    
    if (!data) {
      console.log('No default template found');
      return getFallbackTemplate();
    }
    
    console.log('Found default template:', data.name);
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      htmlContent: data.html_content,
      cssContent: data.css_content || '',
      variables: convertToVariablesRecord(data.variables),
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    console.error('Error fetching default HTML template:', error);
    return getFallbackTemplate();
  }
}

/**
 * Get any template as fallback
 */
async function getFallbackTemplate(): Promise<HtmlTemplateData | null> {
  try {
    const { data } = await supabase
      .from('proposal_template_html')
      .select('*')
      .limit(1);
      
    if (data && data.length > 0) {
      console.log('Using fallback template:', data[0].name);
      return {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description || '',
        htmlContent: data[0].html_content,
        cssContent: data[0].css_content || '',
        variables: convertToVariablesRecord(data[0].variables),
        isDefault: data[0].is_default,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
    }
    
    // If there are no templates at all, create a default one
    return createDefaultTemplate();
  } catch (error) {
    console.error('Error getting fallback template:', error);
    return null;
  }
}

/**
 * Create a simple default template
 */
async function createDefaultTemplate(): Promise<HtmlTemplateData | null> {
  const defaultTemplate: Omit<HtmlTemplateData, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Template Padrão',
    description: 'Template HTML padrão criado automaticamente',
    htmlContent: `
      <div class="proposal">
        <div class="header">
          <h1>{{proposal.client_name}}</h1>
          <p>Proposta para {{proposal.event_type}}</p>
        </div>
        <div class="content">
          <p>Obrigado por considerar nossos serviços para o seu evento!</p>
          <h2>Detalhes do Evento</h2>
          <p><strong>Data:</strong> {{proposal.event_date}}</p>
          <p><strong>Local:</strong> {{proposal.event_location}}</p>
          
          <h2>Serviços Incluídos</h2>
          <ul>
            {{#each proposal.services}}
              <li>{{name}}</li>
            {{/each}}
          </ul>
          
          <h2>Investimento</h2>
          <p><strong>Valor Total:</strong> R$ {{proposal.total_price}}</p>
          <p><strong>Condições de Pagamento:</strong> {{proposal.payment_terms}}</p>
          
          {{#if proposal.notes}}
            <h2>Observações</h2>
            <p>{{proposal.notes}}</p>
          {{/if}}
          
          <div class="footer">
            <p>Proposta válida até {{proposal.validity_date}}</p>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .proposal {
        font-family: 'Playfair Display', serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
      
      h1 {
        font-size: 28px;
        margin-bottom: 10px;
      }
      
      h2 {
        font-size: 22px;
        color: #6C2BD9;
        margin-top: 30px;
      }
      
      ul {
        padding-left: 20px;
      }
      
      .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 14px;
      }
    `,
    variables: {},
    isDefault: true
  };
  
  try {
    console.log('Creating default HTML template');
    const id = await saveHtmlTemplate(defaultTemplate);
    
    if (!id) {
      console.error('Failed to create default template');
      return null;
    }
    
    return {
      ...defaultTemplate,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating default template:', error);
    return null;
  }
}
