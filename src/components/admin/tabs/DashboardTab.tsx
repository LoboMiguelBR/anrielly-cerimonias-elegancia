
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import { useTestimonials } from '../hooks/useTestimonials';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import EnhancedDashboard from '../dashboard/EnhancedDashboard';

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

  // Count quotes with "proposta" status
  const proposalsCount = quoteRequests.filter(r => r.status === 'proposta').length;

  // Show loading state if data is still being fetched
  if (!galleryImages || !testimonials || !questionariosStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <EnhancedDashboard
      quoteRequests={quoteRequests}
      quoteRequestsCount={quoteRequests.length}
      proposalsCount={proposalsCount}
      galleryCount={galleryImages.length}
      testimonialsCount={testimonials.length}
      questionariosCount={questionariosStats?.total || 0}
    />
  );
};

export default DashboardTab;
