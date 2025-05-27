
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContractData } from '../../hooks/contract/types';
import ContractPDFGenerator from '../pdf/ContractPDFGenerator';
import { Edit, ArrowLeft, FileText } from 'lucide-react';

interface ContractViewProps {
  contract: ContractData;
  onEdit: () => void;
  onCancel: () => void;
}

const ContractView = ({ contract, onEdit, onCancel }: ContractViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Visualizar Contrato
        </CardTitle>
        <div className="flex gap-2">
          {contract.status === 'signed' && (
            <ContractPDFGenerator contract={contract} />
          )}
          {contract.status !== 'signed' && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          )}
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border-l-4 ${
            contract.status === 'signed' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : contract.status === 'pending'
              ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
              : 'bg-gray-50 border-gray-500 text-gray-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  Status: {
                    contract.status === 'signed' ? 'Assinado' :
                    contract.status === 'pending' ? 'Pendente' :
                    contract.status === 'draft' ? 'Rascunho' : 'Cancelado'
                  }
                </p>
                {contract.signed_at && (
                  <p className="text-sm">
                    Assinado em: {new Date(contract.signed_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
              {contract.status === 'signed' && (
                <div className="text-right">
                  <p className="text-sm font-medium">Contrato válido juridicamente</p>
                  <p className="text-xs">Conforme Lei nº 14.063/2020</p>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">Dados do Cliente</h3>
              <div className="space-y-2">
                <div>
                  <strong>Nome:</strong> {contract.client_name}
                </div>
                <div>
                  <strong>Email:</strong> {contract.client_email}
                </div>
                <div>
                  <strong>Telefone:</strong> {contract.client_phone}
                </div>
                {contract.client_address && (
                  <div>
                    <strong>Endereço:</strong> {contract.client_address}
                  </div>
                )}
                {contract.client_profession && (
                  <div>
                    <strong>Profissão:</strong> {contract.client_profession}
                  </div>
                )}
                {contract.civil_status && (
                  <div>
                    <strong>Estado Civil:</strong> {contract.civil_status}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Dados do Evento</h3>
              <div className="space-y-2">
                <div>
                  <strong>Tipo:</strong> {contract.event_type}
                </div>
                <div>
                  <strong>Data:</strong> {contract.event_date ? new Date(contract.event_date).toLocaleDateString('pt-BR') : 'Não definida'}
                </div>
                {contract.event_time && (
                  <div>
                    <strong>Horário:</strong> {contract.event_time}
                  </div>
                )}
                <div>
                  <strong>Local:</strong> {contract.event_location || 'Não definido'}
                </div>
              </div>
            </Card>
          </div>

          {/* Financial Information */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 text-green-700">Valores e Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold text-green-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.total_price)}
                </p>
              </div>
              {contract.down_payment && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Entrada</p>
                  <p className="text-lg font-semibold text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.down_payment)}
                  </p>
                  {contract.down_payment_date && (
                    <p className="text-xs text-gray-500">
                      Até {new Date(contract.down_payment_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}
              {contract.remaining_amount && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Saldo</p>
                  <p className="text-lg font-semibold text-orange-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.remaining_amount)}
                  </p>
                  {contract.remaining_payment_date && (
                    <p className="text-xs text-gray-500">
                      Até {new Date(contract.remaining_payment_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
          
          {/* Notes */}
          {contract.notes && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Observações</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{contract.notes}</p>
            </Card>
          )}

          {/* Contract Metadata */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">Informações do Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Criado em:</strong> {new Date(contract.created_at).toLocaleString('pt-BR')}
              </div>
              <div>
                <strong>Última atualização:</strong> {new Date(contract.updated_at).toLocaleString('pt-BR')}
              </div>
              {contract.signature_data?.ip_address && (
                <div>
                  <strong>IP da assinatura:</strong> {contract.signature_data.ip_address}
                </div>
              )}
              {contract.signature_data?.contract_hash && (
                <div>
                  <strong>Hash do contrato:</strong> {contract.signature_data.contract_hash.substring(0, 16)}...
                </div>
              )}
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractView;
