import { useState, useRef } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface AnimatedBookCoverProps {
  category: string;
  title?: string;
}

const AnimatedBookCover = ({ category, title }: AnimatedBookCoverProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const coverRef = useRef<HTMLDivElement>(null);

  const getCategoryGradient = (cat: string) => {
    const gradients: Record<string, string> = {
      Vedas: 'from-amber-500 via-orange-400 to-yellow-500',
      Puranas: 'from-purple-500 via-indigo-400 to-violet-500',
      Itihasa: 'from-emerald-500 via-teal-400 to-green-500',
      Darshana: 'from-blue-500 via-cyan-400 to-sky-500',
      Smriti: 'from-rose-500 via-pink-400 to-fuchsia-500',
      Shastra: 'from-red-500 via-orange-400 to-amber-500',
      Mantras: 'from-saffron via-gold to-amber-400',
    };
    return gradients[cat] || 'from-primary via-accent to-gold';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!coverRef.current) return;
    
    const rect = coverRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (max 15 degrees)
    const rotateYValue = (mouseX / (rect.width / 2)) * 15;
    const rotateXValue = -(mouseY / (rect.height / 2)) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div 
      className="relative perspective-1000"
      style={{ perspective: '1000px' }}
    >
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-xl blur-2xl transition-all duration-500 ${
          isHovered ? 'opacity-80 scale-110' : 'opacity-40 scale-100'
        }`}
        style={{
          background: `linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--saffron)) 50%, hsl(var(--gold)) 100%)`,
        }}
      />
      
      {/* Book Cover */}
      <div
        ref={coverRef}
        className={`relative w-40 h-56 rounded-xl bg-gradient-to-br ${getCategoryGradient(category)} 
          shadow-2xl cursor-pointer transition-all duration-200 ease-out overflow-hidden`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 40px rgba(255,183,77,0.4)' 
            : '0 20px 40px -15px rgba(0,0,0,0.3)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Spine Effect */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/30 to-transparent"
          style={{ transform: 'translateZ(2px)' }}
        />
        
        {/* Decorative Border */}
        <div className="absolute inset-2 border-2 border-white/20 rounded-lg" />
        
        {/* Inner Decorative Frame */}
        <div className="absolute inset-4 border border-white/10 rounded-md" />
        
        {/* Om Symbol / Decorative Pattern */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Top Decoration */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Sparkles className={`w-4 h-4 text-white/60 transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`} />
          </div>
          
          {/* Center Icon */}
          <div 
            className={`relative transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
            style={{ transform: 'translateZ(20px)' }}
          >
            <BookOpen className="w-14 h-14 text-white drop-shadow-lg" />
            
            {/* Animated Ring */}
            <div 
              className={`absolute inset-0 -m-3 border-2 border-white/30 rounded-full transition-all duration-500 ${
                isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
              }`}
            />
          </div>
          
          {/* Title Preview */}
          {title && (
            <div 
              className="absolute bottom-6 left-4 right-4 text-center"
              style={{ transform: 'translateZ(15px)' }}
            >
              <p className="text-xs font-medium text-white/90 truncate drop-shadow-md">
                {title}
              </p>
            </div>
          )}
        </div>
        
        {/* Shine Effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent 
            transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-30'}`}
          style={{
            transform: `translateX(${rotateY * 2}px) translateY(${-rotateX * 2}px)`,
          }}
        />
        
        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br" />
      </div>
      
      {/* Floating Particles (on hover) */}
      {isHovered && (
        <>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-gold/60 rounded-full animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-saffron/60 rounded-full animate-ping animation-delay-200" />
          <div className="absolute top-1/2 -right-3 w-1 h-1 bg-white/60 rounded-full animate-ping animation-delay-400" />
        </>
      )}
    </div>
  );
};

export default AnimatedBookCover;
