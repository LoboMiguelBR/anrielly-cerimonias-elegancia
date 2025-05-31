
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QuestionariosSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const QuestionariosSearch = ({ searchTerm, onSearchChange }: QuestionariosSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Buscar por link, nome ou email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default QuestionariosSearch;
