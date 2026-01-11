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

export default Layout;
