
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { ContractData } from '../../hooks/contract/types';

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
  onSendEmail: () => void;
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
  onSendEmail
}: ContractEmailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
