
import React from 'react';
import { ContractData } from '../../hooks/contract/types';
import ContractDetails from './ContractDetails';
import ContractContent from './ContractContent';
import SignatureSection from './SignatureSection';

interface ContractSignatureSectionProps {
  contract: ContractData;
  signature: string;
  onSignatureChange: (signature: string) => void;
  hasDrawnSignature: boolean;
  onHasDrawnSignatureChange: (hasDrawn: boolean) => void;
  clientName: string;
  onClientNameChange: (name: string) => void;
  clientEmail: string;
  onClientEmailChange: (email: string) => void;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

const ContractSignatureSection: React.FC<ContractSignatureSectionProps> = ({
  contract,
  signature,
  onSignatureChange,
  hasDrawnSignature,
  onHasDrawnSignatureChange,
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8">
        {/* Contract Details */}
        <ContractDetails contract={contract} />

        {/* Contract Content */}
        <ContractContent contract={contract} />

        {/* Signature Section */}
        <SignatureSection
          contract={contract}
          signature={signature}
          onSignatureChange={onSignatureChange}
          hasDrawnSignature={hasDrawnSignature}
          onHasDrawnSignatureChange={onHasDrawnSignatureChange}
          clientName={clientName}
          onClientNameChange={onClientNameChange}
          clientEmail={clientEmail}
          onClientEmailChange={onClientEmailChange}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default ContractSignatureSection;
