import { useEditor, useMarkdownShortcuts, createToolbarActions, EditorCore, EditorToolbar, ToolbarAction } from "@/registry/nindo/editors/markdown/markdown";
import { Markdown } from "@rasenganjs/mdx";
import { useCallback, useRef } from "react";

export default function Page() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    } = useEditor("# Hello World");
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

    return (
        <section >
            <EditorToolbar
                actions={toolbarActions}
                onAction={handleToolbarAction}
                currentBlock={currentBlock}
            />
            <div className="p-4 flex gap-4">
                <EditorCore 
                    content={content}
                    onChange={updateContent}
                    onSelectionChange={setSelection}
                    textareaRef={textareaRef}
                    className="w-[600px] h-[500px] border border-border"
                />

                <MarkdownPreview content={content} />
            </div>
        </section>
    )
}

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