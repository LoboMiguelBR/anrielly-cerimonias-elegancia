import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, ArrowLeft, Plus, Eye, Edit } from 'lucide-react';
import { contractApi } from '../../hooks/contract';
import { ContractTemplate } from '../../hooks/contract/types';
import { getAvailableVariables } from '@/utils/contractVariables';
import { toast } from 'sonner';

interface ContractTemplateEditorProps {
  template?: ContractTemplate;
  onSave: () => void;
  onCancel: () => void;
}

const ContractTemplateEditor = ({ template, onSave, onCancel }: ContractTemplateEditorProps) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    html_content: template?.html_content || '',
    css_content: template?.css_content || '',
    is_default: template?.is_default || false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'preview'>('content');

  // Template padrão para novos templates
  const defaultTemplate = `
<div class="contract-template">
  <div class="header">
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CERIMONIAL</h1>
  </div>
  
  <div class="parties">
    <p><strong>CONTRATADA:</strong> Anrielly Cristina Costa Gomes, Mestre de Cerimônia, CPF: 092.005.807-85</p>
    <p><strong>CONTRATANTE:</strong> {{client_name}}, {{civil_status}}, {{client_profession}}</p>
  </div>
  
  <div class="clauses">
    <div class="clause">
      <h2>CLÁUSULA PRIMEIRA – DO OBJETO</h2>
      <p>O presente contrato tem como objeto a prestação de serviços profissionais de cerimonial para o evento "{{event_type}}" a ser realizado no dia {{event_date}}, às {{event_time}}, no endereço {{event_location}}.</p>
    </div>
    
    <div class="clause">
      <h2>CLÁUSULA SEGUNDA – DO PREÇO E CONDIÇÕES DE PAGAMENTO</h2>
      <p>O valor total dos serviços contratados é de {{total_price}} ({{total_price_extenso}}), a ser pago da seguinte forma:</p>
      <p>a) Entrada: {{down_payment}}, a ser paga até {{down_payment_date}};</p>
      <p>b) Saldo: {{remaining_amount}}, a ser pago até {{remaining_payment_date}}.</p>
    </div>
    
    <div class="clause">
      <h2>CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DA CONTRATADA</h2>
      <p>A CONTRATADA se compromete a prestar os serviços de cerimonial com profissionalismo, pontualidade e qualidade.</p>
    </div>
    
    <div class="clause">
      <h2>CLÁUSULA QUARTA – DAS OBRIGAÇÕES DO CONTRATANTE</h2>
      <p>O CONTRATANTE se compromete a efetuar os pagamentos nas datas acordadas.</p>
    </div>
    
    <div class="clause">
      <h2>CLÁUSULA QUINTA – DO CANCELAMENTO</h2>
      <p>Em caso de cancelamento pelo CONTRATANTE com antecedência superior a 30 dias, será devolvido 50% do valor pago.</p>
    </div>
  </div>
  
  <div class="signatures">
    <div class="signature-area">
      <p>Data: {{current_date}} às {{current_time}}</p>
      <p>{{notes}}</p>
      <div class="signature-section">
        <div class="client-signature">
          <p>Assinatura do Cliente:</p>
          {{client_signature}}
        </div>
        <div class="company-signature">
          <p>Assinatura da Contratada:</p>
          {{company_signature}}
        </div>
      </div>
      <div class="audit-info">
        <p><small>Documento assinado digitalmente. IP: {{ip_address}} | Hash: {{document_hash}}</small></p>
      </div>
    </div>
  </div>
</div>
  `;

  const defaultCSS = `
.contract-template {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  line-height: 1.6;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
}

.header h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.parties {
  margin-bottom: 30px;
}

.parties p {
  margin-bottom: 15px;
}

.clauses {
  margin-bottom: 40px;
}

.clause {
  margin-bottom: 25px;
}

.clause h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.clause p {
  margin-bottom: 8px;
  text-align: justify;
}

.signatures {
  margin-top: 50px;
  border-top: 1px solid #ccc;
  padding-top: 30px;
}

.signature-area p {
  margin-bottom: 10px;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
}

.client-signature, .company-signature {
  width: 45%;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  min-height: 60px;
}

.audit-info {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-left: 3px solid #007bff;
  font-size: 12px;
}
  `;

  useEffect(() => {
    if (!template && !formData.html_content) {
      setFormData(prev => ({
        ...prev,
        html_content: defaultTemplate,
        css_content: defaultCSS
      }));
    }
  }, [template]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (!formData.html_content.trim()) {
      toast.error('Conteúdo HTML é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      if (template?.id) {
        await contractApi.updateContractTemplate(template.id, formData);
        toast.success('Template atualizado com sucesso');
      } else {
        await contractApi.createContractTemplate(formData);
        toast.success('Template criado com sucesso');
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  const availableVariables = getAvailableVariables();

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.html_content;
      const newText = text.substring(0, start) + variable + text.substring(end);
      
      setFormData(prev => ({ ...prev, html_content: newText }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {template ? 'Editar Template' : 'Novo Template'}
            </h2>
            <p className="text-gray-600">
              {template ? 'Modifique o template de contrato' : 'Crie um novo template de contrato'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab(activeTab === 'content' ? 'preview' : 'content')}>
            {activeTab === 'content' ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {activeTab === 'content' ? 'Visualizar' : 'Editar'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Template Padrão de Casamento"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
              <Label htmlFor="is_default">Template Padrão</Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva para que tipo de evento este template é adequado"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      {activeTab === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo HTML do Contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="html-content"
                  value={formData.html_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                  placeholder="Digite o conteúdo HTML do contrato..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CSS (Estilos)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.css_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, css_content: e.target.value }))}
                  placeholder="CSS opcional para estilizar o contrato..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Variáveis Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertDescription>
                    Clique em uma variável para inserir no template. Elas serão substituídas automaticamente pelos dados do contrato.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => insertVariable(variable)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {variable}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-white">
              <style dangerouslySetInnerHTML={{ __html: formData.css_content }} />
              <div dangerouslySetInnerHTML={{ __html: formData.html_content }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractTemplateEditor;
