/**
 * Solo Leveling Styled Hero Component
 * For landing and login pages with dramatic manhwa aesthetics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Swords, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import './SoloLevelingHero.css';

interface SoloLevelingHeroProps {
  title?: string;
  subtitle?: string;
  showLogin?: boolean;
  className?: string;
}

export function SoloLevelingHero({ 
  title = "SOLO COMPENDIUM", 
  subtitle = "Shadow Monarch's D&D Companion",
  showLogin = false,
  className 
}: SoloLevelingHeroProps) {
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [particleCount, setParticleCount] = useState(0);

  // Convert glow intensity to CSS class
  const getGlowClass = (intensity: number) => {
    if (intensity < 0.4) return 'solo-hero-glow-low';
    if (intensity < 0.6) return 'solo-hero-glow-medium';
    if (intensity < 0.8) return 'solo-hero-glow-high';
    return 'solo-hero-glow-max';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const next = prev + (Math.random() - 0.5) * 0.1;
        return Math.max(0.3, Math.min(1, next));
      });
      setParticleCount(prev => (prev + 1) % 20);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden",
      className
    )}>
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Shadow energy overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20" />
      
      {/* Gate portal effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* System icons */}
        <motion.div
          className="flex gap-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Swords className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Shield className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Crown className="w-8 h-8 text-red-400" />
          </motion.div>
        </motion.div>

        {/* Main title with Solo Leveling styling */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <h1 
            className={`text-6xl md:text-8xl font-black tracking-wider mb-4 solo-hero-title ${getGlowClass(glowIntensity)}`}
          >
            {title}
          </h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 font-medium"
            animate={{
              opacity: [0.7, 1, 0.7],
              textShadow: [
                "0 0 10px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 10px rgba(239, 68, 68, 0.5)",
                "0 0 10px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* System status indicators */}
        <motion.div
          className="flex gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {[
            { icon: Sparkles, label: "SYSTEM", color: "text-purple-400" },
            { icon: Shield, label: "SHADOW", color: "text-blue-400" },
            { icon: Swords, label: "POWER", color: "text-red-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-black/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: item.color.replace('text-', '') }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={cn("w-4 h-4", item.color)} />
              <span className="text-sm font-bold text-gray-300">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action or login form */}
        {showLogin ? (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">SYSTEM ACCESS</h2>
                <p className="text-gray-400 text-sm">Enter the Shadow Monarch's domain</p>
              </div>
              {/* Login form would go here */}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full border border-purple-400/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              ENTER SYSTEM
            </motion.button>
          </motion.div>
        )}

        {/* Floating particles around main content */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
              style={{
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom system message */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2, delay: 2 }}
      >
        <p className="text-sm text-gray-500 font-mono">
          SYSTEM ONLINE • SHADOW ENERGY STABLE • GATES MONITORED
        </p>
      </motion.div>
    </div>
  );
}
