
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from './types';
import { 
  fetchAllTestimonials,
  addTestimonial as apiAddTestimonial,
  updateTestimonial as apiUpdateTestimonial,
  deleteTestimonial as apiDeleteTestimonial,
  ensureTestimonialsBucketExists
} from './testimonialsApi';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const addTestimonial = async (formData: { name: string; role: string; quote: string }, uploadImage: File | null) => {
    setIsSubmitting(true);
    const success = await apiAddTestimonial(formData, uploadImage);
    setIsSubmitting(false);
    return success;
  };

  const updateTestimonial = async (
    testimonial: Testimonial, 
    formData: { name: string; role: string; quote: string }, 
    uploadImage: File | null
  ) => {
    setIsSubmitting(true);
    const success = await apiUpdateTestimonial(testimonial, formData, uploadImage);
    setIsSubmitting(false);
    return success;
  };

  const deleteTestimonial = async (testimonial: Testimonial) => {
    return await apiDeleteTestimonial(testimonial);
  };

  return {
    testimonials,
    isLoading,
    isSubmitting,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  };
}
