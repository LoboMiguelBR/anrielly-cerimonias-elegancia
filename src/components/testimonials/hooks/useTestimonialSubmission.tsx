
import { useState } from 'react';
import { toast } from 'sonner';
import { testimonialsApi } from '@/components/admin/hooks/testimonials/testimonialsApi';
import { sendNewTestimonialNotification } from '@/utils/email';

const useTestimonialSubmission = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !message) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit testimonial
      await testimonialsApi.createTestimonial({
        name,
        email,
        role: '',
        quote: message,
        status: 'pending'
      });

      // Send notification
      await sendNewTestimonialNotification(name, email);

      toast.success('Depoimento enviado com sucesso! Ele será avaliado e publicado em breve.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar depoimento:', error);
      toast.error('Erro ao enviar depoimento. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting,
    handleSubmit
  };
};

export default useTestimonialSubmission;
