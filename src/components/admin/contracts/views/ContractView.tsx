
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractData } from '../../hooks/contract/types';

interface ContractViewProps {
  contract: ContractData;
  onEdit: () => void;
  onCancel: () => void;
}

const ContractView = ({ contract, onEdit, onCancel }: ContractViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizar Contrato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Cliente:</strong> {contract.client_name}
            </div>
            <div>
              <strong>Email:</strong> {contract.client_email}
            </div>
            <div>
              <strong>Telefone:</strong> {contract.client_phone}
            </div>
            <div>
              <strong>Evento:</strong> {contract.event_type}
            </div>
            <div>
              <strong>Data:</strong> {contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : '-'}
            </div>
            <div>
              <strong>Local:</strong> {contract.event_location}
            </div>
            <div>
              <strong>Valor Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_price)}
            </div>
            <div>
              <strong>Status:</strong> {contract.status}
            </div>
          </div>
          
          {contract.notes && (
            <div>
              <strong>Observações:</strong>
              <p className="mt-1 text-gray-600">{contract.notes}</p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Editar
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Voltar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractView;
