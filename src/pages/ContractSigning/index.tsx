
import React, { useEffect } from 'react';
import ContractHeader from '@/components/admin/contracts/signing/ContractHeader';
import { ContractSignatureSection } from '@/components/admin/contracts/signing';
import ContractPreview from '@/components/admin/contracts/signing/ContractPreview';
import { useContractFetch } from './hooks/useContractFetch';
import { useContractSigning } from './hooks/useContractSigning';
import LoadingSpinner from './components/LoadingSpinner';
import ContractNotFound from './components/ContractNotFound';

const ContractSigning = () => {
  const { contract, setContract, isLoading } = useContractFetch();
  const {
    isSubmitting,
    signature,
    setSignature,
    signatureUrl,
    setSignatureUrl,
    hasDrawnSignature,
    setHasDrawnSignature,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    isInPreviewMode,
    handleSaveSignaturePreview,
    handleConfirmSignature,
    handleEditSignature
  } = useContractSigning(contract, setContract);

  // Update client info when contract is loaded
  useEffect(() => {
    if (contract) {
      setClientName(contract.client_name);
      setClientEmail(contract.client_email);
    }
  }, [contract, setClientName, setClientEmail]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!contract) {
    return <ContractNotFound />;
  }

  const isAlreadySigned = contract.status === 'signed';
  const isInPreview = contract.status === 'draft_signed' || isInPreviewMode;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <ContractHeader contract={contract} isAlreadySigned={isAlreadySigned} />
      
      {isInPreview ? (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContractPreview
            contract={contract}
            onConfirmSignature={handleConfirmSignature}
            onEditSignature={handleEditSignature}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <ContractSignatureSection
          contract={contract}
          signature={signature}
          onSignatureChange={setSignature}
          signatureUrl={signatureUrl}
          onSignatureUrlChange={setSignatureUrl}
          hasDrawnSignature={hasDrawnSignature}
          onHasDrawnSignatureChange={setHasDrawnSignature}
          clientName={clientName}
          onClientNameChange={setClientName}
          clientEmail={clientEmail}
          onClientEmailChange={setClientEmail}
          isSubmitting={isSubmitting}
          onSubmit={handleSaveSignaturePreview}
        />
      )}
    </div>
  );
};

export default ContractSigning;
