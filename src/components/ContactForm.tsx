import { useState, FormEvent, useEffect, useRef } from 'react';
import { Phone, Instagram, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendContactNotification } from '@/utils/emailUtils';
const ContactForm = () => {
  const {
    toast
  } = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    eventLocation: '',
    message: ''
  });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert form data to Supabase quote_requests table
      const {
        error
      } = await supabase.from('quote_requests').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        event_type: formData.eventType,
        event_date: formData.date || null,
        event_location: formData.eventLocation,
        message: formData.message || null
      });
      if (error) throw error;

      // Send email notification
      await sendContactNotification(formData.name, formData.email, formData.phone, formData.message || '');
      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em breve para um orçamento personalizado."
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        eventLocation: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar o formulário",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <section id="contato" className="bg-lavender/20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="section-title animate-on-scroll">Contato</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-on-scroll">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" placeholder="Seu nome completo" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" placeholder="seu.email@exemplo.com" />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" placeholder="(XX) XXXXX-XXXX" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                  <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold">
                    <option value="">Selecione o tipo de evento</option>
                    <option value="casamento">Casamento</option>
                    <option value="15anos">Festa de 15 anos</option>
                    <option value="corporativo">Evento corporativo</option>
                    <option value="formatura">Formatura</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data do Evento</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">Local do Evento</label>
                <input type="text" id="eventLocation" name="eventLocation" value={formData.eventLocation} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" placeholder="Cidade e local do evento" />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold" placeholder="Conte-me mais sobre seu evento..." />
              </div>
              
              <button type="submit" disabled={loading} className="w-full btn btn-primary">
                {loading ? "Enviando..." : "Quero fazer um orçamento"}
              </button>
            </form>
          </div>
          
          <div className="animate-on-scroll">
            <div className="h-full flex flex-col justify-center">
              <h3 className="font-playfair text-2xl font-semibold mb-6">Vamos conversar?</h3>
              <p className="mb-8 text-lg">Entre em contato para agendar uma conversa e descobrir como posso tornar seu evento inesquecível.</p>
              
              <div className="space-y-6">
                <a href="https://wa.me/5524992689947" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gold transition-colors group">
                  <Phone className="w-6 h-6 mr-3 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-lg">(24) 99268-9947</span>
                </a>
                
                <a href="https://instagram.com/anrielly" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gold transition-colors group">
                  <Instagram className="w-6 h-6 mr-3 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-lg">@anrielly</span>
                </a>
                
                <a href="mailto:contato@anriellygomes.com" className="flex items-center hover:text-gold transition-colors group">
                  <Mail className="w-6 h-6 mr-3 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-lg">contato@anriellygomes.com.br</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactForm;