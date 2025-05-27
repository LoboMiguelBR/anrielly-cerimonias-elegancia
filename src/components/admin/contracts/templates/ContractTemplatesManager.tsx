
import { useState } from 'react';
import ContractTemplatesList from './ContractTemplatesList';
import ContractTemplateEditor from './ContractTemplateEditor';
import { ContractTemplate } from '../../hooks/contract/types';

const ContractTemplatesManager = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setCurrentView('create');
  };

  const handleEdit = (template: ContractTemplate) => {
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
      <ContractTemplateEditor
        template={selectedTemplate || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ContractTemplatesList
      onEdit={handleEdit}
      onCreate={handleCreate}
    />
  );
};

export default ContractTemplatesManager;
