
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractData } from '../../hooks/contract/types';
import { contractTemplatesApi } from '../../hooks/contract/api/contractTemplates';
import { renderContractTemplate } from '@/utils/contract';

interface ContractContentProps {
  contract: ContractData;
}

const ContractContent: React.FC<ContractContentProps> = ({ contract }) => {
  const [templateCss, setTemplateCss] = useState<string>('');
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [renderedContent, setRenderedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Buscar template e CSS quando necessário
  useEffect(() => {
    const fetchTemplateData = async () => {
      console.log('ContractContent: Starting template fetch for contract:', contract.id);
      
      setIsLoading(true);
      setError('');
      
      try {
        let htmlContent = contract.html_content;
        let cssContent = contract.css_content;

        // Se não tem HTML no contrato, buscar template
        if (!htmlContent) {
          console.log('Contract has no HTML content, fetching template...');
          
          const templates = await contractTemplatesApi.getContractTemplates();
          console.log('Available templates:', templates.length);
          
          let selectedTemplate = null;
          
          // Tentar encontrar template específico primeiro
          if (contract.template_id) {
            selectedTemplate = templates.find(t => t.id === contract.template_id);
            console.log('Found specific template:', !!selectedTemplate);
          }
          
          // Se não encontrou template específico, usar template padrão
          if (!selectedTemplate) {
            selectedTemplate = templates.find(t => t.is_default);
            console.log('Using default template:', !!selectedTemplate);
          }
          
          // Se ainda não tem template, usar o primeiro disponível
          if (!selectedTemplate && templates.length > 0) {
            selectedTemplate = templates[0];
            console.log('Using first available template:', selectedTemplate.name);
          }
          
          if (selectedTemplate) {
            console.log('Selected template:', selectedTemplate.name);
            htmlContent = selectedTemplate.html_content;
            
            // Se não tem CSS do contrato, usar CSS do template
            if (!cssContent && selectedTemplate.css_content) {
              console.log('Using template CSS content');
              cssContent = selectedTemplate.css_content;
            }
          } else {
            console.warn('No templates available, using enhanced basic HTML');
            htmlContent = generateEnhancedContractHtml(contract);
          }
        }

        setTemplateHtml(htmlContent || '');
        setTemplateCss(cssContent || '');

        // Renderizar conteúdo com variáveis substituídas
        if (htmlContent) {
          console.log('Rendering contract with variables...');
          const rendered = await renderContractTemplate(htmlContent, cssContent, contract);
          setRenderedContent(rendered);
          console.log('Contract rendered successfully');
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Erro ao carregar template do contrato');
        // Fallback para HTML básico melhorado
        const fallbackHtml = generateEnhancedContractHtml(contract);
        setTemplateHtml(fallbackHtml);
        try {
          const rendered = await renderContractTemplate(fallbackHtml, '', contract);
          setRenderedContent(rendered);
        } catch (renderError) {
          console.error('Error rendering fallback:', renderError);
          setRenderedContent(fallbackHtml);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [contract]);

  // Gerar HTML melhorado com todas as variáveis quando não há template
  const generateEnhancedContractHtml = (contractData: ContractData): string => {
    return `
      <div class="contract-basic">
        <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
        <h2>Cerimonial de {TIPO_EVENTO}</h2>
        
        <div class="contract-parties">
          <h3>CONTRATANTE:</h3>
          <p><strong>Nome:</strong> {NOME_CLIENTE}</p>
          <p><strong>Email:</strong> {EMAIL_CLIENTE}</p>
          <p><strong>Telefone:</strong> {TELEFONE_CLIENTE}</p>
          <p><strong>Endereço:</strong> {ENDERECO_CLIENTE}</p>
          <p><strong>Profissão:</strong> {PROFISSAO_CLIENTE}</p>
          <p><strong>Estado Civil:</strong> {ESTADO_CIVIL}</p>
          
          <h3>CONTRATADA:</h3>
          <p><strong>Nome:</strong> Anrielly Gomes - Mestre de Cerimônia</p>
          <p><strong>Telefone:</strong> (24) 99268-9947</p>
          <p><strong>Email:</strong> contato@anriellygomes.com.br</p>
        </div>
        
        <div class="contract-details">
          <h3>DETALHES DO EVENTO</h3>
          <p><strong>Tipo:</strong> {TIPO_EVENTO}</p>
          <p><strong>Data:</strong> {DATA_EVENTO}</p>
          <p><strong>Horário:</strong> {HORARIO_EVENTO}</p>
          <p><strong>Local:</strong> {LOCAL_EVENTO}</p>
          <p><strong>Valor Total:</strong> {VALOR_TOTAL}</p>
          <p><strong>Entrada:</strong> {ENTRADA} (Data: {DATA_ENTRADA})</p>
          <p><strong>Restante:</strong> {VALOR_RESTANTE} (Data: {DATA_PAGAMENTO_RESTANTE})</p>
        </div>
        
        <div class="contract-terms">
          <h3>TERMOS E CONDIÇÕES</h3>
          <p>1. A contratada se compromete a prestar os serviços de cerimonial conforme acordado.</p>
          <p>2. O pagamento será realizado conforme condições especificadas.</p>
          <p>3. Este contrato possui validade jurídica conforme Lei nº 14.063/2020.</p>
          <p>4. Observações: {OBSERVACOES}</p>
        </div>
        
        <div class="contract-signatures">
          <h3>ASSINATURAS</h3>
          <div class="signatures-row" style="display: flex; justify-content: space-between; margin-top: 40px;">
            <div class="signature-box" style="width: 45%; text-align: center;">
              <h4>Contratante:</h4>
              <div style="min-height: 80px; border: 1px solid #ddd; margin: 10px 0; padding: 10px; background: white;">
                {ASSINATURA_CLIENTE}
              </div>
              <p style="border-top: 1px solid #000; margin-top: 20px; padding-top: 5px;">{NOME_CLIENTE}</p>
            </div>
            
            <div class="signature-box" style="width: 45%; text-align: center;">
              <h4>Contratada:</h4>
              <div style="min-height: 80px; border: 1px solid #ddd; margin: 10px 0; padding: 10px; background: white;">
                {ASSINATURA_CONTRATADA}
              </div>
              <p style="border-top: 1px solid #000; margin-top: 20px; padding-top: 5px;">Anrielly Cristina Costa Gomes</p>
            </div>
          </div>
        </div>
        
        <div class="contract-audit">
          <h3>DADOS DE AUDITORIA E SEGURANÇA</h3>
          <p><strong>Data da Assinatura:</strong> {DATA_ASSINATURA} às {HORA_ASSINATURA}</p>
          <p><strong>IP do Assinante:</strong> {IP}</p>
          <p><strong>Dispositivo:</strong> {DISPOSITIVO}</p>
          <p><strong>Hash do Documento:</strong> {HASH_DOCUMENTO}</p>
          <p><strong>Versão:</strong> {VERSAO} ({DATA_VERSAO})</p>
          
          <div class="legal-validity">
            <h4>⚖️ VALIDADE JURÍDICA</h4>
            <p>Este contrato digital possui validade jurídica conforme:</p>
            <ul>
              <li>Lei nº 14.063/2020 (Assinaturas Eletrônicas)</li>
              <li>Código Civil Brasileiro</li>
              <li>Marco Civil da Internet</li>
            </ul>
            <p>Todos os dados de auditoria foram capturados automaticamente para garantir a autenticidade e integridade do documento.</p>
          </div>
        </div>
      </div>
    `;
  };

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg md:text-xl text-red-600">
            Erro no Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Usando conteúdo básico melhorado...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg md:text-xl">
            Conteúdo do Contrato
          </CardTitle>
          
          {/* Status badges */}
          <div className="flex gap-2">
            {contract.status === 'signed' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✅ Assinado
              </Badge>
            )}
            {contract.signature_data && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                🔒 Auditoria Completa
              </Badge>
            )}
          </div>
        </div>
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
            dangerouslySetInnerHTML={{ __html: renderedContent || 'Carregando...' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContractContent;
