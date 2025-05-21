
import React from 'react';
import ClientSelection from '../ClientSelection';
import ServicesSection from '../ServicesSection';
import PriceSection from '../PriceSection';
import NotesSection from '../NotesSection';
import ValidityDateSection from '../ValidityDateSection';
import { ProposalFormData, Service } from '../../hooks/proposal/types';
import { QuoteRequest } from '../../hooks/proposal/types';

interface ProposalFormProps {
  quoteRequests: QuoteRequest[];
  selectedQuote: string;
  formData: ProposalFormData;
  isEditMode: boolean;
  isLoading: boolean;
  handleQuoteSelect: (quoteId: string) => void;
  handleFormChange: (field: keyof ProposalFormData, value: any) => void;
  handleServiceChange: (index: number, checked: boolean) => void;
  handleCustomServiceAdd: () => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  quoteRequests,
  selectedQuote,
  formData,
  isEditMode,
  isLoading,
  handleQuoteSelect,
  handleFormChange,
  handleServiceChange,
  handleCustomServiceAdd
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClientSelection 
          quoteRequests={quoteRequests}
          selectedQuote={selectedQuote}
          handleQuoteSelect={handleQuoteSelect}
          isLoading={isLoading}
          disabled={isEditMode}
        />
        
        <ValidityDateSection 
          validityDate={formData.validity_date}
          handleValidityDateChange={(value) => handleFormChange('validity_date', value)}
          isLoading={isLoading}
        />
      </div>
      
      <ServicesSection 
        services={formData.services}
        customService={formData.customService}
        handleServiceChange={handleServiceChange}
        handleCustomServiceChange={(value) => handleFormChange('customService', value)}
        handleCustomServiceAdd={handleCustomServiceAdd}
        isLoading={isLoading}
      />
      
      <PriceSection 
        totalPrice={formData.total_price}
        paymentTerms={formData.payment_terms}
        handlePriceChange={(value) => handleFormChange('total_price', value)}
        handlePaymentTermsChange={(value) => handleFormChange('payment_terms', value)}
        isLoading={isLoading}
      />
      
      <NotesSection 
        notes={formData.notes}
        handleNotesChange={(value) => handleFormChange('notes', value)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProposalForm;
