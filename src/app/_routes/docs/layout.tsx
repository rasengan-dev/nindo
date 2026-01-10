import Navbar from '@/components/features/docs/layouts/navbar';
import Sidebar from '@/components/features/docs/layouts/sidebar';
import { Outlet, LayoutComponent, ScrollRestoration } from 'rasengan';
import { useRef } from 'react';

const Layout: LayoutComponent = () => {
	const ref = useRef<HTMLDivElement>(null);
	
  return (
    <section className="w-full h-screen bg-background overflow-hidden">
			<ScrollRestoration target={ref} alwaysToTop /> 

      <div className='fixed top-0 left-0 right-0 z-30'>
        <Navbar />
    	</div>

			<section className='relative flex h-(--main-height) mt-[50px]'>
				<div className='w-64 h-full overflow-x-hidden overflow-y-auto'>
					<Sidebar />
				</div>

				<main ref={ref} className='flex-1 h-full overflow-y-auto'>
					<Outlet />
				</main>
			</section>
    </section>
  );
};

export default Layout;
