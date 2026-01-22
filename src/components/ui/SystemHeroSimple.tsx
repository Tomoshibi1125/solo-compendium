/**
 * System Ascendant Styled Hero Component (Simple Version)
 * For landing and login pages with dramatic manhwa aesthetics
 */

import { useState, useEffect } from 'react';
import { Sparkles, Shield, Swords, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import './SystemHeroSimple.css';

interface SystemHeroProps {
  title?: string;
  subtitle?: string;
  showLogin?: boolean;
  className?: string;
}

export function SystemHeroSimple({ 
  title = "SOLO COMPENDIUM", 
  subtitle = "System Ascendant SRD Companion",
  showLogin = false,
  className 
}: SystemHeroProps) {
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const next = prev + (Math.random() - 0.5) * 0.1;
        return Math.max(0.3, Math.min(1, next));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const titleStyle = {
    '--glow-intensity': glowIntensity,
  } as React.CSSProperties;

  return (
    <div className={cn(
      "relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden",
      className
    )}>
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              '--top-position': `${Math.random() * 100}%`,
              '--animation-delay': `${Math.random() * 5}s`,
              '--animation-duration': `${3 + Math.random() * 4}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Shadow energy overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20" />
      
      {/* Rift portal effect */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none portal-effect"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* System icons */}
        <div className="flex gap-8 mb-8">
          <div className="animate-spin">
            <Swords className="w-8 h-8 text-purple-400" />
          </div>
          <div className="animate-pulse">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div className="animate-spin">
            <Crown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Main title with System Ascendant styling */}
        <div className="text-center mb-8">
          <h1 
            className="text-6xl md:text-8xl font-black tracking-wider mb-4 solo-hero-title"
            style={titleStyle}
          >
            {title}
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-gray-300 font-medium animate-pulse solo-hero-subtitle"
          >
            {subtitle}
          </p>
        </div>

        {/* System status indicators */}
        <div className="flex gap-6 mb-12">
          {[
            { icon: Sparkles, label: "SYSTEM", color: "text-purple-400" },
            { icon: Shield, label: "SHADOW", color: "text-blue-400" },
            { icon: Swords, label: "POWER", color: "text-red-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-black/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
            >
              <item.icon className={cn("w-4 h-4", item.color)} />
              <span className="text-sm font-bold text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Call to action or login form */}
        {showLogin ? (
          <div className="w-full max-w-md">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">SYSTEM ACCESS</h2>
                <p className="text-gray-400 text-sm">Enter the Umbral Dominion</p>
              </div>
              {/* Login form would go here */}
            </div>
          </div>
        ) : (
          <button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full border border-purple-400/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            ENTER SYSTEM
          </button>
        )}

        {/* Floating particles around main content */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="hero-floating-particle"
              style={{
                '--animation-duration': `${2 + Math.random() * 3}s`,
                '--animation-delay': `${Math.random() * 2}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Bottom system message */}
      <div className="absolute bottom-8 left-0 right-0 text-center opacity-70">
        <p className="text-sm text-gray-500 font-mono">
          SYSTEM ONLINE • UMBRAL ENERGY STABLE • RIFTS MONITORED
        </p>
      </div>

      <style>{`
        @keyframes portalPulse {
          0%, 100% {
            background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          }
          25% {
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          }
          50% {
            background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
          }
          75% {
            background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          }
        }

        @keyframes floatParticle {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(calc(-50% + 50px), calc(-50% + 50px)) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translate(calc(-50% + 100px), calc(-50% + 100px)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}


