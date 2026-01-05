import { Outlet, LayoutComponent } from 'rasengan';
import { useTheme } from '@rasenganjs/theme';
import { cn } from '@/lib/utils';

const Layout: LayoutComponent = () => {
  const { isDark } = useTheme();

  return (
    <section className={cn("w-full h-full min-h-screen font-raleway bg-background", isDark && "dark")}>
      <Outlet />
    </section>
  );
};

export default Layout;
