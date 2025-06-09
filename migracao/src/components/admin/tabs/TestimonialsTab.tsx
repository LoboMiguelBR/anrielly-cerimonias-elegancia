
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useTestimonials } from '../hooks/testimonials/useTestimonials';
import { Testimonial } from '../hooks/testimonials/types';
import TestimonialCard from '../testimonials/TestimonialCard';
import AddTestimonialDialog from '../testimonials/AddTestimonialDialog';
import EditTestimonialDialog from '../testimonials/EditTestimonialDialog';
import DeleteTestimonialDialog from '../testimonials/DeleteTestimonialDialog';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestimonialsTab = () => {
  const {
    testimonials,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = useTestimonials();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Add dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  // Filter testimonials based on active filter
  const filteredTestimonials = Array.isArray(testimonials) 
    ? testimonials.filter(testimonial => {
        if (activeFilter === 'all') return true;
        return testimonial.status === activeFilter;
      })
    : [];

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setShowEditDialog(true);
  };

  const confirmDeleteTestimonial = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return false;
    try {
      await deleteTestimonial(testimonialToDelete.id);
      setTestimonialToDelete(null);
      setShowDeleteDialog(false);
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }
  };

  const handleUpdateStatus = async (testimonial: Testimonial, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateTestimonial(testimonial.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  const handleAddTestimonial = async (formData: { name: string; role: string; quote: string; email: string }, uploadImage: File | null) => {
    try {
      // Handle image upload if needed (you may want to implement this)
      let imageUrl = null;
      // if (uploadImage) {
      //   imageUrl = await uploadTestimonialImage(uploadImage);
      // }

      await createTestimonial({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        quote: formData.quote,
        image_url: imageUrl,
        status: 'pending'
      });

      setShowAddDialog(false);
      return true;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      return false;
    }
  };

  const handleUpdateTestimonial = async (testimonial: Testimonial, formData: { name: string; role: string; quote: string; email: string }, uploadImage: File | null) => {
    try {
      // Handle image upload if needed
      let imageUrl = testimonial.image_url;
      // if (uploadImage) {
      //   imageUrl = await uploadTestimonialImage(uploadImage);
      // }

      await updateTestimonial(testimonial.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        quote: formData.quote,
        image_url: imageUrl
      });

      setShowEditDialog(false);
      setCurrentTestimonial(null);
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return false;
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeleting;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Depoimentos</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2" size={16} /> Adicionar Depoimento
        </Button>
      </div>
      
      <Tabs value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)} className="mb-6">
        <TabsList className="mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
        </TabsList>
        
        <div className="text-sm text-gray-500">
          {activeFilter === 'all' && 'Exibindo todos os depoimentos'}
          {activeFilter === 'pending' && 'Exibindo apenas depoimentos pendentes de aprovação'}
          {activeFilter === 'approved' && 'Exibindo apenas depoimentos aprovados'}
          {activeFilter === 'rejected' && 'Exibindo apenas depoimentos rejeitados'}
        </div>
      </Tabs>
      
      {isLoading ? (
        <div className="p-12 text-center">Carregando depoimentos...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-lg">
          {activeFilter === 'all' ? (
            <>
              <p className="text-gray-500 mb-4">Nenhum depoimento cadastrado</p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                <Plus className="mr-2" size={16} /> Adicionar primeiro depoimento
              </Button>
            </>
          ) : (
            <p className="text-gray-500">Nenhum depoimento {
              activeFilter === 'pending' ? 'pendente' : 
              activeFilter === 'approved' ? 'aprovado' : 
              'rejeitado'
            } encontrado</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onEdit={handleEditTestimonial}
              onDelete={confirmDeleteTestimonial}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
      
      {/* Add Testimonial Dialog */}
      <AddTestimonialDialog
        isOpen={showAddDialog}
        isSubmitting={isSubmitting}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddTestimonial}
      />
      
      {/* Edit Testimonial Dialog */}
      <EditTestimonialDialog
        isOpen={showEditDialog}
        isSubmitting={isSubmitting}
        testimonial={currentTestimonial}
        onClose={() => setShowEditDialog(false)}
        onSubmit={handleUpdateTestimonial}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteTestimonialDialog
        isOpen={showDeleteDialog}
        testimonial={testimonialToDelete}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TestimonialsTab;
