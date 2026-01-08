import { Button } from '@/components/common/ui/button';
import { MarkdownEditor } from '@/registry/nindo/editors/markdown';
import { Copy, ArrowRight } from 'lucide-react';
import { PageComponent } from 'rasengan';

const Page: PageComponent = () => {
  return (
    <section className='w-full h-full flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center'>
        <h1 className='max-w-[900px] text-5xl md:text-[60px] md:leading-[65px] text-pretty font-bold text-center text-foreground/60'>The flexible <span className='text-foreground'>Markdown Editor</span> for modern platforms</h1>
        <p className='text-lg text-foreground/70 max-w-[700px] text-center mt-6 text-pretty'>Nindo is a highly extensible Markdown editor built for React, offering block awareness, live preview, and total control over your content.</p>

        {/* <div className='max-w-[900px] w-auto h-[40px] border border-border bg-muted rounded-full px-4 flex gap-4 items-center mt-6 text-sm'>
          <span className='cursor-default text-foreground/70 hover:text-red-500'>$</span>

          <p className='text-foreground/70'>npx shadcn@latest add https://nindo.rasengan.dev/editors/markdown.json</p>

          <div>
            <Button 
              size="icon"
              variant={"ghost"}
              className='text-foreground/70 hover:text-foreground'
            >
              <Copy />
            </Button>
          </div>
        </div> */}

        <div className="mt-8">
          <Button className="px-4 bg-primary text-primary-foreground hover:bg-primary/90">
            <span className="font-medium text-base text-sm">Get Started</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="ml-4 text-foreground">
            <span className="font-medium text-base text-sm">View Demo</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className='mt-20 w-full'>
        <div className='w-full h-[calc(100vh-200px)]'>
          <MarkdownEditor />
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
