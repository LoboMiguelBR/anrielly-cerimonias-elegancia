
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuoteRequest {
  id: number;
  name: string;
  eventType: string;
}

interface ProposalsTabProps {
  quoteRequests: QuoteRequest[];
}

const ProposalsTab = ({ quoteRequests }: ProposalsTabProps) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gerador de Propostas</h2>
      <p className="text-gray-500 mb-8">Crie propostas personalizadas para enviar aos clientes.</p>
      
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-medium mb-6 text-lg">Nova Proposta</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold">
                <option value="">Selecione um cliente</option>
                {quoteRequests.map(request => (
                  <option key={request.id} value={request.id}>
                    {request.name} - {request.eventType}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Proposta</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviços Incluídos</label>
            <div className="space-y-2">
              {['Reuniões de planejamento', 'Visita técnica', 'Coordenação dos fornecedores', 'Condução da cerimônia', 'Coordenação da recepção'].map((service, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`service-${index}`} 
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor={`service-${index}`}>{service}</label>
                </div>
              ))}
              <div className="mt-2">
                <input 
                  type="text" 
                  placeholder="Adicionar serviço personalizado" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">R$</span>
              <input 
                type="text" 
                placeholder="0,00"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
              defaultValue="50% de sinal na assinatura do contrato, 50% restantes até 5 dias antes do evento."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações Adicionais</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
              placeholder="Informações adicionais para a proposta..."
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline">Pré-visualizar</Button>
            <Button>Gerar PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTab;
