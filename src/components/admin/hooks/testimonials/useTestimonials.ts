
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from './testimonialsApi';
import { Testimonial, TestimonialFormData } from './types';
import { toast } from 'sonner';
import { sendNewTestimonialNotification, sendTestimonialApprovedNotification } from '@/utils/email';

export const useTestimonials = () => {
  const queryClient = useQueryClient();

  const {
    data: testimonials = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialsApi.getTestimonials,
  });

  const createMutation = useMutation({
    mutationFn: testimonialsApi.createTestimonial,
    onSuccess: (newTestimonial: Testimonial) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento criado com sucesso!');

      // Enviar email de notificação para novo depoimento
      sendNewTestimonialNotification(newTestimonial.name, newTestimonial.email)
        .then(success => {
          if (success) {
            console.log('New testimonial notification email sent successfully');
          } else {
            console.warn('Failed to send new testimonial notification email');
          }
        })
        .catch(error => {
          console.error('Error sending new testimonial notification email:', error);
        });
    },
    onError: (error) => {
      console.error('Erro ao criar depoimento:', error);
      toast.error('Erro ao criar depoimento.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonialFormData> }) =>
      testimonialsApi.updateTestimonial(id, data),
    onSuccess: (updatedTestimonial: Testimonial) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento atualizado com sucesso!');

      // Enviar email de notificação para depoimento aprovado
      if (updatedTestimonial.status === 'approved') {
        sendTestimonialApprovedNotification(updatedTestimonial.name, updatedTestimonial.email)
          .then(success => {
            if (success) {
              console.log('Testimonial approved notification email sent successfully');
            } else {
              console.warn('Failed to send testimonial approved notification email');
            }
          })
          .catch(error => {
            console.error('Error sending testimonial approved notification email:', error);
          });
      }
    },
    onError: (error) => {
      console.error('Erro ao atualizar depoimento:', error);
      toast.error('Erro ao atualizar depoimento.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: testimonialsApi.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir depoimento:', error);
      toast.error('Erro ao excluir depoimento.');
    },
  });

  return {
    testimonials,
    isLoading,
    error,
    refetch,
    createTestimonial: async (data: TestimonialFormData): Promise<Testimonial> => {
      return await createMutation.mutateAsync(data);
    },
    updateTestimonial: async (id: string, data: Partial<TestimonialFormData>): Promise<Testimonial> => {
      return await updateMutation.mutateAsync({ id, data });
    },
    deleteTestimonial: async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
