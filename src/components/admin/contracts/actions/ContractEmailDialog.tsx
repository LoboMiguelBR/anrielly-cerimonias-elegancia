
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from 'lucide-react';
import { ContractData, ContractEmailTemplate } from '../../hooks/contract/types';
import { contractApi } from '../../hooks/contract';

interface ContractEmailDialogProps {
  contract: ContractData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailMessage: string;
  setEmailMessage: (message: string) => void;
  contractUrl: string;
  isSending: boolean;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  onSendEmail: () => void;
  replaceVariables: (content: string, contract: ContractData) => string;
}

const ContractEmailDialog = ({
  contract,
  isOpen,
  onOpenChange,
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  contractUrl,
  isSending,
  selectedTemplateId,
  setSelectedTemplateId,
  onSendEmail,
  replaceVariables
}: ContractEmailDialogProps) => {
  const [templates, setTemplates] = useState<ContractEmailTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const data = await contractApi.getContractEmailTemplates();
      const signatureTemplates = data.filter(t => t.template_type === 'signature');
      setTemplates(signatureTemplates);
    } catch (error) {
      console.error('Error loading email templates:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    if (templateId === 'custom') {
      setEmailSubject(`Contrato para Assinatura Digital - ${contract.event_type}`);
      setEmailMessage('');
      return;
    }

    try {
      const template = await contractApi.getContractEmailTemplateById(templateId);
      if (template) {
        setEmailSubject(replaceVariables(template.subject, contract));
        setEmailMessage(replaceVariables(template.html_content, contract));
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" title="Enviar contrato por email">
          <Send className="h-4 w-4 mr-2" />
          Enviar Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Contrato para Assinatura Digital</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Para:</Label>
              <Input 
                id="email" 
                value={contract.client_email} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="template">Template:</Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateChange} disabled={isLoadingTemplates}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">✏️ Personalizado</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.is_default ? '⭐ ' : ''}{template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Assunto:</Label>
            <Input 
              id="subject" 
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Mensagem:</Label>
            <Textarea 
              id="message" 
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={16}
              className="text-sm font-mono"
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-800 mb-1">Link do contrato:</p>
            <p className="text-blue-600 break-all">{contractUrl}</p>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={onSendEmail}
              disabled={isSending}
            >
              {isSending ? 'Enviando...' : 'Enviar Email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractEmailDialog;
