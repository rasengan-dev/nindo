import React, { useState, useCallback, useRef, useEffect, useMemo, ComponentProps } from 'react';
import { Card } from "@/components/common/ui/card";
import { Button } from '@/components/common/ui/button';
import { Bold, Braces, CheckCircle2, CodeXml, Copy, Edit2, Eye, GalleryHorizontal, GalleryVertical, Heading1, Heading2, Heading3, Italic, Link2, Quote, Redo2, SquareSplitHorizontal, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@rasenganjs/theme';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type BlockType = 'paragraph' | 'heading' | 'code' | 'quote' | 'list' | 'image';
type ViewMode = 'edit' | 'preview' | 'split';
type Orientation = 'horizontal' | 'vertical';

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

const mappingBlockToAction = (block: BlockType, level?: number): ToolbarAction["id"] => {
  switch (block) {
    case "heading": {
      return `h${level ? level : 0}`;
    }
    case 'code': return 'code-block'
    case 'list': return "list";
    case 'quote': return "quote";

    default: return ""
  }
}

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
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  mode?: ViewMode;
  setMode?: (mode: ViewMode) => void;
	orientation?: Orientation,
	setOrientation?: (orientation: Orientation) => void
}> = ({ actions, onAction, currentBlock, undo, redo, canUndo, canRedo, mode, setMode, orientation = "horizontal", setOrientation }) => {
  return (
    <div className="flex items-center justify-between gap-2 h-[50px] px-2 py-3 bg-background border-b border-border">
      <div className='flex items-center gap-2'>
        <div className="flex items-center gap-1">
          {actions.slice(0, 4).map(action => (
            <Button
              key={action.id}
              onClick={() => onAction(action)}
              size={"icon"}
            	variant={mappingBlockToAction(currentBlock?.type || 'paragraph', currentBlock?.level) === action.id ? "default" : "outline"}
              className={"text-foreground/70"}
              title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
              disabled={mode === 'preview'}
            >
              {action.icon}
            </Button>
          ))}
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-1">
          {actions.slice(4).map(action => (
            <Button
              key={action.id}
              onClick={() => onAction(action)}
              size={"icon"}
              variant={mappingBlockToAction(currentBlock?.type || 'paragraph', currentBlock?.level) === action.id ? "default" : "outline"}
              className={mappingBlockToAction(currentBlock?.type || 'paragraph', currentBlock?.level) === action.id ? "text-primary-foreground" : "text-foreground/70"}
              title={action.label}
              disabled={mode === 'preview'}
            >
              {action.icon}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2'>
				<div className='flex items-center gap-1'>
          <Button
            size={"icon"} 
            onClick={() => setOrientation && setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
            variant={"outline"} 
            title="Edit"
            disabled={!setOrientation}
          >
            {
							orientation === "horizontal" ? <GalleryHorizontal /> : <GalleryVertical />
						}
          </Button>
				</div>
				<div className="w-px h-6 bg-border" />
        <div className='flex items-center gap-1'>
          <Button
            size={"icon"} 
            onClick={() => setMode && setMode("edit")}
            variant={mode === "edit" ? "default" : "outline"} 
            title="Edit"
            disabled={!setMode}
          >
            <Edit2 />
          </Button>
          <Button
            size={"icon"} 
            onClick={() => setMode && setMode("split")}
            variant={mode === "split" ? "default" : "outline"} 
            title="Split"
            disabled={!setMode}
          >
            <SquareSplitHorizontal />
          </Button>
          <Button
            size={"icon"} 
            onClick={() => setMode && setMode("preview")}
            variant={mode === "preview" ? "default" : "outline"} 
            title="Preview"
            disabled={!setMode}
          >
            <Eye />
          </Button>
        </div>
        <div className="w-px h-6 bg-border" />
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
  className?: ComponentProps<'div'>['className'];
  children?: React.ReactNode;
}> = ({ content, onChange, onSelectionChange, textareaRef, placeholder, className, children }) => {
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
    <div className={cn("relative flex flex-col flex-1", className)}>
      {children}
      <textarea
        aria-label="Markdown editor"
        aria-describedby="Nindo Markdown Editor"
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onSelect={handleSelect}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        placeholder={placeholder || "Start writing your markdown..."}
        spellCheck={false}
        className="flex-1 p-8 text-foreground border-0 font-mono text-[15px] leading-relaxed resize-none outline-none placeholder:text-foreground/70"
      />
    </div>
  );
};

const MarkdownPreview: React.FC<{ content: string, dark?: boolean }> = ({ content, dark = false }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-muted/30">
      <div className="p-8 max-w-3xl mx-auto">
        {content ? (
          <Markdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              p: ({ children, ...props }) => <p {...props} className="text-sm font-medium leading-relaxed [&:not(:first-child)]:mt-6 text-foreground/80">{children}</p>,
              a: ({ children, ...props }) => <a {...props} className="text-primary font-semibold underline underline-offset-4 cursor-pointer">{children}</a>,
              h1: ({ children, ...props }) => <h1 {...props} className="sm:text-3xl text-4xl font-semibold mt-4 mb-5 text-foreground">{children}</h1>,
              h2: ({ children, ...props }) => <h2 {...props} className="text-xl font-medium mt-8 mb-3 text-foreground">{children}</h2>,
              h3: ({ children, ...props }) => <h3 {...props} className="text-lg font-medium mt-8 mb-3 text-foreground">{children}</h3>,
              h4: ({ children, ...props }) => <h4 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h4>,
              h5: ({ children, ...props }) => <h5 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h5>,
              h6: ({ children, ...props }) => <h6 {...props} className="text-md font-medium mt-8 mb-3 text-foreground">{children}</h6>,
              ol: ({ children, ...props }) => <ol {...props} className="my-6 ml-6 list-decimal">{children}</ol>,
              ul: ({ children, ...props }) => <ul {...props} className="my-6 ml-6 list-decimal list-inside">{children}</ul>,
              li: ({ children, ...props }) => <li {...props} className="mt-2 text-sm font-medium text-foreground/80">{children}</li>,
							blockquote: (props) => <blockquote {...props} className="inline-block pl-2 border-l-4 border-l-border"></blockquote>,
              code(props) {
                const {children, className, node, ...rest} = props
                const match = /language-(\w+)/.exec(className || '')

                const [isCopied, setIsCopied] = useState(false);

                const handleCopy = () => {
                  navigator.clipboard.writeText(String(children));
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }
                
                return match ? (
                  <div className='border border-border rounded-md overflow-hidden my-4'>
                    <div className="flex items-center justify-between px-2 py-2 h-[40px] text-xs font-medium text-foreground/50 border-b border-b-border bg-muted/40">
                      <span>{match[1]}</span>

                      <span>
                        <Button
                          size="icon"
													className='size-6'
                          variant="ghost"
                          onClick={handleCopy}
                        >
                          { isCopied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" /> }
                        </Button>
                      </span>
                    </div>
                    <SyntaxHighlighter
                      {...rest as any}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      showLineNumbers
                      language={match[1]}
                      style={{margin: 0, ...(dark ? oneDark : oneLight)}}
                      customStyle={{ margin: 0, borderRadius: 0, maxHeight: "500px" }}
                      className="text-sm"
                    ></SyntaxHighlighter>
                  </div>
                ) : (
                  <code {...rest} className={cn("bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.9rem] break-words outline-none", className)}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </Markdown>
        ) : (
          <p className="text-muted-foreground text-center mt-0 italic">Preview will appear here...</p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EDITOR COMPONENT
// ============================================================================

const MarkdownEditor = ({
  defaultContent = "",
  onChangeContent,
	className
}: { defaultContent?: string, onChangeContent?: (content: string) => void, className?: ComponentProps<"div">["className"] }) => {
	const { isDark } = useTheme();

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const [mode, setMode] = useState<ViewMode>("split");
	const [orientation, setOrientation] = useState<Orientation>("horizontal");

	const toolbarActions = createToolbarActions();

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
	} = useEditor(defaultContent || "");
	useMarkdownShortcuts(textareaRef, updateContent);

	const handleToolbarAction = useCallback((action: ToolbarAction) => {
		const result = action.handler(content, selection);
		updateContent(result.content, result.selection);

    if (onChangeContent) {
      onChangeContent(result.content);
    }
		
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.focus();
				textareaRef.current.setSelectionRange(result.selection.start, result.selection.end);
			}
		}, 0);
	}, [content, selection, updateContent]);

	return (
		<Card className={cn("flex h-full gap-0 shadow-none p-0 overflow-hidden", className)}>
			<Editor.Toolbar
				actions={toolbarActions}
				onAction={(action) => handleToolbarAction(action)}
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

			<div className={cn("relative w-full h-full min-h-[400px] flex gap-2 p-2", orientation === "horizontal" ? "flex-row": "flex-col")}>
				{
					(mode === "edit" || mode === "split") && (
						<Card className={cn("flex gap-4 shadow-none w-full p-0 overflow-auto", (orientation === "vertical" && mode === "split") ? "h-[50%]": "h-full")}>
							<Editor.Core 
								content={content}
								onChange={updateContent}
								onSelectionChange={setSelection}
								textareaRef={textareaRef}
							/>
						</Card>
					)
				}

				{
					(mode === "preview" || mode === "split") && (
						<Card className={cn("flex gap-4 shadow-none w-full  p-0 overflow-auto", (orientation === "vertical" && mode === "split") ? "h-1/2": "h-full")}>
							<Editor.Preview content={content} dark={isDark} />
						</Card>
					)
				}
			</div>

			<div className="flex justify-end gap-6 px-6 py-2 bg-background border-t border-border text-xs text-foreground/70">
        <span className="flex items-center">
          {currentBlock ? `${currentBlock.type}${currentBlock.level ? ` (H${currentBlock.level})` : ''}` : 'paragraph'}
        </span>
        <span className="flex items-center">
          {content.split('\n').length} lines · {content.length} chars
        </span>
      </div>
		</Card>
	)
}

const Editor = {
  Core: EditorCore,
  Toolbar: EditorToolbar,
  Preview: MarkdownPreview
}

export {
  Editor,
  MarkdownEditor,
  useEditor,
  useMarkdownShortcuts,
  createToolbarActions,
  type ToolbarAction,
  type ViewMode,
  type Orientation
};
