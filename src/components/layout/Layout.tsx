import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import BasicsTutorial from '@/components/tutorial/BasicsTutorial';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Show tutorial on first visit only on home page
    const tutorialCompleted = localStorage.getItem('tutorial-completed');
    if (!tutorialCompleted && isHomePage) {
      // Small delay to let the page load
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />

      {/* Tutorial - only show on home page */}
      {isHomePage && (
        <>
          <BasicsTutorial 
            isOpen={showTutorial} 
            onClose={() => setShowTutorial(false)} 
          />

          {/* Help button to reopen tutorial */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:bg-primary/10 bg-background/80 backdrop-blur-sm"
                  onClick={() => setShowTutorial(true)}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>View Tutorial</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

export default Layout;
