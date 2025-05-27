
import { useState } from 'react';
import { ContractEmailTemplate } from '../../hooks/contract/types';
import ContractEmailTemplatesList from './ContractEmailTemplatesList';
import ContractEmailTemplateEditor from './ContractEmailTemplateEditor';

const ContractEmailTemplatesManager = () => {
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractEmailTemplate | undefined>();

  const handleEdit = (template: ContractEmailTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('editor');
  };

  const handleCreate = () => {
    setSelectedTemplate(undefined);
    setCurrentView('editor');
  };

  const handleSave = () => {
    setCurrentView('list');
    setSelectedTemplate(undefined);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedTemplate(undefined);
  };

  if (currentView === 'editor') {
    return (
      <ContractEmailTemplateEditor
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ContractEmailTemplatesList
      onEdit={handleEdit}
      onCreate={handleCreate}
    />
  );
};

export default ContractEmailTemplatesManager;
