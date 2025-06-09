
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import useTestimonialSubmission from '../hooks/useTestimonialSubmission';

interface TestimonialSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialSubmissionModal = ({ isOpen, onClose }: TestimonialSubmissionModalProps) => {
  const { 
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    isSubmitting,
    handleSubmit
  } = useTestimonialSubmission();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envie seu Depoimento</DialogTitle>
        </DialogHeader>
        
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-md mb-4">
          Seu depoimento será exibido após análise e aprovação.
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Depoimento *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Conte sobre sua experiência..."
              rows={4}
              required
            />
          </div>
        </form>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialSubmissionModal;
