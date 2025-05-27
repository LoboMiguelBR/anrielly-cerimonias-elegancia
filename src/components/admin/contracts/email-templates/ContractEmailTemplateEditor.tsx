
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Code, HelpCircle } from 'lucide-react';
import { contractApi } from '../../hooks/contract';
import { ContractEmailTemplate, ContractEmailTemplateFormData, EMAIL_TEMPLATE_TYPES } from '../../hooks/contract/types';
import { emailTemplateVariables } from '../../../../utils/emailVariables';
import { toast } from 'sonner';

interface ContractEmailTemplateEditorProps {
  template?: ContractEmailTemplate;
  onSave: () => void;
  onCancel: () => void;
}

const ContractEmailTemplateEditor = ({ template, onSave, onCancel }: ContractEmailTemplateEditorProps) => {
  const [formData, setFormData] = useState<ContractEmailTemplateFormData>({
    name: '',
    description: '',
    subject: '',
    html_content: '',
    template_type: 'signature',
    is_default: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        subject: template.subject,
        html_content: template.html_content,
        template_type: template.template_type,
        is_default: template.is_default || false
      });
    }
  }, [template]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      toast.error('Nome, assunto e conteúdo são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      if (template) {
        await contractApi.updateContractEmailTemplate(template.id, formData);
        toast.success('Template de email atualizado com sucesso');
      } else {
        await contractApi.createContractEmailTemplate(formData);
        toast.success('Template de email criado com sucesso');
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar template de email:', error);
      toast.error('Erro ao salvar template de email');
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = formData.html_content.substring(0, start) + variable + formData.html_content.substring(end);
      setFormData({ ...formData, html_content: newContent });
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();
      }, 0);
    }
  };

  const getDefaultTemplate = (type: string) => {
    switch (type) {
      case 'signature':
        return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">Contrato para Assinatura Digital</h2>
  
  <p>Olá <strong>{{NOME_CLIENTE}}</strong>,</p>
  
  <p>Segue o link para assinatura digital do seu contrato de <strong>{{TIPO_EVENTO}}</strong>:</p>
  
  <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <a href="{{LINK_CONTRATO}}" style="color: #2563eb; font-weight: bold; text-decoration: none;">
      👆 Clique aqui para assinar o contrato
    </a>
  </div>
  
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #92400e; margin-top: 0;">✅ SOBRE A ASSINATURA DIGITAL:</h3>
    <ul>
      <li>Possui validade jurídica conforme Lei nº 14.063/2020</li>
      <li>Registra automaticamente data, hora e IP para auditoria</li>
      <li>Você receberá o PDF assinado por email após a conclusão</li>
    </ul>
  </div>
  
  <p>Caso tenha alguma dúvida, entre em contato conosco.</p>
  
  <p>Atenciosamente,<br>
  {{NOME_EMPRESA}}<br>
  {{TELEFONE_EMPRESA}}<br>
  {{EMAIL_EMPRESA}}</p>
</div>
        `;
      case 'signed_confirmation':
        return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16a34a;">Contrato Assinado com Sucesso! ✅</h2>
  
  <p>Olá <strong>{{NOME_CLIENTE}}</strong>,</p>
  
  <p>Seu contrato de <strong>{{TIPO_EVENTO}}</strong> foi assinado digitalmente com sucesso!</p>
  
  <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #16a34a; margin-top: 0;">📋 Detalhes do Contrato:</h3>
    <ul>
      <li><strong>Evento:</strong> {{TIPO_EVENTO}}</li>
      <li><strong>Data do Evento:</strong> {{DATA_EVENTO}}</li>
      <li><strong>Local:</strong> {{LOCAL_EVENTO}}</li>
      <li><strong>Valor:</strong> {{VALOR_TOTAL}}</li>
      <li><strong>Assinado em:</strong> {{DATA_ASSINATURA}} às {{HORA_ASSINATURA}}</li>
    </ul>
  </div>
  
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #92400e; margin-top: 0;">🔒 Dados de Auditoria e Segurança:</h3>
    <ul style="font-size: 12px;">
      <li><strong>IP do Assinante:</strong> {{IP_ASSINANTE}}</li>
      <li><strong>Dispositivo:</strong> {{USER_AGENT}}</li>
      <li><strong>Hash do Documento:</strong> {{HASH_CONTRATO}}</li>
    </ul>
    <p style="margin: 5px 0; font-size: 13px;">
      <strong>⚖️ Validade Jurídica:</strong> Este contrato possui validade jurídica conforme Lei nº 14.063/2020, Marco Civil da Internet e Código Civil Brasileiro.
    </p>
  </div>
  
  <p>Em caso de dúvidas, entre em contato conosco.</p>
  
  <p>Atenciosamente,<br>
  {{NOME_EMPRESA}}<br>
  {{TELEFONE_EMPRESA}}<br>
  {{EMAIL_EMPRESA}}</p>
</div>
        `;
      case 'reminder':
        return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #ea580c;">Lembrete: Contrato Pendente de Assinatura</h2>
  
  <p>Olá <strong>{{NOME_CLIENTE}}</strong>,</p>
  
  <p>Este é um lembrete amigável sobre o contrato de <strong>{{TIPO_EVENTO}}</strong> que ainda está pendente de assinatura.</p>
  
  <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #ea580c; margin-top: 0;">📝 Detalhes do Evento:</h3>
    <ul>
      <li><strong>Tipo:</strong> {{TIPO_EVENTO}}</li>
      <li><strong>Data:</strong> {{DATA_EVENTO}}</li>
      <li><strong>Local:</strong> {{LOCAL_EVENTO}}</li>
      <li><strong>Valor:</strong> {{VALOR_TOTAL}}</li>
    </ul>
  </div>
  
  <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <a href="{{LINK_CONTRATO}}" style="color: #2563eb; font-weight: bold; text-decoration: none;">
      👆 Clique aqui para assinar o contrato
    </a>
  </div>
  
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h4 style="color: #92400e; margin-top: 0;">🔒 Segurança da Assinatura Digital:</h4>
    <p style="font-size: 12px; margin: 5px 0;">
      Sua assinatura será registrada com: IP ({{IP_ASSINANTE}}), data/hora e hash de segurança para garantia jurídica total.
    </p>
  </div>
  
  <p>A assinatura é rápida e segura, levando apenas alguns minutos.</p>
  
  <p>Atenciosamente,<br>
  {{NOME_EMPRESA}}<br>
  {{TELEFONE_EMPRESA}}<br>
  {{EMAIL_EMPRESA}}</p>
</div>
        `;
      default:
        return '';
    }
  };

  const handleTemplateTypeChange = (newType: string) => {
    setFormData({ 
      ...formData, 
      template_type: newType as any,
      html_content: formData.html_content || getDefaultTemplate(newType)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {template ? 'Editar Template de Email' : 'Novo Template de Email'}
            </h2>
            <p className="text-gray-600">
              Configure o template de email para contratos
            </p>
          </div>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Variáveis
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Email para Assinatura - Casamento"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição opcional do template"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-type">Tipo de Template</Label>
                  <Select value={formData.template_type} onValueChange={handleTemplateTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_TEMPLATE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subject">Assunto do Email</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ex: Contrato para Assinatura - {TIPO_EVENTO}"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                  />
                  <Label htmlFor="is-default">Definir como template padrão</Label>
                </div>
              </CardContent>
            </Card>

            {/* Quick Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Variáveis Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {emailTemplateVariables.map((variable) => (
                    <Button
                      key={variable.variable}
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable.variable)}
                      className="justify-start text-left"
                    >
                      <span className="text-xs font-mono text-blue-600">{variable.variable}</span>
                      <span className="ml-2 text-gray-600">- {variable.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HTML Content */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo HTML</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="html-content"
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                placeholder="Digite o conteúdo HTML do email..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Variáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Use as variáveis abaixo no conteúdo do seu email. Elas serão substituídas automaticamente pelos dados do contrato.
                </p>
                
                <div className="space-y-6">
                  {/* Dados do Cliente */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">👤 Dados do Cliente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {emailTemplateVariables.slice(0, 6).map((variable) => (
                        <div key={variable.variable} className="border rounded-lg p-3">
                          <div className="font-mono text-sm text-blue-600 font-medium">
                            {variable.variable}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {variable.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dados de Auditoria (DESTAQUE ESPECIAL) */}
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">🔒 Dados de Auditoria e Segurança (NOVOS)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {emailTemplateVariables.slice(16, 21).map((variable) => (
                        <div key={variable.variable} className="border-2 border-red-200 rounded-lg p-3 bg-red-50">
                          <div className="font-mono text-sm text-red-700 font-bold">
                            {variable.variable}
                          </div>
                          <div className="text-sm text-red-600 mt-1 font-medium">
                            {variable.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outros dados */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">📝 Outros Dados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {emailTemplateVariables.slice(6, 16).concat(emailTemplateVariables.slice(21)).map((variable) => (
                        <div key={variable.variable} className="border rounded-lg p-3">
                          <div className="font-mono text-sm text-blue-600 font-medium">
                            {variable.variable}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {variable.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualização do Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="border-b pb-2 mb-4">
                  <strong>Assunto:</strong> {formData.subject}
                </div>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.html_content }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractEmailTemplateEditor;
