
import React from 'react';

interface NotesSectionProps {
  notes: string;
  handleNotesChange: (value: string) => void;
  isLoading: boolean;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  handleNotesChange,
  isLoading
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Observações Adicionais</label>
      <textarea 
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
        placeholder="Informações adicionais para a proposta..."
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        disabled={isLoading}
      ></textarea>
    </div>
  );
};

export default NotesSection;
