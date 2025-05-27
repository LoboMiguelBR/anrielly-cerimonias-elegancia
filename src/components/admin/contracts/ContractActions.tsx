
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContractData } from '../hooks/contract/types';
import { sendEmailNotification } from '@/utils/emailUtils';
import { toast } from 'sonner';
import { Send, Copy, Link, ExternalLink } from 'lucide-react';

interface ContractActionsProps {
  contract: ContractData;
  onStatusUpdate?: () => void;
}

const ContractActions = ({ contract, onStatusUpdate }: ContractActionsProps) => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Contrato para Assinatura Digital - ${contract.event_type}`);
  const [emailMessage, setEmailMessage] = useState(`
Olá ${contract.client_name},

Segue o link para assinatura digital do seu contrato de prestação de serviços de cerimonial:

{LINK_CONTRATO}

✅ SOBRE A ASSINATURA DIGITAL:
• Possui validade jurídica conforme Lei nº 14.063/2020
• Registra automaticamente data, hora e IP para auditoria
• Você receberá o PDF assinado por email após a conclusão

📋 PARA ASSINAR:
• Clique no link acima
• Leia o contrato completo
• Marque o checkbox de concordância
• Desenhe sua assinatura no campo indicado (obrigatório)
• Clique em "Assinar Contrato Digitalmente"

⚠️ IMPORTANTE: A assinatura desenhada é obrigatória para garantir a validade jurídica do documento.

Caso tenha alguma dúvida, entre em contato conosco.

Atenciosamente,
Anrielly Gomes - Mestre de Cerimônia
(24) 99268-9947
contato@anriellygomes.com.br
  `.trim());
  const [isSending, setIsSending] = useState(false);

  const contractUrl = `${window.location.origin}/contrato/${contract.public_token}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractUrl);
      toast.success('Link do contrato copiado para área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  const openContractLink = () => {
    window.open(contractUrl, '_blank');
  };

  const sendContractEmail = async () => {
    setIsSending(true);
    try {
      const messageWithLink = emailMessage.replace('{LINK_CONTRATO}', contractUrl);
      
      const success = await sendEmailNotification({
        to: contract.client_email,
        name: contract.client_name,
        subject: emailSubject,
        message: messageWithLink,
        tipo: 'contrato-assinatura',
        contractUrl: contractUrl,
        eventType: contract.event_type
      });

      if (success) {
        toast.success('Email enviado com sucesso!');
        setIsEmailDialogOpen(false);
        onStatusUpdate?.();
      } else {
        toast.error('Erro ao enviar email');
      }
    } catch (error) {
      console.error('Error sending contract email:', error);
      toast.error('Erro ao enviar email');
    } finally {
      setIsSending(false);
    }
  };

  if (contract.status === 'signed') {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={openContractLink} title="Abrir contrato assinado">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Assinado
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard} title="Copiar link">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Link
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={openContractLink} title="Abrir link público">
        <ExternalLink className="h-4 w-4 mr-2" />
        Abrir Link
      </Button>
      
      <Button variant="outline" size="sm" onClick={copyToClipboard} title="Copiar link público">
        <Link className="h-4 w-4 mr-2" />
        Copiar Link
      </Button>
      
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" title="Enviar contrato por email">
            <Send className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Contrato para Assinatura Digital</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                rows={12}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {"{LINK_CONTRATO}"} onde o link deve aparecer na mensagem
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-blue-800 mb-1">Link do contrato:</p>
              <p className="text-blue-600 break-all">{contractUrl}</p>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsEmailDialogOpen(false)}
                disabled={isSending}
              >
                Cancelar
              </Button>
              <Button 
                onClick={sendContractEmail}
                disabled={isSending}
              >
                {isSending ? 'Enviando...' : 'Enviar Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractActions;
