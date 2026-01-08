import { PageComponent } from 'rasengan';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Markdown } from '@rasenganjs/mdx';
import { Button } from '@/components/common/ui/button';
import { Bold, Braces, CloudUpload, CodeXml, Heading1, Heading2, Heading3, Italic, Link2, Quote, Redo2, SunMoon, Undo2 } from 'lucide-react';
import { useTheme } from '@rasenganjs/theme';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type BlockType = 'paragraph' | 'heading' | 'code' | 'quote' | 'list' | 'image';
type ViewMode = 'edit' | 'preview' | 'split';

interface Block {
  id: string;
  type: BlockType;
  level?: number;
  startOffset: number;
  endOffset: number;
  content: string;
}

interface SelectionState {
  start: number;
  end: number;
}

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  handler: (content: string, selection: SelectionState) => {
    content: string;
    selection: SelectionState;
  };
}

// ============================================================================
// MARKDOWN PARSING UTILITIES
// ============================================================================

const parseBlocks = (content: string): Block[] => {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let offset = 0;

  lines.forEach((line, idx) => {
    const lineLength = line.length + 1;
    const trimmed = line.trim();
    
    let block: Block = {
      id: `block-${idx}`,
      type: 'paragraph',
      startOffset: offset,
      endOffset: offset + lineLength - 1,
      content: line
    };

    const headingMatch = trimmed.match(/^(#{1,6})\s/);
    if (headingMatch) {
      block.type = 'heading';
      block.level = headingMatch[1].length;
    } else if (trimmed.startsWith('```')) {
      block.type = 'code';
    } else if (trimmed.startsWith('>')) {
      block.type = 'quote';
    } else if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/)) {
      block.type = 'list';
    } else if (trimmed.match(/^!\[.*\]\(.*\)/)) {
      block.type = 'image';
    }

    blocks.push(block);
    offset += lineLength;
  });

  return blocks;
};

const getCurrentBlock = (blocks: Block[], cursorPos: number): Block | null => {
  return blocks.find(b => cursorPos >= b.startOffset && cursorPos <= b.endOffset) || null;
};

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

const wrapSelection = (
  content: string,
  selection: SelectionState,
  before: string,
  after: string = before
): { content: string; selection: SelectionState } => {
  const { start, end } = selection;
  const selectedText = content.slice(start, end);
  
  const newContent = 
    content.slice(0, start) + 
    before + selectedText + after + 
    content.slice(end);
  
  return {
    content: newContent,
    selection: {
      start: start + before.length,
      end: end + before.length
    }
  };
};

const replaceLinePrefix = (
  content: string,
  selection: SelectionState,
  prefix: string
): { content: string; selection: SelectionState } => {
  const lines = content.split('\n');
  let currentPos = 0;
  let targetLineIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1;
    if (selection.start < currentPos + lineLength) {
      targetLineIdx = i;
      break;
    }
    currentPos += lineLength;
  }

  lines[targetLineIdx] = lines[targetLineIdx].replace(/^#{1,6}\s|^>\s|^[-*+]\s|^\d+\.\s/, '');
  
  if (prefix) {
    lines[targetLineIdx] = prefix + ' ' + lines[targetLineIdx];
  }

  const newContent = lines.join('\n');
  return {
    content: newContent,
    selection: { ...selection }
  };
};

// ============================================================================
// TOOLBAR ACTIONS
// ============================================================================

const createToolbarActions = (): ToolbarAction[] => [
  {
    id: 'bold',
    label: 'Bold',
    icon: <Bold />,
    shortcut: '⌘B',
    handler: (content, selection) => wrapSelection(content, selection, '**')
  },
  {
    id: 'italic',
    label: 'Italic',
    icon: <Italic />,
    shortcut: '⌘I',
    handler: (content, selection) => wrapSelection(content, selection, '_')
  },
  {
    id: 'code',
    label: 'Inline Code',
    icon: <CodeXml />,
    handler: (content, selection) => wrapSelection(content, selection, '`')
  },
  {
    id: 'link',
    label: 'Link',
    icon: <Link2 />,
    shortcut: '⌘K',
    handler: (content, selection) => {
      const selectedText = content.slice(selection.start, selection.end) || 'link text';
      const linkMarkdown = `[${selectedText}](url)`;
      const newContent = 
        content.slice(0, selection.start) + 
        linkMarkdown + 
        content.slice(selection.end);
      
      return {
        content: newContent,
        selection: {
          start: selection.start + selectedText.length + 3,
          end: selection.start + selectedText.length + 6
        }
      };
    }
  },
  {
    id: 'h1',
    label: 'Heading 1',
    icon: <Heading1 />,
    handler: (content, selection) => replaceLinePrefix(content, selection, '#')
  },
  {
    id: 'h2',
    label: 'Heading 2',
    icon: <Heading2 />,
    handler: (content, selection) => replaceLinePrefix(content, selection, '##')
  },
  {
    id: 'h3',
    label: 'Heading 3',
    icon: <Heading3 />,
    handler: (content, selection) => replaceLinePrefix(content, selection, '###')
  },
  {
    id: 'quote',
    label: 'Quote',
    icon: <Quote />,
    handler: (content, selection) => replaceLinePrefix(content, selection, '>')
  },
  {
    id: 'code-block',
    label: 'Code Block',
    icon: <Braces />,
    handler: (content, selection) => {
      const before = '```\n';
      const after = '\n```';
      return wrapSelection(content, selection, before, after);
    }
  }
];

// ============================================================================
// HOOKS
// ============================================================================

const useEditor = (initialContent: string = '') => {
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState<SelectionState>({ start: 0, end: 0 });
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const blocks = useMemo(() => parseBlocks(content), [content]);
  const currentBlock = useMemo(() => getCurrentBlock(blocks, selection.start), [blocks, selection]);

  const updateContent = useCallback((newContent: string, newSelection?: SelectionState) => {
    setContent(newContent);
    if (newSelection) setSelection(newSelection);
    
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newContent]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  return {
    content,
    selection,
    blocks,
    currentBlock,
    updateContent,
    setSelection,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};

const useMarkdownShortcuts = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  updateContent: (content: string, selection?: SelectionState) => void
) => {
  useEffect(() => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { value, selectionStart, selectionEnd } = textarea;
      const selection = { start: selectionStart || 0, end: selectionEnd || 0 };

      if (e.key === ' ') {
        const lines = value.split('\n');
        let currentPos = 0;
        let currentLine = '';
        
        for (const line of lines) {
          if (selectionStart <= currentPos + line.length) {
            currentLine = line;
            break;
          }
          currentPos += line.length + 1;
        }

        const shortcuts: Record<string, string> = {
          '#': '# ',
          '##': '## ',
          '###': '### ',
          '-': '- ',
          '>': '> ',
          '```': '```\n'
        };

        for (const [trigger, replacement] of Object.entries(shortcuts)) {
          if (currentLine.trimStart() === trigger) {
            e.preventDefault();
            const result = replaceLinePrefix(value, selection, replacement.trim());
            updateContent(result.content, result.selection);
            return;
          }
        }
      }

      const pairs: Record<string, string> = {
        '**': '**',
        '_': '_',
        '`': '`',
        '[': ']',
        '(': ')',
        '{': '}',
        '"': '"',
        "'": "'"
      };

      if (pairs[e.key] && selectionStart === selectionEnd) {
        e.preventDefault();
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionStart);
        const newContent = before + e.key + pairs[e.key] + after;
        updateContent(newContent, {
          start: selectionStart + e.key.length,
          end: selectionStart + e.key.length
        });
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionEnd);
        const newContent = before + '  ' + after;
        updateContent(newContent, {
          start: selectionStart + 2,
          end: selectionStart + 2
        });
      }
    };

    textarea.addEventListener('keydown', handleKeyDown);
    return () => textarea.removeEventListener('keydown', handleKeyDown);
  }, [textareaRef, updateContent]);
};

// ============================================================================
// COMPONENTS
// ============================================================================

const EditorToolbar: React.FC<{
  actions: ToolbarAction[];
  onAction: (action: ToolbarAction) => void;
  currentBlock: Block | null;
}> = ({ actions, onAction, currentBlock }) => {
  return (
    <div className="flex items-center gap-2 h-[50px] px-2 py-3 bg-background border-b border-border">
      <div className="flex items-center gap-1">
        {/* <span className="text-xs text-foreground font-medium mr-2">Format:</span> */}
        {actions.slice(0, 4).map(action => (
          <Button
            key={action.id}
            onClick={() => onAction(action)}
						size={"icon"}
						variant="outline"
						className="text-foreground/70"
            title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
          >
            {action.icon}
          </Button>
        ))}
      </div>
      <div className="w-px h-6 bg-border" />
      <div className="flex items-center gap-1">
        {/* <span className="text-xs text-foreground font-medium mr-2">Block:</span> */}
        {actions.slice(4).map(action => (
          <Button
            key={action.id}
            onClick={() => onAction(action)}
            size={"icon"}
            variant="outline"
            className="text-foreground/70"
            title={action.label}
          >
            {action.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};

const EditorCore: React.FC<{
  content: string;
  onChange: (content: string) => void;
  onSelectionChange: (selection: SelectionState) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
}> = ({ content, onChange, onSelectionChange, textareaRef, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = () => {
    if (textareaRef.current) {
      onSelectionChange({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 border-r border-border">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onSelect={handleSelect}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        placeholder={placeholder || "Start writing your markdown..."}
        spellCheck={false}
        className="flex-1 p-8 bg-muted text-foreground border-0 font-mono text-[15px] leading-relaxed resize-none outline-none placeholder:text-zinc-600"
      />
    </div>
  );
};

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-muted/30">
      <div className="p-8 max-w-3xl mx-auto">
        {content ? <Markdown content={content} className='' /> : (
          <p className="text-muted-foreground text-center mt-24 italic">Preview will appear here...</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EDITOR COMPONENT
// ============================================================================

const MarkdownEditor: React.FC = () => {
	const { isDark, setTheme } = useTheme();
	
  const [mode, setMode] = useState<ViewMode>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolbarActions = useMemo(() => createToolbarActions(), []);
  
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
  } = useEditor(`# Welcome to the Editor

Start writing your **markdown** content here.

## Features

- Live preview
- Keyboard shortcuts
- Block-based editing
- Extensible architecture

\`\`\`javascript
const editor = new MarkdownEditor();
\`\`\`

> This is a quote block

Happy writing! ✨`);

  useMarkdownShortcuts(textareaRef, updateContent);

  const handleToolbarAction = useCallback((action: ToolbarAction) => {
    const result = action.handler(content, selection);
    updateContent(result.content, result.selection);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(result.selection.start, result.selection.end);
      }
    }, 0);
  }, [content, selection, updateContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className={`flex flex-col h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}>
      <div className="flex justify-between items-center h-[50px] px-2 py-4 bg-background border-b border-b-border">
        <div className="text-lg font-semibold text-foreground flex items-center gap-4">
					<span>Nindo</span>

					{/* <div className="flex items-center gap-2">
						<CloudUpload size={18} />
						<span className="text-xs text-muted-foreground">saving...</span>
					</div> */}
				</div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setMode('edit')}
            className={`px-4 py-1.5 border rounded-md transition-all text-sm ${
              mode === 'edit'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent hover:border-accent'
            }`}
          >
            Edit
          </Button>
          <Button
            onClick={() => setMode('split')}
            className={`px-4 py-1.5 border rounded-md transition-all text-sm ${
              mode === 'split'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent hover:border-accent'
            }`}
          >
            Split
          </Button>
          <Button
						variant={"outline"}
            onClick={() => setMode('preview')}
            className={`px-4 py-1.5 rounded-md border transition-all text-sm ${
              mode === 'preview'
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent hover:border-accent'
            }`}
          >
            Preview
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            onClick={undo}
            disabled={!canUndo}
						size={"icon"} 
						variant={"ghost"} 
						className="text-foreground/70"
            title="Undo (⌘Z)"
          >
            <Undo2 />
          </Button>
          <Button
            onClick={redo}
            disabled={!canRedo}
						size={"icon"} 
						variant={"ghost"} 
						className="text-foreground/70"
            title="Redo (⌘⇧Z)"
          >
            <Redo2 />
          </Button>
          {/* <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 hover:border-zinc-600 transition-all text-base"
            title="Fullscreen"
          >
            {isFullscreen ? '⊗' : '⊕'}
          </Button> */}
          <Button size={"icon"} variant={"ghost"} className="text-foreground/70" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {!isDark ? (
                <SunMoon className="rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 opacity-100 dark:opacity-0" />
            ) : (
                <SunMoon className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 opacity-0 dark:opacity-100" />
            )}
        </Button>
        </div>
      </div>

      <EditorToolbar
        actions={toolbarActions}
        onAction={handleToolbarAction}
        currentBlock={currentBlock}
      />

      <div className="flex flex-1 overflow-hidden">
        {(mode === 'edit' || mode === 'split') && (
          <EditorCore
            content={content}
            onChange={updateContent}
            onSelectionChange={setSelection}
            textareaRef={textareaRef}
          />
        )}
        {(mode === 'preview' || mode === 'split') && (
          <MarkdownPreview content={content} />
        )}
      </div>

      <div className="flex justify-end gap-6 px-6 py-2 bg-background border-t border-border text-xs text-zinc-500">
        <span className="flex items-center">
          {currentBlock ? `${currentBlock.type}${currentBlock.level ? ` (H${currentBlock.level})` : ''}` : 'paragraph'}
        </span>
        <span className="flex items-center">
          {content.split('\n').length} lines · {content.length} chars
        </span>
      </div>
    </div>
  );
};

const Page: PageComponent = () => {
	return (
        <section className="bg-background w-full h-full">
            <MarkdownEditor />
        </section>
	)
}

Page.metadata = {
	title: "Blog",
	description: "Blog page"
}

export default Page;