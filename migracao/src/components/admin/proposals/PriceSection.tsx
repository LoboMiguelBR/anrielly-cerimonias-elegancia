
import React from 'react';

interface PriceSectionProps {
  totalPrice: string;
  paymentTerms: string;
  handlePriceChange: (value: string) => void;
  handlePaymentTermsChange: (value: string) => void;
  isLoading: boolean;
}

const PriceSection: React.FC<PriceSectionProps> = ({
  totalPrice,
  paymentTerms,
  handlePriceChange,
  handlePaymentTermsChange,
  isLoading
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
        <div className="flex items-center">
          <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">R$</span>
          <input 
            type="text" 
            placeholder="0,00"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:border-gold"
            value={totalPrice}
            onChange={(e) => handlePriceChange(e.target.value.replace(/[^0-9,.]/g, ''))}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
        <textarea 
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
          value={paymentTerms}
          onChange={(e) => handlePaymentTermsChange(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>
    </>
  );
};

export default PriceSection;
