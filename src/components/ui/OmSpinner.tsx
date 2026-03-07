import { cn } from '@/lib/utils';

interface OmSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg w-4 h-4',
  md: 'text-3xl w-8 h-8',
  lg: 'text-5xl w-12 h-12',
};

const OmSpinner = ({ className, size = 'md' }: OmSpinnerProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center animate-om-spin text-primary om-symbol select-none',
        sizeClasses[size],
        className
      )}
    >
      ॐ
    </span>
  );
};

export default OmSpinner;
