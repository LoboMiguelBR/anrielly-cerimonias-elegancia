
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Mail, User } from 'lucide-react';
import { useTestimonials } from '@/components/admin/hooks/useTestimonials';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestimonialApprovalManager = () => {
  const { testimonials, refetch } = useTestimonials();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setUpdating(id);
      
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Depoimento ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do depoimento');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingTestimonials = testimonials.filter(t => t.status === 'pending');
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
  const rejectedTestimonials = testimonials.filter(t => t.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{pendingTestimonials.length}</div>
          <div className="text-sm text-yellow-700">Pendentes</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{approvedTestimonials.length}</div>
          <div className="text-sm text-green-700">Aprovados</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{rejectedTestimonials.length}</div>
          <div className="text-sm text-red-700">Rejeitados</div>
        </div>
      </div>

      {/* Depoimentos Pendentes */}
      {pendingTestimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Depoimentos Pendentes ({pendingTestimonials.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-4 border rounded-lg bg-yellow-50">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image_url || ''} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      {getStatusBadge(testimonial.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {testimonial.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{testimonial.role}</p>
                    <blockquote className="text-gray-700 italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                        disabled={updating === testimonial.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                        disabled={updating === testimonial.id}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Todos os Depoimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Depoimentos ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={testimonial.image_url || ''} />
                    <AvatarFallback>
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(testimonial.status)}
                  {testimonial.status !== 'approved' && (
                    <Button
                      onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                      disabled={updating === testimonial.id}
                      size="sm"
                      variant="outline"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {testimonial.status !== 'rejected' && (
                    <Button
                      onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                      disabled={updating === testimonial.id}
                      size="sm"
                      variant="outline"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {testimonials.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum depoimento encontrado.
        </div>
      )}
    </div>
  );
};

export default TestimonialApprovalManager;
