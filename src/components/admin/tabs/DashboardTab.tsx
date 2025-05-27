
import React from 'react';
import DashboardSummary from '../DashboardSummary';
import QuoteRequestsTable from '../QuoteRequestsTable';
import { Loader2 } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import { useTestimonials } from '../hooks/useTestimonials';
import { useQuestionarios } from '@/hooks/useQuestionarios';

interface DashboardTabProps {
  quoteRequests: Array<{
    id: string;
    name: string;
    date: string;
    eventType: string;
    phone: string;
    status: string;
    email: string;
    eventLocation: string;
  }>;
}

const DashboardTab = ({ quoteRequests }: DashboardTabProps) => {
  // Get real data for gallery and testimonials counts
  const { galleryImages } = useGallery();
  const { testimonials } = useTestimonials();
  const { stats: questionariosStats } = useQuestionarios();

  // Transform Supabase data to match the expected format
  const formattedQuoteRequests = quoteRequests.map(request => ({
    id: request.id,
    name: request.name,
    date: request.date || '',
    eventType: request.eventType,
    phone: request.phone,
    status: request.status,
    email: request.email,
    eventLocation: request.eventLocation
  }));

  // Count quotes with "proposta" status
  const proposalsCount = quoteRequests.filter(r => r.status === 'proposta').length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Resumo Geral</h2>
      <DashboardSummary 
        quoteRequestsCount={quoteRequests.length}
        proposalsCount={proposalsCount}
        galleryCount={galleryImages.length}
        testimonialsCount={testimonials.length}
        questionariosCount={questionariosStats?.total || 0}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Orçamentos Recentes</h3>
        {formattedQuoteRequests ? (
          <QuoteRequestsTable quoteRequests={formattedQuoteRequests.slice(0, 5)} />
        ) : (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
