'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown-editor';
import { Button } from '@/components/common/ui/button';
import { useState, useRef } from 'react';
 
export default function UndoEditorCore() {
  const [content, setContent] = useState('');
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const handleChange = (newContent: string) => {
    setContent(newContent);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newContent]);
    setHistoryIndex(prev => prev + 1);
  };
 
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  };
 
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  };
 
  return (
    <div className="h-auto flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={undo} disabled={historyIndex === 0}>
          Undo
        </Button>
        <Button onClick={redo} disabled={historyIndex === history.length - 1}>
          Redo
        </Button>
      </div>
      
      <Editor.Core
        content={content}
        onChange={handleChange}
        onSelectionChange={() => {}}
        textareaRef={textareaRef}
      />
    </div>
  );
}