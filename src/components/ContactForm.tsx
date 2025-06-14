
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MessageSquare, Calendar, Heart, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('save-lead', {
        body: {
          name,
          email,
          phone,
          message,
          event_type: eventType || 'Não especificado',
          event_date: eventDate || null,
          event_location: eventLocation || ''
        }
      });

      if (error) throw error;
      
      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      
      // Limpar formulário
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setEventType('');
      setEventDate('');
      setEventLocation('');
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Falha ao enviar a mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-gradient-to-br from-rose-50 to-neutral-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vamos conversar sobre o seu evento especial. Entre em contato conosco para uma consulta personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Informações de Contato */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-rose-500" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-rose-50 border border-rose-100">
                  <Phone className="h-6 w-6 text-rose-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefone / WhatsApp</p>
                    <p className="text-rose-600 font-semibold">(24) 99268-9947</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <Mail className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">contato@anriellygomes.com.br</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <MapPin className="h-6 w-6 text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">Área de Atendimento</p>
                    <p className="text-amber-600">Região Serrana do Rio de Janeiro</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Envie sua Mensagem</CardTitle>
              <p className="text-gray-600">Preencha o formulário abaixo e retornaremos em breve</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-12 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Informações do Evento (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Evento
                      </label>
                      <Select value={eventType} onValueChange={setEventType}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-rose-500">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casamento">Casamento</SelectItem>
                          <SelectItem value="aniversario">Aniversário</SelectItem>
                          <SelectItem value="formatura">Formatura</SelectItem>
                          <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                          <SelectItem value="batizado">Batizado</SelectItem>
                          <SelectItem value="debutante">Festa de 15 Anos</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data do Evento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local do Evento
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cidade, local do evento"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="pl-12 h-12 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                    <Textarea
                      placeholder="Conte-nos mais sobre o seu evento e como podemos ajudar..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pl-12 min-h-[120px] border-gray-300 focus:border-rose-500 focus:ring-rose-500 resize-none"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-12 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
