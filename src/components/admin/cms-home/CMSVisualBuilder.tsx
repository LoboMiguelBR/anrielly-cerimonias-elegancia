
import React, { useState } from "react";
import { useCMSHomeSections, CMSHomeSection } from "@/hooks/useCMSHomeSections";
import CMSVisualSectionEditor from "./CMSVisualSectionEditor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CMSVisualBuilder: React.FC = () => {
  const {
    sections,
    loading,
    updateSection,
    reorderSections,
    fetchSections
  } = useCMSHomeSections();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleEdit = (id: string) => setEditingId(id);
  const handleCancel = () => setEditingId(null);
  const handleSaveEdit = async (updates: Partial<CMSHomeSection>) => {
    if (editingId) {
      await updateSection(editingId, updates);
      setEditingId(null);
    }
  };

  const handleDragEnd = (result: any) => {
    setDragging(false);
    if (!result.destination) return;
    const reordered = Array.from(sections);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    reorderSections(reordered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Editor visual, drag-and-drop + edição inline */}
      <div className="flex-1 border rounded-md bg-gray-50 p-4 min-h-[70vh]">
        <h2 className="text-xl font-bold mb-3">Builder Visual da Home</h2>
        <DragDropContext
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="cms-sections-v">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-3"
              >
                {sections.map((section, idx) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          border rounded bg-white transition-shadow p-2 
                          ${snapshot.isDragging ? "shadow-lg" : ""}
                        `}
                        style={{
                          background:
                            section.background_image
                              ? `url(${section.background_image})`
                              : section.bg_color || "#fff",
                          backgroundSize: section.background_image
                            ? "cover"
                            : "initial",
                          backgroundPosition: "center",
                          minHeight: 120,
                        }}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              {...provided.dragHandleProps}
                              title="Arraste para mover"
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </span>
                            <div>
                              <strong className="text-lg">
                                {section.title || "(sem título)"}
                              </strong>
                              <span className="ml-2 text-gray-500 text-xs">
                                #{section.order_index}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(section.id)}
                            title="Editar seção"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        {editingId === section.id && (
                          <div className="mt-2">
                            <CMSVisualSectionEditor
                              section={section}
                              onSave={handleSaveEdit}
                              onCancel={handleCancel}
                            />
                          </div>
                        )}
                        {/* Preview da seção */}
                        <div className="mt-3 bg-opacity-60 rounded p-4">
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: section.content_html || "<em>Sem conteúdo HTML</em>",
                            }}
                          />
                          {section.cta_label && (
                            <a
                              href={section.cta_link || "#"}
                              className="mt-2 inline-block bg-primary text-white rounded px-4 py-2 hover:bg-opacity-90"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {section.cta_label}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="pt-6 flex gap-3">
          <Button onClick={fetchSections} variant="outline">
            Recarregar Seções
          </Button>
        </div>
      </div>
      {/* Preview global ao lado */}
      <div className="w-full max-w-xl border rounded-md bg-white shadow px-2 py-4 hidden md:block">
        <h3 className="font-semibold mb-2 text-center">Preview Global da Home</h3>
        <div className="space-y-4">
          {sections.map(section => (
            <div
              key={section.id}
              style={{
                background: section.background_image
                  ? `url(${section.background_image})`
                  : section.bg_color || "#fff",
                backgroundSize: section.background_image ? "cover" : "initial",
                backgroundPosition: "center",
                borderRadius: 8,
                padding: 16,
              }}
              className="shadow-sm"
            >
              <h4 className="font-bold mb-1">{section.title}</h4>
              {section.subtitle && (
                <div className="mb-1 text-gray-600">{section.subtitle}</div>
              )}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: section.content_html || "",
                }}
              />
              {section.cta_label && (
                <a
                  href={section.cta_link || "#"}
                  className="mt-2 inline-block bg-primary text-white rounded px-4 py-1 hover:bg-opacity-90"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {section.cta_label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMSVisualBuilder;

