import { Button } from '@/components/common/ui/button';
import Navbar from '@/components/features/docs/layouts/navbar';
import Sidebar from '@/components/features/docs/layouts/sidebar';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Outlet, LayoutComponent, ScrollRestoration } from 'rasengan';
import { useRef, useState } from 'react';

const Layout: LayoutComponent = () => {
	const ref = useRef<HTMLDivElement>(null);

	const [open, setOpen] = useState(false);
	
  return (
    <section className="w-full h-screen bg-background overflow-hidden">
			<ScrollRestoration target={ref} alwaysToTop /> 

      <div className='fixed top-0 left-0 right-0 z-30'>
        <Navbar />
    	</div>

			<section className='relative flex h-(--main-height) mt-[50px]'>
				<div className='w-64 h-full overflow-x-hidden overflow-y-auto hidden lg:block'>
					<Sidebar />
				</div>

				<div className={cn('fixed top-[50px] z-50 left-0 z-30 w-64 h-full lg:hidden transition-all duration-300 ease-in-out', open ? "" : "translate-x-[calc(-100%-20px)]")}>
					<div className='relative w-full h-full'>
						<div className='absolute top-0 -right-20 z-30'>
							<Button size="icon" variant="default" onClick={() => setOpen(!open)} className='rounded-full'>
								{ !open ? <PanelLeftOpen /> : <PanelLeftClose />}
							</Button>
						</div>

						<div className='w-full h-full overflow-x-hidden overflow-y-auto'>
							<Sidebar onClose={() => setOpen(false)} />
						</div>
					</div>
				</div>

				<main ref={ref} className='flex-1 h-full overflow-y-auto'>
					<Outlet />
				</main>
			</section>

			{/* background overlay */}
			<div className={cn("fixed top-0 left-0 right-0 bottom-0 z-20 bg-black opacity-50", open ? "" : "hidden")} onClick={() => setOpen(false)}></div>
    </section>
  );
};

export default Layout;
