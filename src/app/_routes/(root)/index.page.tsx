import { Button } from '@/components/common/ui/button';
import { MarkdownEditor } from '@/registry/nindo/editors/markdown';
import { Copy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, PageComponent } from 'rasengan';
import { useState } from 'react';

const markdown = `
# Welcome to the Nindo Editor

Start writing your **markdown** content here.

## Features

- Live preview
- Keyboard shortcuts
- Block-based editing
- Extensible architecture

## Installation

\`\`\`bash
npx shadcn-ui@latest add https://nindo.rasengan.dev/registry/markdown-editor.json
\`\`\`

## Usage

\`\`\`jsx
import { MarkdownEditor } from "@/components/ui/markdown-editor";

export default function Page() {
	return <MarkdownEditor />
}
\`\`\`

> This is a quote block

Happy writing! ✨
`

const Page: PageComponent = () => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <section className='w-full h-full flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center w-full'>
        <h1 className='max-w-[900px] w-full text-[40px] leading-[45px] md:text-5xl xl:text-[60px] md:leading-[65px] text-pretty font-bold text-center text-foreground/60'>The flexible <span className='text-foreground'>Markdown Editor</span> for modern platforms</h1>
        <p className='text-sm md:text-lg text-foreground/70 w-full max-w-[500px] lg:max-w-[700px] text-center mt-6 text-pretty'>Nindo is a highly extensible Markdown editor built for React, offering block awareness, live preview, and total control over your content.</p>

        <div className='inline-flex max-w-[600px] w-full h-[40px] border border-border bg-muted rounded-full px-4 flex gap-4 items-center mt-6 text-sm'>
          <span className='cursor-default text-foreground/70 hover:text-red-500'>$</span>

          <p className='text-foreground/70 overflow-hidden text-ellipsis whitespace-nowrap'>npx shadcn@latest add https://nindo.rasengan.dev/registry/markdown-editor.json</p>

          <div>
            <Button 
              size="icon"
              variant={"ghost"}
              className='text-foreground/70 hover:text-foreground'
              onClick={() => {
                navigator.clipboard.writeText("npx shadcn@latest add https://nindo.rasengan.dev/registry/markdown-editor.json");
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
             {isCopied ? <CheckCircle2 /> : <Copy />}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/docs">
            <Button className="px-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <span className="font-medium text-base text-sm">Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="https://github.com/rasengan-dev/nindo" target='_blank'>
            <Button variant="outline" className="ml-4 text-foreground">
              <span className="font-medium text-base text-sm">View Source Code</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className='mt-20 w-full'>
        <div className='w-full h-[calc(100vh-200px)]'>
          <MarkdownEditor defaultContent={markdown} className='h-full' />
        </div>
      </div>
    </section>
  );
};

Page.metadata = {
  title: "Nindo | Markdown Editor",
  description: "The flexible Markdown Editor for modern platforms - Nindo is a highly extensible Markdown editor built for React, offering block awareness, live preview, and total control over your content.",
}

export default Page;
