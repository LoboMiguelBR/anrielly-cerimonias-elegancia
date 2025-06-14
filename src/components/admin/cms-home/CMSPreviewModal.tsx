
import React from 'react';
import { X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CMSPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: any;
}

const CMSPreviewModal = ({ isOpen, onClose, section }: CMSPreviewModalProps) => {
  if (!section) return null;

  const processContentVariables = (content: string) => {
    return content
      .replace(/\{\{title\}\}/g, section.title || '')
      .replace(/\{\{subtitle\}\}/g, section.subtitle || '')
      .replace(/\{\{cta_label\}\}/g, section.cta_label || '')
      .replace(/\{\{cta_link\}\}/g, section.cta_link || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview: {section.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Informações da Seção</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Título:</span> {section.title}
              </div>
              <div>
                <span className="font-medium">Status:</span> {section.active ? 'Ativa' : 'Inativa'}
              </div>
              <div>
                <span className="font-medium">Cor de fundo:</span> 
                <span className="ml-2 px-2 py-1 rounded" style={{ backgroundColor: section.bg_color }}>
                  {section.bg_color}
                </span>
              </div>
              <div>
                <span className="font-medium">Ordem:</span> {section.order_index}
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h4 className="font-semibold">Preview da Seção</h4>
            </div>
            <div 
              className="min-h-[200px]"
              style={{ backgroundColor: section.bg_color }}
            >
              {section.content_html ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: processContentVariables(section.content_html)
                  }}
                />
              ) : (
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  {section.subtitle && (
                    <p className="text-lg text-gray-600 mb-6">{section.subtitle}</p>
                  )}
                  {section.cta_label && (
                    <button className="bg-primary text-white px-6 py-3 rounded-lg">
                      {section.cta_label}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {section.content_html && (
            <div className="space-y-2">
              <h4 className="font-semibold">Código HTML</h4>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{section.content_html}</code>
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CMSPreviewModal;
