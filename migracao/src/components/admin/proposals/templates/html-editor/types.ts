
export interface HtmlTemplateData {
  id: string;
  name: string;
  description?: string;
  htmlContent: string;
  cssContent?: string;
  variables: Record<string, string[]>;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  description?: string;
  htmlContent: string;
  sectionType: TemplateSectionType;
  createdAt?: string;
  updatedAt?: string;
}

export enum TemplateSectionType {
  HEADER = 'header',
  FOOTER = 'footer',
  CLIENT_INFO = 'client_info',
  SERVICES = 'services',
  PRICING = 'pricing',
  TESTIMONIALS = 'testimonials',
  ABOUT = 'about',
  QRCODE = 'qrcode',
  CUSTOM = 'custom'
}

export interface TemplateAsset {
  id: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  fileType?: string;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
}

export interface TemplateVariable {
  name: string;
  category: string;
  description?: string;
  defaultValue?: string;
  sampleValue?: string;
}

export interface TemplateEditorState {
  currentTemplate: HtmlTemplateData | null;
  availableSections: TemplateSection[];
  availableAssets: TemplateAsset[];
  previewMode: boolean;
  selectedElement: string | null;
  isDragging: boolean;
  unsavedChanges: boolean;
}

export interface TemplateEditorProps {
  initialTemplate?: HtmlTemplateData;
  onSave?: (template: HtmlTemplateData) => Promise<boolean>;
  onCancel?: () => void;
}

export interface VariableInsertionResult {
  updatedContent: string;
  cursorPosition: number;
}
