'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown-editor';
import { useState, useRef } from 'react';
 
export default function StandaloneEditorCore() {
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  return (
    <div className="h-auto">
      <Editor.Core
        content={content}
        onChange={setContent}
        onSelectionChange={setSelection}
        textareaRef={textareaRef}
        placeholder="Start writing..."
      />
      
      <div className="p-4 border-t flex items-center gap-4 text-sm">
        <p>Characters: {content.length}</p>
        <p>Cursor at: {selection.start}</p>
      </div>
    </div>
  );
}