
import { useState } from 'react';
import ProposalTemplatesList from './ProposalTemplatesList';
import ProposalTemplateEditor from './ProposalTemplateEditor';
import { ProposalTemplateData } from '../api/proposalTemplates';

const ProposalTemplatesManager = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplateData | null>(null);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setCurrentView('create');
  };

  const handleEdit = (template: ProposalTemplateData) => {
    setSelectedTemplate(template);
    setCurrentView('edit');
  };

  const handleSave = () => {
    setCurrentView('list');
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedTemplate(null);
  };

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <ProposalTemplateEditor
        template={selectedTemplate || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProposalTemplatesList
      onEdit={handleEdit}
      onCreate={handleCreate}
    />
  );
};

export default ProposalTemplatesManager;
