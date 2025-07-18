
import React, { useCallback } from 'react';
import { TemplateAsset, TemplateEditorProps } from './types';
import { useTemplateEditor } from './hooks/useTemplateEditor';
import { supabase } from '@/integrations/supabase/client';
import TemplatePreview from './TemplatePreview';
import EditorHeader from './components/EditorHeader';
import TemplateMetaFields from './components/TemplateMetaFields';
import ErrorMessages from './components/ErrorMessages';
import EditorContent from './components/EditorContent';
import SidebarTools from './components/SidebarTools';
import LoadingState from './components/LoadingState';
import { insertVariableAtCursor } from './utils/editorUtils';

export const TemplateHtmlEditor: React.FC<TemplateEditorProps> = ({ 
  initialTemplate,
  onSave,
  onCancel
}) => {
  const {
    template,
    htmlContent,
    cssContent,
    isLoading,
    isSaving,
    previewMode,
    activeEditor,
    currentCursorPosition,
    saveError,
    debugInfo,
    setActiveEditor,
    handleNameChange,
    handleDescriptionChange,
    handleHtmlChange,
    handleCssChange,
    handleSave,
    togglePreviewMode,
    handleInsertVariable,
    handleCursorPositionChange
  } = useTemplateEditor(initialTemplate, onSave);

  // Enhanced template handling with categories and versioning
  const handleEnhancedSave = async () => {
    try {
      await handleSave();
      // Update usage stats when template is saved/used
      if (template?.id) {
        await supabase
          .from('proposal_template_html')
          .update({ 
            usage_count: 1,
            last_used_at: new Date().toISOString()
          })
          .eq('id', template.id);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Use useCallback to prevent creating new functions on every render
  const onSelectAsset = useCallback((asset: TemplateAsset) => {
    if (!asset.url) {
      console.warn('Asset URL is undefined:', asset);
      return;
    }
    
    if (activeEditor === 'html') {
      const imageTag = `<img src="${asset.url}" alt="${asset.fileName}" />`;
      const result = insertVariableAtCursor(
        htmlContent,
        currentCursorPosition,
        '',
        '',
        imageTag
      );
      handleHtmlChange(result.updatedContent);
      handleCursorPositionChange(result.cursorPosition);
      
    } else if (activeEditor === 'css') {
      const cssImageUrl = `url('${asset.url}')`;
      const result = insertVariableAtCursor(
        cssContent,
        currentCursorPosition,
        '',
        '',
        cssImageUrl
      );
      handleCssChange(result.updatedContent);
    }
  }, [activeEditor, htmlContent, cssContent, currentCursorPosition, handleHtmlChange, handleCssChange, handleCursorPositionChange]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="template-html-editor">
      <EditorHeader
        templateId={template?.id || 'new'}
        templateName={template?.name || ''}
        isSaving={isSaving}
        previewMode={previewMode}
        onCancel={onCancel || (() => {})}
        onTogglePreview={togglePreviewMode}
        onSave={handleEnhancedSave}
      />

      <ErrorMessages 
        saveError={saveError} 
        debugInfo={debugInfo} 
      />

      <TemplateMetaFields
        name={template?.name || ''}
        description={template?.description || ''}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      />

      {previewMode ? (
        <div className="border rounded-lg shadow-sm p-4 bg-white">
          <TemplatePreview htmlContent={htmlContent} cssContent={cssContent} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <EditorContent
              activeEditor={activeEditor}
              htmlContent={htmlContent}
              cssContent={cssContent}
              setActiveEditor={setActiveEditor}
              onHtmlChange={handleHtmlChange}
              onCssChange={handleCssChange}
              onCursorPositionChange={handleCursorPositionChange}
            />
          </div>
          
          <div>
            <SidebarTools
              activeEditor={activeEditor}
              currentCursorPosition={currentCursorPosition}
              onInsertVariable={handleInsertVariable}
              onSelectAsset={onSelectAsset}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateHtmlEditor;
