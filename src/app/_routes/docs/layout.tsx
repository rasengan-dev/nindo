import Navbar from '@/components/features/docs/layouts/navbar';
import Sidebar from '@/components/features/docs/layouts/sidebar';
import { Outlet, LayoutComponent } from 'rasengan';

const Layout: LayoutComponent = () => {
  return (
    <section className="w-full h-screen bg-background overflow-hidden">
      <div className='fixed top-0 left-0 right-0 z-30'>
        <Navbar />
    	</div>

			<section className='relative flex h-(--main-height) mt-[50px]'>
				<div className='w-64 h-full overflow-x-hidden overflow-y-auto'>
					<Sidebar />
				</div>

				<main className='flex-1 overflow-y-auto'>
					<Outlet />
				</main>
			</section>
    </section>
  );
};

export default Layout;
