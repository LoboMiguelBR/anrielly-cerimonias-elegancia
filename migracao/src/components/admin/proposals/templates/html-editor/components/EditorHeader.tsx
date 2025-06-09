
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, Eye, Loader2, Save } from 'lucide-react';

interface EditorHeaderProps {
  templateId: string;
  templateName: string;
  isSaving: boolean;
  previewMode: boolean;
  onCancel: () => void;
  onTogglePreview: () => void;
  onSave: () => Promise<void>;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  templateId,
  templateName,
  isSaving,
  previewMode,
  onCancel,
  onTogglePreview,
  onSave
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">
          {templateId === 'new' ? 'Criar Novo Template' : 'Editar Template'}
        </h2>
        <p className="text-gray-500">
          Editor HTML para templates de propostas
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          onClick={onCancel}
          className="flex items-center"
        >
          <ArrowLeftCircle className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={onTogglePreview}
          variant={previewMode ? "default" : "outline"}
          className="flex items-center"
        >
          <Eye className="mr-2 h-4 w-4" />
          {previewMode ? "Editando" : "Preview"}
        </Button>
        
        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
