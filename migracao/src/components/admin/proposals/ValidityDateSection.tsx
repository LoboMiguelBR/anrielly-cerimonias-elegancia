
import React from 'react';
import { format } from 'date-fns';

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
  // Ensure we have a valid date string for the input
  const formattedDate = validityDate ? validityDate.substring(0, 10) : '';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade da Proposta</label>
      <input 
        type="date" 
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
        value={formattedDate}
        onChange={(e) => handleValidityDateChange(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
};

export default ValidityDateSection;
