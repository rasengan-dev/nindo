import Navbar from '@/components/features/docs/layouts/navbar';
import Footer from '@/components/features/landing/layouts/footer';
import { Outlet, LayoutComponent } from 'rasengan';

const Layout: LayoutComponent = () => {
  return (
    <section className="w-full h-full bg-background text-foreground">
      <main className='h-full min-h-[600px] max-w-[1200px] mx-auto  px-4'>
        <Navbar />

        <div className='py-20'>

          <Outlet />
        </div>
      </main>
      <Footer />
    </section>
  );
};

Layout.metadata = {
  openGraph: {
    title: 'Nindo - Markdown Editor',
    description:
      'Nindo is a modern, extensible Markdown editor built with React and powered by Shadcn UI.',
    url: 'https://rasengan.dev',
    image: 'https://nindo.rasengan.dev/assets/images/nindo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nindo - Markdown Editor',
    description:
      'Nindo is a modern, extensible Markdown editor built with React and powered by Shadcn UI.',
    image: 'https://nindo.rasengan.dev/assets/images/nindo.png',
  },
}

export default Layout;
