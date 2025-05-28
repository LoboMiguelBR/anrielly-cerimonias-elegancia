
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Buscar template e CSS quando necessário
  useEffect(() => {
    const fetchTemplateData = async () => {
      console.log('ContractContent: Starting template fetch for contract:', contract.id);
      console.log('Contract has html_content:', !!contract.html_content);
      console.log('Contract has css_content:', !!contract.css_content);
      console.log('Contract template_id:', contract.template_id);

      // Se já tem CSS do contrato, usar ele
      if (contract.css_content) {
        console.log('Using contract CSS content');
        setTemplateCss(contract.css_content);
      }

      // Se já tem HTML do contrato, usar ele
      if (contract.html_content) {
        console.log('Using contract HTML content');
        setTemplateHtml(contract.html_content);
        return;
      }

      // Se não tem HTML no contrato, buscar template
      console.log('Contract has no HTML content, fetching template...');
      setIsLoading(true);
      setError('');
      
      try {
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
          setTemplateHtml(selectedTemplate.html_content);
          
          // Se não tem CSS do contrato, usar CSS do template
          if (!contract.css_content && selectedTemplate.css_content) {
            console.log('Using template CSS content');
            setTemplateCss(selectedTemplate.css_content);
          }
        } else {
          console.warn('No templates available, using enhanced basic HTML');
          setTemplateHtml(generateEnhancedContractHtml(contract));
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Erro ao carregar template do contrato');
        // Fallback para HTML básico melhorado
        setTemplateHtml(generateEnhancedContractHtml(contract));
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
          <div class="signatures-row">
            <div class="signature-box">
              <h4>Contratante:</h4>
              {ASSINATURA_CLIENTE}
              <p>____________________</p>
              <p>{NOME_CLIENTE}</p>
            </div>
            
            <div class="signature-box">
              <h4>Contratada:</h4>
              {ASSINATURA_CONTRATADA}
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

  // Renderizar conteúdo do contrato com template e variáveis substituídas
  const renderContractContent = () => {
    const htmlContent = contract.html_content || templateHtml;
    
    if (!htmlContent) {
      console.warn('No HTML content available for contract');
      return '<p>Carregando conteúdo do contrato...</p>';
    }
    
    console.log('Rendering contract with HTML content length:', htmlContent.length);
    console.log('Contract status:', contract.status);
    console.log('Has signature data:', !!contract.signature_data);
    
    const cssContent = contract.css_content || templateCss;
    console.log('Using CSS content length:', cssContent?.length || 0);
    
    return renderContractTemplate(htmlContent, cssContent, contract);
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
            dangerouslySetInnerHTML={{ __html: renderContractContent() }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContractContent;
