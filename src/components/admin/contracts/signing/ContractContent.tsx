
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractData } from '../../hooks/contract/types';
import { supabase } from '@/integrations/supabase/client';

interface ContractContentProps {
  contract: ContractData;
}

// Função para combinar HTML com CSS sem dependências externas
const combineContentWithStyles = (htmlContent: string, cssContent?: string): string => {
  if (!cssContent) {
    return htmlContent;
  }

  // Criar um container isolado para o CSS
  const styleTag = `
    <style scoped>
      .contract-content {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }
      .contract-content * {
        max-width: 100%;
      }
      ${cssContent}
    </style>
  `;

  // Se já existe uma tag <style>, substituir
  if (htmlContent.includes('<style>')) {
    return htmlContent.replace(
      /<style[^>]*>[\s\S]*?<\/style>/gi,
      styleTag
    );
  }

  // Adicionar CSS no início do conteúdo
  return `${styleTag}<div class="contract-content">${htmlContent}</div>`;
};

// Função para substituir variáveis sem dependências externas
const replaceVariables = (content: string, contract: ContractData): string => {
  return content
    .replace(/{NOME_CLIENTE}/g, contract.client_name || '')
    .replace(/{EMAIL_CLIENTE}/g, contract.client_email || '')
    .replace(/{TELEFONE_CLIENTE}/g, contract.client_phone || '')
    .replace(/{TIPO_EVENTO}/g, contract.event_type || '')
    .replace(/{DATA_EVENTO}/g, contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '')
    .replace(/{LOCAL_EVENTO}/g, contract.event_location || '')
    .replace(/{VALOR_TOTAL}/g, contract.total_price ? `R$ ${contract.total_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '');
};

const ContractContent: React.FC<ContractContentProps> = ({ contract }) => {
  const [templateCss, setTemplateCss] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Buscar CSS do template se necessário
  useEffect(() => {
    const fetchTemplateCss = async () => {
      if (contract.css_content) {
        setTemplateCss(contract.css_content);
        return;
      }

      if (contract.template_id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('contract_templates')
            .select('css_content')
            .eq('id', contract.template_id)
            .single();

          if (!error && data?.css_content) {
            setTemplateCss(data.css_content);
          }
        } catch (error) {
          console.error('Error fetching template CSS:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTemplateCss();
  }, [contract.css_content, contract.template_id]);

  // Renderizar conteúdo do contrato
  const renderContractContent = () => {
    if (!contract.html_content) return null;
    
    let processedContent = replaceVariables(contract.html_content, contract);
    
    if (templateCss) {
      processedContent = combineContentWithStyles(processedContent, templateCss);
    }
    
    return processedContent;
  };

  if (!contract.html_content) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Conteúdo do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <span className="ml-2 text-gray-600">Carregando conteúdo...</span>
          </div>
        ) : (
          <div 
            className="prose prose-sm sm:prose-base max-w-none overflow-hidden"
            style={{ 
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: renderContractContent() || '' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContractContent;
