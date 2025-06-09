
import { useState } from 'react';

export const useTemplateDisplay = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  return {
    isLoading,
    setIsLoading,
    activeTab,
    setActiveTab,
    previewMode,
    togglePreviewMode
  };
};
