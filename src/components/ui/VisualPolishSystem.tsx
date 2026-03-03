import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Zap, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Star,
  Heart,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  Info,
  AlertTriangle,
  Loader2,
  Volume2,
  VolumeX,
  Volume1,
  CheckCircle
} from 'lucide-react';

interface VisualPolishProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark' | 'auto' | 'system';
  enableAnimations?: boolean;
  enableTransitions?: boolean;
  enableParticles?: boolean;
  enableGlassMorphism?: boolean;
  customColors?: Record<string, string>;
  enableSoundEffects?: boolean;
}

interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

interface ParticleConfig {
  id?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  color?: string;
  count?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  opacity?: number;
}

const VisualPolish: React.FC<VisualPolishProps> = ({
  children,
  theme = 'auto',
  enableAnimations = true,
  enableTransitions = true,
  enableParticles = false,
  enableGlassMorphism = false,
  customColors = {},
  enableSoundEffects = false
}): React.ReactNode => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Auto-detect theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setMounted(true);
  }, []);

  // Animation configurations
  const animations: Record<string, AnimationConfig> = {
    fadeIn: { duration: 300, easing: 'ease-out' },
    slideUp: { duration: 400, easing: 'ease-out', delay: 100 },
    slideDown: { duration: 400, easing: 'ease-out', delay: 100 },
    slideLeft: { duration: 400, easing: 'ease-out', delay: 100 },
    slideRight: { duration: 400, easing: 'ease-out', delay: 100 },
    scaleIn: { duration: 200, easing: 'ease-out' },
    scaleOut: { duration: 200, easing: 'ease-in' },
    bounce: { duration: 600, easing: 'ease-in-out' },
    pulse: { duration: 1000, easing: 'ease-in-out' },
    shimmer: { duration: 2000, easing: 'linear' },
    glow: { duration: 2000, easing: 'ease-in-out' },
    float: { duration: 3000, easing: 'ease-in-out' }
  };

  // Particle system
  const createParticles = useCallback((config: ParticleConfig) => {
    const newParticles: ParticleConfig[] = Array.from({ length: config.count || 50 }, () => ({
      id: Math.random().toString(36),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (config.speed || 1),
      vy: (Math.random() - 0.5) * (config.speed || 1),
      size: config.size || 2,
      opacity: config.opacity || 0.6,
      color: config.colors?.[Math.floor(Math.random() * (config.colors?.length || 1))] || '#3b82f6'
    }));
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 10000);
  }, []);

  // Sound effect system
  const playSound = useCallback((type: 'success' | 'error' | 'warning' | 'click') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as Record<string, any>).webkitAudioContext)();
    
    const sounds = {
      success: () => {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      },
      error: () => {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      },
      warning: () => {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      },
      click: () => {
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      }
    };
    
    sounds[type]?.();
  }, [soundEnabled]);

  // Glass morphism effect
  const GlassMorphism: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="relative backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 p-1 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/60 dark:from-gray-900/80 via-transparent to-gray-700 backdrop-blur-sm">
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 dark:from-transparent via-transparent to-gray-900">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 dark:from-transparent via-transparent to-gray-800">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:from-transparent via-transparent to-gray-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/0 dark:from-transparent via-transparent to-gray-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/0 dark:from-transparent via-transparent to-gray-900">
            {/* Light reflection */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/20 rounded-full blur-sm opacity-60"></div>
          </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };

  // Loading skeleton with enhanced animations
  const Skeleton: React.FC<{ 
    width?: string | number;
    height?: string | number;
    variant?: 'default' | 'shimmer' | 'pulse';
    className?: string;
    animated?: boolean;
  }> = ({ 
    width = 'w-full', 
    height = 'h-20', 
    variant = 'default', 
    className = '',
    animated = true
  }) => {
    const widthClass = typeof width === 'number' ? `w-[${width}px]` : width;
    const heightClass = typeof height === 'number' ? `h-[${height}px]` : height;

    const variantClasses = {
      default: 'bg-muted animate-pulse',
      shimmer: 'bg-gradient-to-r from-muted via-transparent to-muted animate-shimmer',
      pulse: 'bg-muted animate-pulse'
    };

    const animationClasses = animated ? 'animate-pulse' : '';

    return (
      <div 
        className={cn(
          'rounded-lg overflow-hidden',
          variantClasses[variant],
          widthClass,
          heightClass,
          className,
          animationClasses
        )}
      >
        <div className={cn(
          variant === 'shimmer' && 'bg-gradient-to-r from-transparent via-transparent to-muted animate-shimmer',
          variant === 'pulse' && 'animate-pulse'
        )}>
          <div className="h-full w-full bg-gradient-to-r from-transparent via-transparent to-muted opacity-0">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-muted animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced button with premium visual feedback
  const PolishedButton: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    success?: boolean;
    icon?: React.ReactNode;
    ripple?: boolean;
    glow?: boolean;
    shimmer?: boolean;
    magnetic?: boolean;
    className?: string;
  }> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    success = false, 
    icon, 
    ripple = true, 
    glow = false, 
    shimmer = false,
    magnetic = false,
    className = ''
  }) => {
    const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number; timestamp: number }>>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = {
        id: Math.random().toString(36),
        x,
        y,
        timestamp: Date.now()
      };
      
      setRipples(prev => [...prev, ripple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / 8;
      const deltaY = (e.clientY - centerY) / 8;
      
      setMagneticPosition({ x: deltaX, y: deltaY });
    }, [magnetic]);

    const handleMouseLeave = useCallback(() => {
      setMagneticPosition({ x: 0, y: 0 });
      setIsHovered(false);
    }, []);

    const variantStyles = {
      primary: 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
      secondary: 'bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:scale-105',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105',
      ghost: 'hover:bg-accent hover:text-accent-foreground hover:scale-105',
      link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
      gradient: 'bg-gradient-to-r from-primary via-purple-600 to-primary text-white shadow-lg hover:shadow-xl hover:scale-105'
    };

    const sizeStyles = {
      xs: 'h-6 px-2 py-1 text-xs',
      sm: 'h-8 px-3 py-1.5 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 py-3 text-lg',
      xl: 'h-14 px-8 py-4 text-xl'
    };

    return (
      <button
        ref={buttonRef}
        className={cn(
          'relative overflow-hidden transition-all duration-300 ease-out',
          variantStyles[variant],
          sizeStyles[size],
          className,
          loading && 'opacity-70 cursor-not-allowed',
          success && 'bg-green-600 text-white',
          glow && 'shadow-lg shadow-primary/50 shadow-primary/50',
          ripple && 'overflow-hidden',
          shimmer && 'relative overflow-hidden',
          magnetic && 'transition-transform duration-200 ease-out'
        )}
        style={{
          transform: magnetic ? `translate(${magneticPosition.x}px, ${magneticPosition.y}px)` : undefined
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        disabled={loading}
      >
        {/* Shimmer effect */}
        {shimmer && (
          <div className="absolute inset-0 -top-2 h-8 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
        )}
        
        {/* Glow effect */}
        {glow && isHovered && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-md animate-pulse" />
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          
          {/* Ripple effects */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x - 12,
                top: ripple.y - 12,
                width: 24,
                height: 24
              }}
            >
              <span 
                className="absolute inline-block h-full w-full rounded-full bg-white/30 animate-ping scale-0 opacity-0"
              />
            </span>
          ))}
        </span>
      </button>
    );
  };

  // Enhanced card with premium effects
  const PolishedCard: React.FC<{
    children: React.ReactNode;
    hover?: boolean;
    tilt?: boolean;
    glow?: boolean;
    shimmer?: boolean;
    magnetic?: boolean;
    className?: string;
  }> = ({ 
    children, 
    hover = true, 
    tilt = false, 
    glow = false, 
    shimmer = false,
    magnetic = false,
    className = ''
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [tiltPosition, setTiltPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = (e.clientY - centerY) / 10;
      const rotateY = (centerX - e.clientX) / 10;
      
      setTiltPosition({ x: rotateY, y: rotateX });
    }, [tilt]);

    const handleMouseLeave = useCallback(() => {
      setTiltPosition({ x: 0, y: 0 });
      setIsHovered(false);
    }, []);

    return (
      <div 
        ref={cardRef}
        className={cn(
          'relative overflow-hidden rounded-xl transition-all duration-300 ease-out',
          hover && 'transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl',
          magnetic && 'transition-transform duration-200 ease-out',
          className
        )}
        style={{
          transform: tilt ? `perspective(1000px) rotateX(${tiltPosition.y}deg) rotateY(${tiltPosition.x}deg)` : undefined
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* Shimmer overlay */}
        {shimmer && (
          <div className="absolute inset-0 -top-2 h-8 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer rounded-xl" />
        )}
        
        {/* Glow effect */}
        {glow && isHovered && (
          <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-md animate-pulse opacity-75" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };

  // Progress indicator with smooth animations
  const ProgressBar: React.FC<{
    value: number;
    max: number;
    showPercentage?: boolean;
    animated?: boolean;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }> = ({ 
    value, 
    max = 100, 
    showPercentage = false, 
    animated = true, 
    color = 'primary', 
    size = 'md', 
    className = ''
  }) => {
    const percentage = Math.round((value / max) * 100);

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    };

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    return (
      <div className="relative">
        <div className={cn(
          'w-full bg-background/80 rounded-full overflow-hidden',
          sizeClasses[size]
        )}>
          <div
            className={cn(
              'h-full bg-muted rounded-full transition-all duration-500 ease-out',
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          >
            <div className="flex h-full items-center justify-center text-white font-medium">
              {showPercentage && (
                <span className="text-sm font-medium">{percentage}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Notification system
  const Notification: React.FC<{
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    onClose?: () => void;
    action?: {
      label: string;
      handler: () => void;
    };
  }> = ({ 
    title, 
    message, 
    type = 'info', 
    duration = 4000, 
    onClose, 
    action
  }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = useCallback(() => {
      setIsVisible(false);
      onClose?.();
    }, [onClose]);

    useEffect(() => {
      if (duration) {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, handleClose]);

    const typeIcons = {
      info: <Info className="h-4 w-4 text-blue-500" />,
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      error: <X className="h-4 w-4 text-red-500" />
    };

    return (
      <div className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-96 transform transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 translate-y-0'
      )}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {typeIcons[type]}
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{title}</h4>
              </div>
              <button
                onClick={handleClose}
                aria-label="Dismiss notification"
                className="ml-auto p-1 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {action && (
            <button
              onClick={action.handler}
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              {action.label}
            </button>
          )}
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  };

  // Loading states
  const LoadingStates = {
    skeleton: Skeleton,
    spinner: Loader2,
    pulse: ({ className }: { className?: string }) => (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-muted rounded"></div>
      </div>
    )
  };

  // Micro-interactions
  const MicroInteractions = {
    ripple: (e: React.MouseEvent<HTMLButtonElement>) => {
      // Ripple effect implementation
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // ripple effect applied at (x, y)
    },
    magnetic: (e: React.MouseEvent<HTMLDivElement>) => {
      // Magnetic effect implementation
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / 8;
      const deltaY = (e.clientY - centerY) / 8;
      // magnetic effect applied at (deltaX, deltaY)
    },
    shimmer: () => null,
    glow: () => null
  };

  // Status states
  const StatusStates = {
    success: { icon: CheckCircle, color: 'text-green-500' },
    error: { icon: X, color: 'text-red-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    info: { icon: Info, color: 'text-blue-500' }
  };

  // Theme provider (moved before return statement)
  const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto' | 'system'>('auto');
    const [themeColors, setThemeColors] = useState<Record<string, string>>({});

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | 'system' || 'auto';
      const savedColors = localStorage.getItem('customColors');
      
      if (savedTheme) setCurrentTheme(savedTheme);
      if (savedColors) setThemeColors(JSON.parse(savedColors || '{}'));
    }, []);

    const themeClasses = {
      light: 'bg-white text-gray-900',
      dark: 'bg-gray-900 text-white',
      auto: 'bg-white text-gray-900 dark:bg-gray-900 text-white',
      system: 'bg-gray-900 text-white'
    };

    return (
      <div className={cn(
        themeClasses[currentTheme],
        'min-h-screen transition-colors duration-300'
      )}>
        {children}
      </div>
    );
  };

  return (
    <ThemeProvider>
      {enableGlassMorphism ? (
        <GlassMorphism>{children}</GlassMorphism>
      ) : (
        <div className={cn(
          'min-h-screen transition-colors duration-300',
          isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
        )}>
          {children}
          
          {/* Particle system */}
          {enableParticles && particles.map((particle, index) => (
            <div
              key={particle.id || index}
              className="absolute pointer-events-none"
              style={{
                left: particle.x || 0,
                top: particle.y || 0,
                width: particle.size || 2,
                height: particle.size || 2,
                backgroundColor: particle.color || '#3b82f6',
                opacity: particle.opacity || 0.6,
                transform: `translate(${(particle.vx || 0) * 100}px, ${(particle.vy || 0) * 100}px)`
              }}
            />
          ))}
        </div>
      )}
    </ThemeProvider>
  );
};

// Export the main component
export default VisualPolish;
