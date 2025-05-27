
import { ContractData } from '../hooks/contract/types';
import { useContractActions, ContractEmailDialog, ContractActionButtons } from './actions';

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

  return (
    <div className="flex gap-2">
      <ContractActionButtons
        contract={contract}
        onCopyToClipboard={copyToClipboard}
        onOpenContractLink={openContractLink}
        onOpenEmailDialog={openEmailDialog}
      />
      
      {contract.status !== 'signed' && (
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
      )}
    </div>
  );
};

export default ContractActions;
