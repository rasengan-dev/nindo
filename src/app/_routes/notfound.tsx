'use client';

import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@rasenganjs/theme';
import { 
  Home, 
  ArrowLeft, 
  BookOpen,
  Github,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'rasengan';

const NindoNotFound = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Documentation',
      description: 'Learn how to use Nindo',
      href: '/docs'
    },
    {
      icon: <Github className="h-5 w-5" />,
      title: 'GitHub',
      description: 'View source code',
      href: 'https://github.com/rasengan-dev/nindo'
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'Support',
      description: 'Get help from community',
      href: 'https://github.com/orgs/rasengan-dev/discussions'
    }
  ];

  return (
    <div className={cn(isDark ? "dark" : "", "min-h-screen bg-gradient-to-br font-raleway from-background via-background to-muted flex items-center justify-center p-4")}>
      <div className="max-w-4xl w-full">
        {/* Main 404 Content */}
        <div className="text-center mb-12">
          {/* 404 Text */}
          <h1 className="text-8xl font-bold text-primary mb-4 tracking-tight">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/docs")}
              className="min-w-[160px]"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="min-w-[160px] text-foreground"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wide">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Card 
                key={index}
                className="group hover:border-primary/50 transition-all duration-300 shadow-none hover:shadow-lg hover:shadow-primary/10"
              >
                <CardContent className="p-6">
                  <Link 
                    to={link.href}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      {link.icon}
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Need help? Contact the author{' '}
           <Link to="https://x.com/dilanekombou" target="_blank" className="font-semibold underline underline-offset-4">dilane3</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NindoNotFound;