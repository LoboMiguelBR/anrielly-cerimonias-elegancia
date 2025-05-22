
import React, { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
}

// A simple text-based code editor with minimal syntax highlighting
// In a real implementation, we might use a library like CodeMirror, Monaco Editor, or Ace
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Sync the editor size
  useEffect(() => {
    const resizeEditor = () => {
      if (editorRef.current) {
        editorRef.current.style.height = 'auto';
        editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
      }
    };
    
    resizeEditor();
    window.addEventListener('resize', resizeEditor);
    
    return () => {
      window.removeEventListener('resize', resizeEditor);
    };
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Update the height
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
    }
  };
  
  return (
    <div className="code-editor-container relative h-full">
      <div className="absolute top-0 right-0 bg-gray-100 text-xs px-2 py-1 rounded-bl">
        {language.toUpperCase()}
      </div>
      <textarea
        ref={editorRef}
        value={value}
        onChange={handleChange}
        className="w-full h-full min-h-[500px] p-4 font-mono text-sm border-0 focus:ring-0 focus:outline-none resize-none"
        placeholder={`Digite seu código ${language.toUpperCase()} aqui...`}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
