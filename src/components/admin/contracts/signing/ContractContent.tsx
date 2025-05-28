
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractData } from '../../hooks/contract/types';
import { supabase } from '@/integrations/supabase/client';
import { renderContractTemplate } from '@/utils/contractTemplateRenderer';

interface ContractContentProps {
  contract: ContractData;
}

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

  // Renderizar conteúdo do contrato com template e variáveis substituídas
  const renderContractContent = () => {
    if (!contract.html_content) {
      return '<p>Conteúdo do contrato não disponível.</p>';
    }
    
    return renderContractTemplate(
      contract.html_content,
      templateCss || contract.css_content,
      contract
    );
  };

  if (!contract.html_content) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            Conteúdo do Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8 text-gray-500">
            <p>Conteúdo do contrato não disponível.</p>
          </div>
        </CardContent>
      </Card>
    );
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
            dangerouslySetInnerHTML={{ __html: renderContractContent() }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContractContent;
