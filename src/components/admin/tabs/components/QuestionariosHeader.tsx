
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface QuestionariosHeaderProps {
  onRefresh: () => void;
}

const QuestionariosHeader = ({ onRefresh }: QuestionariosHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-2">Questionários dos Noivos</h2>
        <p className="text-gray-600">Gerencie questionários, visualize respostas e crie eventos vinculados</p>
      </div>
      <Button onClick={onRefresh} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Atualizar
      </Button>
    </div>
  );
};

export default QuestionariosHeader;
