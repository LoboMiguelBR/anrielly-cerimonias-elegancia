
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from '@/components/admin/ProposalPDF';

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

interface Service {
  name: string;
  included: boolean;
}

interface ProposalData {
  id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  services: Service[];
  total_price: number;
  payment_terms: string;
  notes: string | null;
  quote_request_id: string | null;
  validity_date: string;
}

interface ProposalsTabProps {
  quoteRequests: QuoteRequest[];
  quoteIdFromUrl?: string | null;
}

const ProposalsTab = ({ quoteRequests, quoteIdFromUrl }: ProposalsTabProps) => {
  const [selectedQuote, setSelectedQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatingPDF, setGeneratingPDF] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    event_type: "",
    event_date: null as string | null,
    event_location: "",
    validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    services: [
      { name: "Reuniões de planejamento", included: true },
      { name: "Visita técnica", included: true },
      { name: "Coordenação dos fornecedores", included: true },
      { name: "Condução da cerimônia", included: true },
      { name: "Coordenação da recepção", included: true }
    ],
    customService: "",
    total_price: "",
    payment_terms: "50% de sinal na assinatura do contrato, 50% restantes até 5 dias antes do evento.",
    notes: "",
    quote_request_id: null as string | null
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
          client_name: selectedRequest.name || "",
          client_email: selectedRequest.email || "",
          client_phone: selectedRequest.phone || "",
          event_type: selectedRequest.event_type || selectedRequest.eventType || "",
          event_date: selectedRequest.event_date || null,
          event_location: selectedRequest.event_location || "",
          quote_request_id: selectedRequest.id
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

  const saveProposal = async (): Promise<string | null> => {
    try {
      setIsSaving(true);
      
      // Filtrar apenas os serviços incluídos
      const includedServices = formData.services.filter(service => service.included);
      
      const proposalData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_location: formData.event_location,
        services: includedServices,
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms,
        notes: formData.notes || null,
        quote_request_id: formData.quote_request_id,
        validity_date: formData.validity_date
      };
      
      const { data, error } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Atualizar o status do orçamento para "proposta"
      if (formData.quote_request_id) {
        const { error: quoteError } = await supabase
          .from('quote_requests')
          .update({ status: 'proposta' })
          .eq('id', formData.quote_request_id);
        
        if (quoteError) {
          console.error('Erro ao atualizar status do orçamento', quoteError);
        }
      }
      
      toast.success("Proposta salva com sucesso!");
      return data.id;
    } catch (error: any) {
      console.error('Erro ao salvar proposta:', error);
      toast.error(`Erro ao salvar proposta: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      
      // Primeiro salvamos a proposta no banco de dados
      const proposalId = await saveProposal();
      
      if (!proposalId) {
        throw new Error('Não foi possível salvar a proposta');
      }
      
      // Criamos o objeto de proposta completo para o PDF
      const proposalForPDF = {
        id: proposalId,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        event_type: formData.event_type,
        event_date: formData.event_date,
        event_location: formData.event_location,
        services: formData.services.filter(s => s.included),
        total_price: parseFloat(formData.total_price) || 0,
        payment_terms: formData.payment_terms,
        notes: formData.notes,
        validity_date: formData.validity_date,
        created_at: new Date().toISOString()
      };
      
      setProposal(proposalForPDF);
      
      // Notificamos o usuário que o PDF está pronto para download
      toast.success("PDF gerado com sucesso! Clique para baixar.");
      
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      toast.error(`Erro ao gerar PDF: ${error.message}`);
    } finally {
      setGeneratingPDF(false);
    }
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
                disabled={isLoading}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade da Proposta</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                value={formData.validity_date}
                onChange={(e) => setFormData({...formData, validity_date: e.target.value})}
                disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCustomServiceAdd}
                  disabled={isLoading || formData.customService.trim() === ""}
                >
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
                value={formData.total_price}
                onChange={(e) => setFormData({...formData, total_price: e.target.value.replace(/[^0-9,.]/g, '')})}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
              value={formData.payment_terms}
              onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
              disabled={isLoading}
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
              disabled={isLoading}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => saveProposal()} 
              disabled={isLoading || isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Salvar
            </Button>
            
            <Button 
              onClick={handleGeneratePDF} 
              disabled={isLoading || generatingPDF || !selectedQuote}
            >
              {generatingPDF ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
              Gerar PDF
            </Button>
            
            {proposal && (
              <PDFDownloadLink 
                document={<ProposalPDF proposal={proposal} />} 
                fileName={`proposta_${proposal.client_name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {({ loading }) => (
                  loading ? 
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparando PDF...
                  </span> : 
                  <span className="flex items-center">
                    <Download className="w-4 h-4 mr-2" /> Baixar PDF
                  </span>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTab;
