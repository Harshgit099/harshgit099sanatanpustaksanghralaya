import { useState, useEffect } from 'react';
import { X, Sun, Moon, ArrowRight, Check } from 'lucide-react';
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
      title: 'Welcome to Sanatan Pustak Sanghralay',
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
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme === 'light' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted/50'}`}>
              <Sun className="h-10 w-10 text-gold" />
              <span className="text-sm font-medium">Light Mode</span>
              <p className="text-xs text-muted-foreground text-center">
                Bright & warm for daytime reading
              </p>
            </div>
            <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted/50'}`}>
              <Moon className="h-10 w-10 text-primary" />
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-muted-foreground text-center">
                Easy on eyes for night reading
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 mt-4">
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
                <Check className="h-4 w-4" /> Great! You can toggle this anytime from the header.
              </p>
            )}
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
          <p className="text-muted-foreground text-center">
            Look for the <Sun className="inline h-4 w-4" /> / <Moon className="inline h-4 w-4" /> icon in the header to toggle theme anytime.
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-8 pt-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {currentStep.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          </div>

          <div className="min-h-[200px] flex items-center justify-center">
            {currentStep.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
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

            <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicsTutorial;
