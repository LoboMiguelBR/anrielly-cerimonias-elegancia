
interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string | null;
  event_location: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TransformedLead {
  id: string;
  name: string;
  date: string;
  eventType: string;
  phone: string;
  status: string;
  email: string;
  event_type: string;
  event_location: string;
  created_at: string;
}

export const transformQuoteRequests = (quoteRequests: QuoteRequest[]): TransformedLead[] => {
  return quoteRequests.map(request => ({
    id: request.id,
    name: request.name,
    date: request.event_date || new Date().toISOString().split('T')[0],
    eventType: request.event_type,
    phone: request.phone,
    status: request.status,
    email: request.email,
    event_type: request.event_type,
    event_location: request.event_location,
    created_at: request.created_at
  }));
};
