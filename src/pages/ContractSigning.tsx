
import React, { useEffect } from 'react';
import ContractHeader from '@/components/admin/contracts/signing/ContractHeader';
import { ContractSignatureSection } from '@/components/admin/contracts/signing';
import { useContractFetch } from './ContractSigning/hooks/useContractFetch';
import { useContractSigning } from './ContractSigning/hooks/useContractSigning';
import LoadingSpinner from './ContractSigning/components/LoadingSpinner';
import ContractNotFound from './ContractSigning/components/ContractNotFound';

const ContractSigning = () => {
  const { contract, setContract, isLoading } = useContractFetch();
  const {
    isSubmitting,
    signature,
    setSignature,
    hasDrawnSignature,
    setHasDrawnSignature,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    handleSignContract
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <ContractHeader contract={contract} isAlreadySigned={isAlreadySigned} />
      
      <ContractSignatureSection
        contract={contract}
        signature={signature}
        onSignatureChange={setSignature}
        hasDrawnSignature={hasDrawnSignature}
        onHasDrawnSignatureChange={setHasDrawnSignature}
        clientName={clientName}
        onClientNameChange={setClientName}
        clientEmail={clientEmail}
        onClientEmailChange={setClientEmail}
        isSubmitting={isSubmitting}
        onSubmit={handleSignContract}
      />
    </div>
  );
};

export default ContractSigning;
