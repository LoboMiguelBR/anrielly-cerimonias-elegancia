
import React, { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript';
  onCursorPositionChange?: (position: number) => void;
}

// A simple text-based code editor with minimal syntax highlighting
// In a real implementation, we might use a library like CodeMirror, Monaco Editor, or Ace
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language, onCursorPositionChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  
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
  
  const handleCursorChange = () => {
    if (editorRef.current) {
      const position = editorRef.current.selectionStart;
      setCursorPosition(position);
      if (onCursorPositionChange) {
        onCursorPositionChange(position);
      }
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
        onKeyUp={handleCursorChange}
        onClick={handleCursorChange}
        onSelect={handleCursorChange}
        className="w-full h-full min-h-[500px] p-4 font-mono text-sm border-0 focus:ring-0 focus:outline-none resize-none"
        placeholder={`Digite seu código ${language.toUpperCase()} aqui...`}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
