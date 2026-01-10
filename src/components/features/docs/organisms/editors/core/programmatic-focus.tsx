'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown';
import { Button } from '@/components/common/ui/button';
import { useRef, useState } from 'react';
 
export default function FocusableEditorCore() {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const focusEditor = () => {
    textareaRef.current?.focus();
    
    // Optionally, move cursor to end
    const length = content.length;
    textareaRef.current?.setSelectionRange(length, length);
  };
 
  return (
    <div className="h-auto flex flex-col gap-4 p-4">
      <Button onClick={focusEditor}>
        Focus Editor
      </Button>
      
      <Editor.Core
        content={content}
        onChange={setContent}
        onSelectionChange={() => {}}
        textareaRef={textareaRef}
      />
    </div>
  );
}