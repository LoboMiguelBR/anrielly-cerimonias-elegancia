
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from './types';
import { 
  fetchAllTestimonials,
  addTestimonial as apiAddTestimonial,
  updateTestimonial as apiUpdateTestimonial,
  deleteTestimonial as apiDeleteTestimonial,
  updateTestimonialStatus as apiUpdateTestimonialStatus,
  ensureTestimonialsBucketExists
} from './api';
import { sendTestimonialApprovedNotification } from '@/utils/emailUtils';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  useEffect(() => {
    fetchTestimonials();
    
    // Ensure bucket exists when component mounts
    ensureTestimonialsBucketExists();
    
    const channel = supabase
      .channel('public:testimonials')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'testimonials' 
        },
        () => {
          fetchTestimonials();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllTestimonials();
      setTestimonials(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (activeFilter === 'all') return true;
    return testimonial.status === activeFilter;
  });

  const addTestimonial = async (formData: { name: string; role: string; quote: string; email: string }, uploadImage: File | null) => {
    setIsSubmitting(true);
    const success = await apiAddTestimonial(formData, uploadImage);
    setIsSubmitting(false);
    return success;
  };

  const updateTestimonial = async (
    testimonial: Testimonial, 
    formData: { name: string; role: string; quote: string; email: string }, 
    uploadImage: File | null
  ) => {
    setIsSubmitting(true);
    const success = await apiUpdateTestimonial(testimonial, formData, uploadImage);
    setIsSubmitting(false);
    return success;
  };

  const updateTestimonialStatus = async (
    testimonial: Testimonial,
    newStatus: 'pending' | 'approved' | 'rejected'
  ) => {
    setIsSubmitting(true);
    const success = await apiUpdateTestimonialStatus(testimonial, newStatus);
    
    // Send notification when testimonial is approved
    if (success && newStatus === 'approved') {
      try {
        await sendTestimonialApprovedNotification(testimonial.name, testimonial.email);
      } catch (error) {
        console.error('Error sending testimonial approval notification:', error);
      }
    }
    
    setIsSubmitting(false);
    return success;
  };

  const deleteTestimonial = async (testimonial: Testimonial) => {
    return await apiDeleteTestimonial(testimonial);
  };

  return {
    testimonials: filteredTestimonials,
    isLoading,
    isSubmitting,
    activeFilter,
    setActiveFilter,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    updateTestimonialStatus,
    deleteTestimonial
  };
}
