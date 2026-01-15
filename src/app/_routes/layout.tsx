import { Outlet, LayoutComponent } from 'rasengan';
import { useTheme } from '@rasenganjs/theme';
import { cn } from '@/lib/utils';
import { Analytics } from "@vercel/analytics/react"

const Layout: LayoutComponent = () => {
  const { isDark } = useTheme();

  return (
    <section className={cn("w-full h-full min-h-screen font-raleway bg-background", isDark && "dark")}>
      <Outlet />
      <Analytics />
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
