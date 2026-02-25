import React from 'react';
import { Factory, Cog } from 'lucide-react';

export const Brand = {
  name: "SteelCore Industries",
  
  // Customizable Logo Component
  Logo: ({ size = 'large', className = '' }: { size?: 'small' | 'large', className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative flex-shrink-0">
            <Cog size={size === 'large' ? 50 : 32} strokeWidth={1} className="text-slate-300 animate-spin-slow" />
            <Factory size={size === 'large' ? 24 : 16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="flex flex-col justify-center">
            <h1 className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-black text-white tracking-widest uppercase leading-none`} style={{ fontFamily: 'Arial, sans-serif' }}>
                SteelCore
            </h1>
            <span className={`${size === 'large' ? 'text-sm' : 'text-xs'} text-slate-300 font-light tracking-[0.2em] uppercase`}>Industries</span>
        </div>
    </div>
  ),

  // Centralized Image Configuration for different screens
  images: {
    // Industrial Assembly Line - For Portal Selection
    portal: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=2574&auto=format&fit=crop", 
    // Corporate/Skyscraper - For Role Selection
    role: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    // Tech/Lab/Factory - For Academy Selection
    academy: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
  },

  // Color utilities
  colors: {
    overlay: "bg-slate-900/80", // Dark overlay for readability
    cardGlass: "bg-white/90 backdrop-blur-md border border-white/20", // Light glass effect
    cardGlassDark: "bg-slate-900/60 backdrop-blur-md border border-slate-700", // Dark glass effect
    primary: "bg-slate-800",
    accent: "text-blue-400"
  }
};