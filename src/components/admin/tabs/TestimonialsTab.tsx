
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Trash2, Upload, Plus, Pencil, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
  });
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  
  useEffect(() => {
    fetchTestimonials();
    
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
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Erro ao carregar depoimentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadImage(null);
      setPreviewUrl('');
      return;
    }
    
    setUploadImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTestimonial = async () => {
    if (!formData.name || !formData.role || !formData.quote) {
      toast.error('Todos os campos de texto são obrigatórios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      
      // Upload image if selected
      if (uploadImage) {
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Create testimonial record
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: formData.name,
          role: formData.role,
          quote: formData.quote,
          image_url: imageUrl,
          order_index: testimonials.length
        });
      
      if (insertError) throw insertError;
      
      toast.success('Depoimento adicionado com sucesso!');
      setShowAddDialog(false);
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        quote: '',
      });
      setUploadImage(null);
      setPreviewUrl('');
      
    } catch (error: any) {
      console.error('Error adding testimonial:', error);
      toast.error(`Erro ao adicionar depoimento: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
    });
    setPreviewUrl(testimonial.image_url || '');
    setShowEditDialog(true);
  };

  const saveTestimonialChanges = async () => {
    if (!currentTestimonial || !formData.name || !formData.role || !formData.quote) {
      toast.error('Todos os campos de texto são obrigatórios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = currentTestimonial.image_url;
      
      // Upload new image if selected
      if (uploadImage) {
        // Remove old image if exists
        if (currentTestimonial.image_url) {
          const oldFileName = currentTestimonial.image_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('testimonials')
              .remove([oldFileName]);
          }
        }
        
        // Upload new image
        const fileExt = uploadImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, uploadImage);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }
      
      // Update testimonial record
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: formData.name,
          role: formData.role,
          quote: formData.quote,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentTestimonial.id);
      
      if (error) throw error;
      
      toast.success('Depoimento atualizado com sucesso!');
      setShowEditDialog(false);
      
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      toast.error(`Erro ao atualizar depoimento: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteTestimonial = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteDialog(true);
  };

  const deleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    
    try {
      // Remove image from storage if exists
      if (testimonialToDelete.image_url) {
        const fileName = testimonialToDelete.image_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('testimonials')
            .remove([fileName]);
          
          if (storageError) {
            console.error('Storage removal error:', storageError);
            // Continue with deletion from database even if storage removal fails
          }
        }
      }
      
      // Delete from testimonials table
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialToDelete.id);
      
      if (error) throw error;
      
      toast.success('Depoimento removido com sucesso!');
      setShowDeleteDialog(false);
      setTestimonialToDelete(null);
      
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Depoimentos</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2" size={16} /> Adicionar Depoimento
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-12 text-center">Carregando depoimentos...</div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Nenhum depoimento cadastrado</p>
          <Button onClick={() => setShowAddDialog(true)} variant="outline">
            <Plus className="mr-2" size={16} /> Adicionar primeiro depoimento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border rounded-md p-4 bg-white">
              <div className="flex items-center gap-4 mb-3">
                {testimonial.image_url ? (
                  <img 
                    src={testimonial.image_url} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gold/30">
                    <span className="text-gray-500 text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <blockquote className="mb-4 text-gray-700 italic text-sm">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditTestimonial(testimonial)}
                >
                  <Pencil size={14} className="mr-1" /> Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600" 
                  onClick={() => confirmDeleteTestimonial(testimonial)}
                >
                  <Trash2 size={14} className="mr-1" /> Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Testimonial Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Depoimento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            {previewUrl ? (
              <div className="relative mx-auto w-24 h-24">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  onClick={() => {
                    setUploadImage(null);
                    setPreviewUrl('');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <label htmlFor="upload-avatar" className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 mb-1 text-gray-400" />
                    <p className="text-xs text-gray-500">Avatar</p>
                  </div>
                  <input
                    id="upload-avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome da pessoa"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Identificação</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Ex: Noiva em Volta Redonda, Debutante em Barra Mansa"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quote">Depoimento</Label>
              <Textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="O que a pessoa disse sobre seu trabalho..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddTestimonial} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Adicionar Depoimento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Testimonial Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Depoimento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            {previewUrl ? (
              <div className="relative mx-auto w-24 h-24">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-full"
                />
                {uploadImage && (
                  <button
                    onClick={() => {
                      setUploadImage(null);
                      setPreviewUrl(currentTestimonial?.image_url || '');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <label htmlFor="edit-avatar" className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 mb-1 text-gray-400" />
                    <p className="text-xs text-gray-500">Avatar</p>
                  </div>
                  <input
                    id="edit-avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Identificação</Label>
              <Input
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-quote">Depoimento</Label>
              <Textarea
                id="edit-quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={saveTestimonialChanges} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.</p>
            
            {testimonialToDelete && (
              <div className="mt-4 flex items-center gap-4">
                {testimonialToDelete.image_url ? (
                  <img 
                    src={testimonialToDelete.image_url} 
                    alt={testimonialToDelete.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">
                      {testimonialToDelete.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{testimonialToDelete.name}</p>
                  <p className="text-sm text-gray-500">{testimonialToDelete.role}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteTestimonial}
            >
              Excluir Depoimento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsTab;
