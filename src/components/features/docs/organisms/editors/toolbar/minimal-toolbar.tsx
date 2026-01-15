'use client';
 
import { Editor, createToolbarActions, useEditor } from '@/registry/nindo/editors/markdown-editor';
import { useRef } from 'react';
 
export default function MinimalToolbar() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actions = createToolbarActions();
  
  const {
    content,
    selection,
    currentBlock,
		setSelection,
    updateContent,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditor('# Hello');
 
  const handleAction = (action: any) => {
    const result = action.handler(content, selection);
    updateContent(result.content, result.selection);
  }
 
  return (
    <div className="h-[400px] flex flex-col">
      <Editor.Toolbar
        actions={actions}
        onAction={handleAction}
        currentBlock={currentBlock}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <Editor.Core
        content={content}
        onChange={updateContent}
        onSelectionChange={setSelection}
        textareaRef={textareaRef}
      />
    </div>
  );
}