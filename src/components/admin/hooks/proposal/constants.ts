
import { ProposalFormData } from './types';

export const defaultFormData: ProposalFormData = {
  client_name: "",
  client_email: "",
  client_phone: "",
  event_type: "",
  event_date: null,
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
  quote_request_id: null
};
