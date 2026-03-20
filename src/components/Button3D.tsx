// 🎨 **3D Enhanced Button Component - Royal Springs Resort**
// Features 3D effects, animations, and modern styling

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Button3DProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
  floating?: boolean;
}

const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon,
  glow = true,
  floating = false
}) => {
  const baseClasses = "relative font-bold transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-2xl",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl",
    outline: "border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 shadow-lg",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-3xl",
    xl: "px-12 py-6 text-xl rounded-3xl"
  };

  const glowClasses = glow ? {
    primary: "shadow-blue-500/50 shadow-2xl",
    secondary: "shadow-slate-500/50 shadow-xl",
    outline: "shadow-blue-400/30 shadow-lg hover:shadow-blue-500/50",
    glass: "shadow-white/20 shadow-2xl"
  } : {};

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses[variant],
        className
      )}
      whileHover={{ 
        scale: 1.05, 
        y: floating ? -8 : -4,
        rotateX: floating ? 2 : 0,
        rotateY: floating ? 2 : 0
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* 3D Layers */}
      <div className="relative inset-0 flex items-center justify-center">
        {/* Back layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-inherit opacity-0"
          whileHover={{ opacity: 0.3 }}
          style={{
            transform: "translateZ(-20px)"
          }}
        />
        
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          {icon && (
            <motion.div
              className="flex-shrink-0"
              animate={{ 
                rotate: floating ? 360 : 0,
              }}
              transition={{ 
                duration: floating ? 3 : 0,
                ease: "linear",
                repeat: floating ? Infinity : 0
              }}
            >
              {icon}
            </motion.div>
          )}
          <span>{children}</span>
        </div>
        
        {/* Top highlight layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-inherit opacity-0"
          whileHover={{ opacity: 1 }}
          style={{
            transform: "translateZ(10px)"
          }}
        />
        
        {/* Glow effect */}
        {glow && (
          <motion.div
            className="absolute -inset-4 rounded-inherit opacity-0"
            whileHover={{ opacity: 1 }}
            animate={{
              opacity: [0, 0.5, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
              filter: "blur(20px)",
              transform: "translateZ(30px)"
            }}
          />
        )}
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
        whileHover={{ 
          opacity: [0, 1, 0],
          x: ["-100%", "100%", "100%"]
        }}
        transition={{ duration: 0.6 }}
        style={{
          transform: "translateZ(5px)"
        }}
      />
    </motion.button>
  );
};

export default Button3D;
