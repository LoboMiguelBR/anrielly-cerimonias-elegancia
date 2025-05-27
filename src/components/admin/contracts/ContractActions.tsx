
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
    copyToClipboard,
    openContractLink,
    sendContractEmail
  } = useContractActions(contract, onStatusUpdate);

  return (
    <div className="flex gap-2">
      <ContractActionButtons
        contract={contract}
        onCopyToClipboard={copyToClipboard}
        onOpenContractLink={openContractLink}
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
          onSendEmail={sendContractEmail}
        />
      )}
    </div>
  );
};

export default ContractActions;
