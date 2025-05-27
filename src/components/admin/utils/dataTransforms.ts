
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

interface TransformedQuoteRequest {
  id: string;
  name: string;
  date: string;
  eventType: string;
  phone: string;
  status: string;
  email: string;
  eventLocation: string;
}

export const transformQuoteRequests = (quoteRequests: QuoteRequest[]): TransformedQuoteRequest[] => {
  return quoteRequests.map(request => ({
    id: request.id,
    name: request.name,
    date: request.event_date || new Date().toISOString().split('T')[0],
    eventType: request.event_type,
    phone: request.phone,
    status: request.status,
    email: request.email,
    eventLocation: request.event_location
  }));
};
