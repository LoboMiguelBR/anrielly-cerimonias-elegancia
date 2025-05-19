
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  name: string;
  eventType?: string;
  event_type?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_location?: string;
}

interface ProposalsTabProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
}

const ProposalsTab = ({ quoteRequests, quoteIdFromUrl }: ProposalsTabProps) => {
  const [selectedQuote, setSelectedQuote] = useState<string>("");
  const [formData, setFormData] = useState({
    client: "",
    date: new Date().toISOString().split('T')[0],
    services: [
      { name: "Reuniões de planejamento", included: true },
      { name: "Visita técnica", included: true },
      { name: "Coordenação dos fornecedores", included: true },
      { name: "Condução da cerimônia", included: true },
      { name: "Coordenação da recepção", included: true }
    ],
    customService: "",
    totalPrice: "",
    paymentTerms: "50% de sinal na assinatura do contrato, 50% restantes até 5 dias antes do evento.",
    notes: "",
  });
  
  const navigate = useNavigate();

  // Fill form with selected quote details
  useEffect(() => {
    if (quoteIdFromUrl) {
      const selectedRequest = quoteRequests.find(quote => quote.id === quoteIdFromUrl);
      if (selectedRequest) {
        setSelectedQuote(selectedRequest.id);
      }
    }
  }, [quoteIdFromUrl, quoteRequests]);

  // Update form when a quote is selected
  useEffect(() => {
    if (selectedQuote) {
      const selectedRequest = quoteRequests.find(quote => quote.id === selectedQuote);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          client: selectedRequest.id
        }));
      }
    }
  }, [selectedQuote, quoteRequests]);

  const handleQuoteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuote(e.target.value);
  };

  const handleServiceChange = (index: number, checked: boolean) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], included: checked };
    setFormData({ ...formData, services: updatedServices });
  };

  const handleCustomServiceAdd = () => {
    if (formData.customService.trim() === "") return;
    
    setFormData({
      ...formData,
      services: [...formData.services, { name: formData.customService, included: true }],
      customService: "",
    });
  };

  const handleSubmit = () => {
    toast.success("Proposta gerada com sucesso!");
  };

  const selectedQuoteData = quoteRequests.find(quote => quote.id === selectedQuote);

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
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                value={selectedQuote}
                onChange={handleQuoteSelect}
              >
                <option value="">Selecione um cliente</option>
                {quoteRequests.map(request => (
                  <option key={request.id} value={request.id}>
                    {request.name} - {request.event_type || request.eventType}
                  </option>
                ))}
              </select>
              
              {selectedQuote && selectedQuoteData && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                  <p><strong>Email:</strong> {selectedQuoteData.email}</p>
                  <p><strong>Telefone:</strong> {selectedQuoteData.phone}</p>
                  <p><strong>Data do evento:</strong> {selectedQuoteData.event_date ? new Date(selectedQuoteData.event_date).toLocaleDateString('pt-BR') : 'Não definida'}</p>
                  <p><strong>Local:</strong> {selectedQuoteData.event_location}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Proposta</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviços Incluídos</label>
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`service-${index}`} 
                    className="mr-2"
                    checked={service.included}
                    onChange={(e) => handleServiceChange(index, e.target.checked)}
                  />
                  <label htmlFor={`service-${index}`}>{service.name}</label>
                </div>
              ))}
              <div className="mt-2 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Adicionar serviço personalizado" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                  value={formData.customService}
                  onChange={(e) => setFormData({...formData, customService: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomServiceAdd()}
                />
                <Button variant="outline" size="sm" onClick={handleCustomServiceAdd}>
                  Adicionar
                </Button>
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
                value={formData.totalPrice}
                onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações Adicionais</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
              placeholder="Informações adicionais para a proposta..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline">Pré-visualizar</Button>
            <Button onClick={handleSubmit}>Gerar PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTab;
