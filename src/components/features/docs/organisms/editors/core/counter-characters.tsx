'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown-editor';
import { useState, useRef } from 'react';
 
export default function CountedEditorCore() {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const MAX_LENGTH = 5000;
  const remaining = MAX_LENGTH - content.length;
 
  const handleChange = (newContent: string) => {
    if (newContent.length <= MAX_LENGTH) {
      setContent(newContent);
    }
  };
 
  return (
    <div className="h-auto flex flex-col">
      <div className="border-b p-2 text-sm">
        <span className={remaining < 100 ? 'text-red-500' : 'text-muted-foreground'}>
          {remaining} / {MAX_LENGTH}
        </span>
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