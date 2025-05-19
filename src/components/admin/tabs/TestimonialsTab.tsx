
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string | null;
  order_index: number | null;
}

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
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
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Erro ao carregar depoimentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = currentTestimonial.image_url;

      // Upload image if there is one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('testimonials').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
      
      if (isEditing && currentTestimonial.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: currentTestimonial.name,
            role: currentTestimonial.role,
            quote: currentTestimonial.quote,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTestimonial.id);
          
        if (error) throw error;
        toast.success('Depoimento atualizado com sucesso!');
      } else {
        // Insert new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert({
            name: currentTestimonial.name,
            role: currentTestimonial.role,
            quote: currentTestimonial.quote,
            image_url: imageUrl,
            order_index: testimonials.length
          });
          
        if (error) throw error;
        toast.success('Depoimento adicionado com sucesso!');
      }
      
      resetAndCloseDialog();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Erro ao salvar depoimento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Depoimento removido com sucesso!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Erro ao excluir depoimento');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
    setImagePreview(testimonial.image_url);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTestimonial({});
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const resetAndCloseDialog = () => {
    setCurrentTestimonial({});
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Depoimentos</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Depoimento
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">Carregando depoimentos...</div>
      ) : testimonials.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          <p>Nenhum depoimento encontrado</p>
          <Button onClick={handleAddNew} variant="outline" className="mt-4">
            Adicionar Primeiro Depoimento
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo/Evento</TableHead>
              <TableHead>Depoimento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {testimonial.image_url ? (
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{testimonial.name}</TableCell>
                <TableCell>{testimonial.role}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Depoimento' : 'Novo Depoimento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Foto (opcional)
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sem foto</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={currentTestimonial.name || ''}
                onChange={e => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cargo/Evento *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={currentTestimonial.role || ''}
                onChange={e => setCurrentTestimonial({...currentTestimonial, role: e.target.value})}
                placeholder="Ex: Casamento no Rio de Janeiro"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Depoimento *</label>
              <textarea
                rows={4}
                className="w-full p-2 border rounded-md"
                value={currentTestimonial.quote || ''}
                onChange={e => setCurrentTestimonial({...currentTestimonial, quote: e.target.value})}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsTab;
