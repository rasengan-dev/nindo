'use client';
 
import { Editor, createToolbarActions, useEditor, ViewMode, Orientation } from '@/registry/nindo/editors/markdown';
import { useRef, useState } from 'react';
 
export default function ToolbarWithOrientation() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actions = createToolbarActions();
  const [mode, setMode] = useState<ViewMode>('split');
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  
  const {
    content,
    selection,
    currentBlock,
    updateContent,
    setSelection,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditor('# Content');
 
  const handleAction = (action: any) => {
    const result = action.handler(content, selection);
    updateContent(result.content, result.selection);
  };
 
  return (
    <div className="h-[500px] flex flex-col">
      <Editor.Toolbar
        actions={actions}
        onAction={handleAction}
        currentBlock={currentBlock}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        mode={mode}
        setMode={setMode}
        orientation={orientation}
        setOrientation={setOrientation}
      />
      
      <div className={`flex-1 flex ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
        {(mode === 'edit' || mode === 'split') && (
          <Editor.Core
            content={content}
            onChange={updateContent}
            onSelectionChange={setSelection}
            textareaRef={textareaRef}
          />
        )}
        {(mode === 'preview' || mode === 'split') && (
          <Editor.Preview content={content} />
        )}
      </div>
    </div>
  );
}