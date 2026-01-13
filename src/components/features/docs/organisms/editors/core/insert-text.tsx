'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown-editor';
import { Button } from '@/components/common/ui/button';
import { useRef, useState } from 'react';
 
export default function InsertTextEditorCore() {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const insertText = (text: string) => {
    const { start, end } = selection;
    const before = content.slice(0, start);
    const after = content.slice(end);
    
    const newContent = before + text + after;
    setContent(newContent);
    
    // Move cursor after inserted text
    setTimeout(() => {
      const newPosition = start + text.length;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
      textareaRef.current?.focus();
    }, 0);
  };
 
  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={() => insertText('**bold text**')}>
          Insert Bold
        </Button>
        <Button onClick={() => insertText('[link](url)')}>
          Insert Link
        </Button>
        <Button onClick={() => insertText('```\ncode\n```')}>
          Insert Code
        </Button>
      </div>
      
      <Editor.Core
        content={content}
        onChange={setContent}
        onSelectionChange={setSelection}
        textareaRef={textareaRef}
        className='h-[400px]'
      />
    </div>
  );
}