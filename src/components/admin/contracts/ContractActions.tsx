
import { ContractData } from '../hooks/contract/types';
import { useContractActions } from './actions';
import ContractEmailActionButtons from './actions/ContractEmailActionButtons';
import { ContractEmailDialog } from './actions';

interface ContractActionsProps {
  contract: ContractData;
  onStatusUpdate?: () => void;
}

const ContractActions = ({ contract, onStatusUpdate }: ContractActionsProps) => {
  const {
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    isSending,
    contractUrl,
    selectedTemplateId,
    setSelectedTemplateId,
    copyToClipboard,
    openContractLink,
    openEmailDialog,
    sendContractEmail,
    replaceVariables
  } = useContractActions(contract, onStatusUpdate);

  const handleSendReminder = () => {
    setEmailSubject('Lembrete: Assinatura do Contrato Pendente');
    openEmailDialog();
  };

  const handleSendSignatureRequest = () => {
    setEmailSubject('Solicitação de Assinatura do Contrato');
    openEmailDialog();
  };

  const handleSendConfirmation = () => {
    setEmailSubject('Confirmação: Contrato Assinado com Sucesso');
    openEmailDialog();
  };

  return (
    <div className="flex gap-2">
      <ContractEmailActionButtons
        contract={contract}
        onCopyToClipboard={copyToClipboard}
        onOpenContractLink={openContractLink}
        onSendReminder={handleSendReminder}
        onSendSignatureRequest={handleSendSignatureRequest}
        onSendConfirmation={handleSendConfirmation}
      />
      
      <ContractEmailDialog
        contract={contract}
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailMessage={emailMessage}
        setEmailMessage={setEmailMessage}
        contractUrl={contractUrl}
        isSending={isSending}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        onSendEmail={sendContractEmail}
        replaceVariables={replaceVariables}
      />
    </div>
  );
};

export default ContractActions;
