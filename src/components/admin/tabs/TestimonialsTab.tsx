
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useTestimonials, Testimonial } from '../hooks/useTestimonials';
import TestimonialCard from '../testimonials/TestimonialCard';
import AddTestimonialDialog from '../testimonials/AddTestimonialDialog';
import EditTestimonialDialog from '../testimonials/EditTestimonialDialog';
import DeleteTestimonialDialog from '../testimonials/DeleteTestimonialDialog';

const TestimonialsTab = () => {
  const {
    testimonials,
    isLoading,
    isSubmitting,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = useTestimonials();
  
  // Add dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  
  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  
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
    const success = await deleteTestimonial(testimonialToDelete);
    return success;
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
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onEdit={handleEditTestimonial}
              onDelete={confirmDeleteTestimonial}
            />
          ))}
        </div>
      )}
      
      {/* Add Testimonial Dialog */}
      <AddTestimonialDialog
        isOpen={showAddDialog}
        isSubmitting={isSubmitting}
        onClose={() => setShowAddDialog(false)}
        onSubmit={addTestimonial}
      />
      
      {/* Edit Testimonial Dialog */}
      <EditTestimonialDialog
        isOpen={showEditDialog}
        isSubmitting={isSubmitting}
        testimonial={currentTestimonial}
        onClose={() => setShowEditDialog(false)}
        onSubmit={updateTestimonial}
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
