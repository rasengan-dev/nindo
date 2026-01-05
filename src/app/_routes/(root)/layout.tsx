import Footer from '@/components/features/landing/layouts/footer';
import Navbar from '@/components/features/landing/layouts/navbar';
import { Outlet, LayoutComponent } from 'rasengan';

const Layout: LayoutComponent = () => {
  return (
    <section className="w-full h-full bg-background">
      <Navbar />

      <main className='min-h-[600px] max-w-[1200px] mx-auto py-20 px-4'>
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default Layout;
