import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactNotification } from '@/utils/email';
import { toast } from 'sonner';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await sendContactNotification(name, email, phone, message);
      if (success) {
        toast.success('Mensagem enviada com sucesso!');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        toast.error('Falha ao enviar a mensagem. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Seu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Seu Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Sua Mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
