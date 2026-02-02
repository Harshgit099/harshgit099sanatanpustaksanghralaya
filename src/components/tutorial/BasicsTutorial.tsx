import { useState, useEffect } from 'react';
import { X, Sun, Moon, ArrowRight, Check, Bookmark, Heart, ArrowUp, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface BasicsTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const BasicsTutorial = ({ isOpen, onClose }: BasicsTutorialProps) => {
  const [step, setStep] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const [hasToggledTheme, setHasToggledTheme] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
    setHasToggledTheme(true);
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial-completed', 'true');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setHasToggledTheme(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Sanatan Pustak Sanghralaya',
      description: 'Let us show you some basics to enhance your reading experience.',
      content: (
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl om-symbol">ॐ</span>
          <p className="text-muted-foreground text-center">
            Your digital library for sacred scriptures and spiritual texts.
          </p>
        </div>
      ),
    },
    {
      title: 'Dark & Light Mode',
      description: 'Choose your preferred reading theme for comfort.',
      showHeaderPointer: true,
      pointerTarget: 'theme',
      content: (
        <div className="flex flex-col items-center gap-6">
          {/* Header icon indicator */}
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-full">
            <ArrowUp className="h-4 w-4 animate-bounce" />
            <span>Find this icon in the header</span>
            <div className="p-1.5 bg-background rounded-lg border">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme === 'light' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted/50'}`}>
              <Sun className="h-10 w-10 text-gold" />
              <span className="text-sm font-medium">Light Mode</span>
              <p className="text-xs text-muted-foreground text-center">
                Bright & warm for daytime
              </p>
            </div>
            <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted/50'}`}>
              <Moon className="h-10 w-10 text-primary" />
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-muted-foreground text-center">
                Easy on eyes at night
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Try it now:</p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleThemeToggle}
              className="gap-2 hover:bg-primary/10"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5" />
                  Switch to Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  Switch to Light Mode
                </>
              )}
            </Button>
            {hasToggledTheme && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 animate-fade-in">
                <Check className="h-4 w-4" /> Great! Toggle anytime from the header.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Save Your Favourites',
      description: 'Bookmark scriptures to access them quickly later.',
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center">
              <Bookmark className="h-10 w-10 text-saffron" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Heart className="h-3 w-3 text-primary-foreground fill-current" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              While reading any scripture, tap the bookmark icon to save it to your favourites.
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium">Your favourites include:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  📚 Saved Scriptures
                </span>
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  📖 Reading Progress
                </span>
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  📝 Personal Notes
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Access your favourites from the Dashboard after signing in.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Lock Your Screen',
      description: 'Prevent accidental touches while reading.',
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
              <div className="w-14 h-14 rounded-xl bg-background border flex items-center justify-center">
                <Unlock className="h-7 w-7 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Unlocked</span>
              <p className="text-xs text-muted-foreground text-center">
                All controls active
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/10 ring-2 ring-primary">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                <Lock className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Locked</span>
              <p className="text-xs text-muted-foreground text-center">
                Controls disabled
              </p>
            </div>
          </div>
          
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground">
              Tap the lock icon in the PDF reader header to prevent accidental page changes or zoom.
            </p>
            
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium">When locked, these are disabled:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  ⬅️ Page Navigation
                </span>
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  🔍 Zoom Controls
                </span>
                <span className="px-3 py-1 bg-background rounded-full text-xs border">
                  📺 Fullscreen
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Tap the lock icon again to unlock and regain control.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'You\'re All Set!',
      description: 'You know the basics. Enjoy your spiritual journey.',
      content: (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-muted rounded-lg">
                <Sun className="h-5 w-5" />
              </div>
              <span className="text-xs">Theme</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-muted rounded-lg">
                <Bookmark className="h-5 w-5" />
              </div>
              <span className="text-xs">Favourites</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 bg-muted rounded-lg">
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-xs">Lock</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-2">
            Use these features anytime for the best reading experience!
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Scrollable Content */}
        <div className="p-6 pt-8 pb-8 overflow-y-auto flex-1">
          <div className="text-center mb-4">
            <h2 className="text-lg font-display font-bold text-foreground mb-1">
              {currentStep.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center justify-center py-4">
            {currentStep.content}
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex gap-2 justify-center">
              {step > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              {isLastStep ? (
                <Button size="sm" onClick={handleComplete} className="gap-1">
                  <Check className="h-4 w-4" />
                  Finish
                </Button>
              ) : (
                <Button size="sm" onClick={() => setStep(step + 1)} className="gap-1">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === step ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicsTutorial;
