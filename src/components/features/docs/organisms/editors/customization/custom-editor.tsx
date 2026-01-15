'use client';
 
import React, { useState, useRef, useCallback } from 'react';
import { 
  Editor, 
  useEditor, 
  useEditorShortcuts,
  createToolbarActions,
  type ToolbarAction,
  type Block
} from '@/registry/nindo/editors/markdown-editor';
import { Button } from '@/components/common/ui/button';
import { Card } from '@/components/common/ui/card';
// import { Separator } from '@/components/ui/separator';
import { 
  Undo2,
  Redo2,
  Eye,
  Edit2,
  Columns
} from 'lucide-react';
 
// Toolbar Component
interface CustomToolbarProps {
  actions: ToolbarAction[];
  onAction: (action: ToolbarAction) => void;
  currentBlock: Block | null;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  viewMode: 'edit' | 'preview' | 'split';
  onViewModeChange: (mode: 'edit' | 'preview' | 'split') => void;
}
 
const CustomToolbar: React.FC<CustomToolbarProps> = ({
  actions,
  onAction,
  currentBlock,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  viewMode,
  onViewModeChange
}) => {
  const isActionActive = (actionId: string): boolean => {
    if (!currentBlock) return false;
    
    if (actionId.startsWith('h') && currentBlock.type === 'heading') {
      const level = parseInt(actionId.replace('h', ''));
      return currentBlock.level === level;
    }
    
    if (actionId === 'quote' && currentBlock.type === 'quote') return true;
    if (actionId === 'code-block' && currentBlock.type === 'code') return true;
    
    return false;
  };
 
  return (
    <div className="flex items-center justify-between border-b bg-background p-2 gap-2">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          {actions.slice(0, 4).map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant={isActionActive(action.id) ? 'default' : 'ghost'}
              onClick={() => onAction(action)}
              disabled={viewMode === 'preview'}
              title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
              className="h-8 w-8 p-0"
            >
              {action.icon}
            </Button>
          ))}
        </div>
 
        {/* <Separator orientation="vertical" className="h-6" /> */}
 
        <div className="flex items-center gap-1">
          {actions.slice(4).map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant={isActionActive(action.id) ? 'default' : 'ghost'}
              onClick={() => onAction(action)}
              disabled={viewMode === 'preview'}
              title={action.label}
              className="h-8 w-8 p-0"
            >
              {action.icon}
            </Button>
          ))}
        </div>
      </div>
 
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={viewMode === 'edit' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('edit')}
            title="Edit Mode"
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'split' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('split')}
            title="Split Mode"
            className="h-8 w-8 p-0"
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'preview' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('preview')}
            title="Preview Mode"
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
 
        {/* <Separator orientation="vertical" className="h-6" /> */}
 
        <Button
          size="sm"
          variant="ghost"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="h-8 w-8 p-0"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          className="h-8 w-8 p-0"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
 
// Status Bar Component
interface StatusBarProps {
  currentBlock: Block | null;
  content: string;
}
 
const StatusBar: React.FC<StatusBarProps> = ({ currentBlock, content }) => {
  const lines = content.split('\n').length;
  const words = content.split(/\s+/).filter(Boolean).length;
  const characters = content.length;
 
  const blockType = currentBlock 
    ? `${currentBlock.type}${currentBlock.level ? ` (H${currentBlock.level})` : ''}`
    : 'paragraph';
 
  return (
    <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="font-medium capitalize">{blockType}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>{lines} lines</span>
        <span>{words} words</span>
        <span>{characters} characters</span>
      </div>
    </div>
  );
};
 
// Main Editor Component
const CustomMarkdownEditor: React.FC = () => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolbarActions = createToolbarActions();
  
  const {
    content,
    selection,
    blocks,
    currentBlock,
    updateContent,
    setSelection,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditor(`# Welcome to Custom Editor
 
Start writing your **markdown** content here.
 
## Features
 
- Custom toolbar
- Live preview
- Keyboard shortcuts
- Undo/redo support
 
\`\`\`javascript
const greeting = "Hello, Nindo!";
console.log(greeting);
\`\`\`
 
> This is a custom implementation using Nindo's core components.
 
Happy writing! ✨`);
 
  useEditorShortcuts(textareaRef, updateContent);
 
  const handleToolbarAction = useCallback((action: ToolbarAction) => {
    const result = action.handler(content, selection);
    updateContent(result.content, result.selection);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          result.selection.start,
          result.selection.end
        );
      }
    }, 0);
  }, [content, selection, updateContent]);
 
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Custom Markdown Editor</h1>
        <p className="text-sm text-muted-foreground">
          Built with Nindo Core Components
        </p>
      </div>
 
      <CustomToolbar
        actions={toolbarActions}
        onAction={handleToolbarAction}
        currentBlock={currentBlock}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
 
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <Card className="flex-1 m-4 mr-2 shadow-none border overflow-hidden">
              <Editor.Core
                content={content}
                onChange={updateContent}
                onSelectionChange={setSelection}
                textareaRef={textareaRef}
                placeholder="Start writing your markdown..."
              />
            </Card>
          )}
 
          {(viewMode === 'preview' || viewMode === 'split') && (
            <Card className="flex-1 m-4 ml-2 shadow-none border overflow-hidden">
              <Editor.Preview content={content} />
            </Card>
          )}
        </div>
      </div>
 
      <StatusBar currentBlock={currentBlock} content={content} />
    </div>
  );
};
 
export default CustomMarkdownEditor;