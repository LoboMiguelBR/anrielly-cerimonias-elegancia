
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useCMSHomeSections, CMSHomeSection } from '@/hooks/useCMSHomeSections';
import CMSSectionEditor from './CMSSectionEditor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CMSHomeManager = () => {
  const { 
    sections, 
    loading, 
    updateSection, 
    createSection, 
    deleteSection, 
    reorderSections 
  } = useCMSHomeSections();
  
  const [editingSection, setEditingSection] = useState<CMSHomeSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleToggleActive = async (section: CMSHomeSection) => {
    await updateSection(section.id, { active: !section.active });
  };

  const handleEdit = (section: CMSHomeSection) => {
    setEditingSection(section);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleDelete = async (section: CMSHomeSection) => {
    if (window.confirm(`Tem certeza que deseja excluir a seção "${section.title}"?`)) {
      await deleteSection(section.id);
    }
  };

  const handleSave = async (sectionData: Omit<CMSHomeSection, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingSection) {
      await updateSection(editingSection.id, sectionData);
      setEditingSection(null);
    } else {
      await createSection(sectionData);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setIsCreating(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedSections = Array.from(sections);
    const [removed] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, removed);

    reorderSections(reorderedSections);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Se estiver editando ou criando, mostrar o editor
  if (editingSection || isCreating) {
    return (
      <CMSSectionEditor
        section={editingSection}
        onSave={handleSave}
        onCancel={handleCancel}
        isCreating={isCreating}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Home - CMS</h2>
          <p className="text-gray-600">Configure as seções da página principal</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Seção
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided, snapshot) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {section.title}
                                <Badge variant={section.active ? 'default' : 'secondary'}>
                                  {section.active ? 'Ativa' : 'Inativa'}
                                </Badge>
                                <Badge variant="outline">
                                  #{section.order_index}
                                </Badge>
                              </CardTitle>
                              <p className="text-sm text-gray-600">{section.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleActive(section)}
                            >
                              {section.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(section)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(section)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {section.content_html && (
                        <CardContent>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <strong>Slug:</strong> {section.slug}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma seção criada ainda.</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira seção
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CMSHomeManager;
