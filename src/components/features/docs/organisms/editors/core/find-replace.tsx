'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { useState, useRef } from 'react';
 
export default function FindReplaceEditorCore() {
  const [content, setContent] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const handleReplace = () => {
    const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
    setContent(newContent);
  };
 
  const highlightNext = () => {
    const index = content.indexOf(findText);
    if (index !== -1) {
      textareaRef.current?.setSelectionRange(index, index + findText.length);
      textareaRef.current?.focus();
    }
  };
 
  return (
    <div className="h-auto flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Input
          placeholder="Find..."
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
        />
        <Input
          placeholder="Replace with..."
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <Button onClick={highlightNext}>Find</Button>
        <Button onClick={handleReplace}>Replace All</Button>
      </div>
      
      <Editor.Core
        content={content}
        onChange={setContent}
        onSelectionChange={() => {}}
        textareaRef={textareaRef}
      />
    </div>
  );
}