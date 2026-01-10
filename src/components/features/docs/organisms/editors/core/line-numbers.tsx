'use client';
 
import { Editor } from '@/registry/nindo/editors/markdown';
import { useState, useRef } from 'react';
 
export default function LineNumbersEditorCore() {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  return (
    <div className="relative flex">
			<Editor.Core
				content={content}
				onChange={setContent}
				onSelectionChange={() => {}}
				textareaRef={textareaRef}
				className="pl-8 h-auto"  // Make room for line numbers
			>
				<div className="absolute left-0 top-0 p-8 text-muted-foreground font-mono text-[15px] leading-relaxed pointer-events-none">
					{content.split('\n').map((_, i) => (
					<div key={i}>{i + 1}</div>
					))}
				</div>
			</Editor.Core>
    </div>
  );
}