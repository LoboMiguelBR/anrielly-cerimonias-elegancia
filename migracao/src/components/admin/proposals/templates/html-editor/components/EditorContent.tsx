
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from '../CodeEditor';

interface EditorContentProps {
  activeEditor: 'html' | 'css';
  htmlContent: string;
  cssContent: string;
  setActiveEditor: (editor: 'html' | 'css') => void;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onCursorPositionChange: (position: number) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  activeEditor,
  htmlContent,
  cssContent,
  setActiveEditor,
  onHtmlChange,
  onCssChange,
  onCursorPositionChange
}) => {
  return (
    <Tabs 
      defaultValue="html" 
      value={activeEditor}
      onValueChange={(value) => setActiveEditor(value as 'html' | 'css')}
      className="w-full"
    >
      <TabsList className="mb-2">
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="css">CSS</TabsTrigger>
      </TabsList>
      
      <TabsContent value="html" className="border rounded-lg p-0 min-h-[500px] shadow-sm">
        <CodeEditor
          language="html"
          value={htmlContent}
          onChange={onHtmlChange}
          onCursorPositionChange={onCursorPositionChange}
        />
      </TabsContent>
      
      <TabsContent value="css" className="border rounded-lg p-0 min-h-[500px] shadow-sm">
        <CodeEditor
          language="css"
          value={cssContent}
          onChange={onCssChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EditorContent;
