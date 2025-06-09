
import { ReactNode } from 'react';

interface QuestionariosHeaderProps {
  children: ReactNode;
}

const QuestionariosHeader = ({ children }: QuestionariosHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold">Questionários dos Noivos</h2>
        <p className="text-gray-600">Gerencie os questionários e visualize as respostas</p>
      </div>
      {children}
    </div>
  );
};

export default QuestionariosHeader;
