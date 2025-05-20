
import React from 'react';

interface ValidityDateSectionProps {
  validityDate: string;
  handleValidityDateChange: (value: string) => void;
  isLoading: boolean;
}

const ValidityDateSection: React.FC<ValidityDateSectionProps> = ({
  validityDate,
  handleValidityDateChange,
  isLoading
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade da Proposta</label>
      <input 
        type="date" 
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
        value={validityDate}
        onChange={(e) => handleValidityDateChange(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
};

export default ValidityDateSection;
