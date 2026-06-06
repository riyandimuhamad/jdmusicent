"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function EksklusifCover({ theme, guestName, onOpen, isCoverOnly }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    // Wait for the door opening animation before triggering the parent's onOpen
    setTimeout(() => {
      onOpen();
    }, 1500); 
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: theme?.colors?.[0] || 'var(--color-bg)' }}>
        
        {/* Left Door */}
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: isOpening ? "-100%" : 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          className="absolute top-0 left-0 w-1/2 h-full border-r-2 flex justify-end items-center"
          style={{ 
            backgroundColor: theme?.colors?.[0] || 'var(--color-bg)',
            borderColor: theme?.colors?.[2] || 'var(--color-accent)',
            boxShadow: '5px 0 25px rgba(0,0,0,0.3)'
          }}
        >
          {/* Left Arch Details */}
          <div className="w-full h-full relative opacity-20" style={{
            backgroundImage: `radial-gradient(circle at right, ${theme?.colors?.[2] || 'var(--color-accent)'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </motion.div>

        {/* Right Door */}
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: isOpening ? "100%" : 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
          className="absolute top-0 right-0 w-1/2 h-full border-l-2 flex justify-start items-center"
          style={{ 
            backgroundColor: theme?.colors?.[0] || 'var(--color-bg)',
            borderColor: theme?.colors?.[2] || 'var(--color-accent)',
            boxShadow: '-5px 0 25px rgba(0,0,0,0.3)'
          }}
        >
           {/* Right Arch Details */}
           <div className="w-full h-full relative opacity-20" style={{
            backgroundImage: `radial-gradient(circle at left, ${theme?.colors?.[2] || 'var(--color-accent)'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </motion.div>

        {/* Center Content (Wax Seal & Text) */}
        <motion.div 
          animate={{ 
            opacity: isOpening ? 0 : 1 
          }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          className="relative z-10 text-center px-6 flex flex-col items-center w-full max-w-sm pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center"
          >
            {/* Elegant Arch Frame for Text */}
            <div 
              className="px-8 py-12 rounded-t-full border-t border-x flex flex-col items-center relative bg-black/20 backdrop-blur-sm"
              style={{ borderColor: theme?.colors?.[2] || 'var(--color-accent)' }}
            >
              <div className="absolute -top-4 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-transparent" style={{ borderColor: theme?.colors?.[2] || 'var(--color-accent)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme?.colors?.[2] || 'var(--color-accent)' }} />
              </div>

              <p className="text-[10px] tracking-[0.3em] uppercase mb-1 opacity-80 font-semibold" style={{ color: theme?.colors?.[3] || 'var(--color-text)' }}>You Are Invited</p>
              <p className="text-[9px] tracking-[0.2em] uppercase mb-8 opacity-60" style={{ color: theme?.colors?.[3] || 'var(--color-text)' }}>To The Wedding Of</p>
              
              <h1 className="font-heading text-6xl sm:text-7xl drop-shadow-lg" style={{ color: theme?.colors?.[2] || 'var(--color-accent)' }}>R & A</h1>
              
              <div className="mt-8 mb-8 flex flex-col items-center">
                <p className="text-xs italic opacity-80 mb-1" style={{ color: theme?.colors?.[3] || 'var(--color-text)' }}>Kepada Yth.</p>
                <p className="font-bold text-lg tracking-wider capitalize" style={{ color: theme?.colors?.[3] || 'var(--color-text)' }}>{guestName.replace(/-/g, ' ')}</p>
              </div>

              {/* Wax Seal / Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] -mb-20"
                style={{ backgroundColor: '#8B0000', border: `2px solid ${theme?.colors?.[2] || 'var(--color-accent)'}` }}
              >
                <div className="absolute inset-1 rounded-full border border-white/20" />
                <span className="font-heading text-3xl text-gold" style={{ color: theme?.colors?.[2] || 'var(--color-accent)' }}>RA</span>
              </motion.button>
            </div>
            
            <p className="mt-20 text-[10px] uppercase tracking-widest opacity-60" style={{ color: theme?.colors?.[3] || 'var(--color-text)' }}>
              {isCoverOnly ? "Mode Pratinjau" : "Buka Gerbang"}
            </p>
          </motion.div>
        </motion.div>
        
      </div>
    </AnimatePresence>
  );
}
