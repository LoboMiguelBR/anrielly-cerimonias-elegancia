
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ProposalData } from '@/components/admin/hooks/proposal';

interface IncompletePropStateProps {
  proposal: ProposalData;
  onBack: () => void;
}

const IncompletePropState: React.FC<IncompletePropStateProps> = ({ proposal, onBack }) => {
  return (
    <div className="flex items-center justify-center h-full bg-white p-8 text-center">
      <div>
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Dados insuficientes para gerar o PDF</h3>
        <p className="text-gray-600 mb-4">
          Alguns campos obrigatórios não foram preenchidos. Verifique se você preencheu:
        </p>
        <ul className="text-left text-sm list-disc pl-8 mb-4">
          <li className={proposal.client_name ? "text-green-600" : "text-red-600"}>
            Nome do cliente: {proposal.client_name || "Não preenchido"}
          </li>
          <li className={proposal.event_type ? "text-green-600" : "text-red-600"}>
            Tipo de evento: {proposal.event_type || "Não preenchido"}
          </li>
          <li className={proposal.services && proposal.services.length > 0 ? "text-green-600" : "text-red-600"}>
            Serviços incluídos: {proposal.services && proposal.services.length > 0 ? `${proposal.services.length} serviço(s)` : "Nenhum serviço selecionado"}
          </li>
        </ul>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar para edição
        </Button>
      </div>
    </div>
  );
};

export default IncompletePropState;
