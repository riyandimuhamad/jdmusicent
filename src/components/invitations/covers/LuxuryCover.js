"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LuxuryCover({ theme, guestName, onOpen, isCoverOnly }) {
  const [step, setStep] = useState(0); // 0: Closed, 1: Flap Open, 2: Paper sliding up, 3: Envelope drops & paper centers

  const handleOpen = () => {
    setStep(1); // Flap opens
    
    // Step 2: Paper slides up
    setTimeout(() => {
      setStep(2);
    }, 800);

    // PAUSE for 1.5s so guests can read the paper
    // Step 3: Envelope drops down
    setTimeout(() => {
      setStep(3);
    }, 2800);
    
    // Step 4: Trigger parent open immediately after envelope drops (crossfade)
    setTimeout(() => {
      onOpen();
    }, 3800); 
  };

  // Luxury Envelope Colors based on theme
  const envelopeColor = theme?.colors?.[0] || '#111';
  const paperColor = theme?.colors?.[1] || '#FDF5E6';
  const goldColor = theme?.colors?.[2] || '#FFD700';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}>
        
        {/* Elegant Background Typography to fill the top void */}
        <motion.div 
          animate={{ opacity: step > 0 ? 0 : 1, y: step > 0 ? -50 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-[15%] w-full flex flex-col items-center text-center px-4 pointer-events-none z-0"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase mb-4 opacity-50 font-semibold" style={{ color: paperColor }}>The Wedding Of</p>
          <h2 className="font-heading text-5xl opacity-80 drop-shadow-lg" style={{ color: goldColor }}>R & A</h2>
          <div className="w-12 h-[1px] mt-6 opacity-30" style={{ backgroundColor: goldColor }} />
        </motion.div>

        {/* Envelope Assembly Container */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: step === 3 ? 800 : 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-[340px] h-[240px] pointer-events-auto mt-16"
        >
          {/* The Paper Inside (Z-10) */}
          <motion.div 
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: step === 0 ? 0 : (step === 2 ? -280 : (step === 3 ? -100 : 0)),
              scale: step === 3 ? 1.05 : 1,
              opacity: step === 3 ? 0 : (step > 0 ? 1 : 0) // Fade OUT exactly when envelope drops
            }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute z-10 w-[310px] h-[400px] left-[15px] bottom-2 shadow-2xl flex flex-col items-center justify-center border"
            style={{ backgroundColor: paperColor, borderColor: goldColor, borderRadius: '8px' }}
          >
            <p className="text-[9px] tracking-[0.3em] uppercase mb-1 opacity-80 font-semibold" style={{ color: theme?.colors?.[3] || '#333' }}>You Are Invited</p>
            <p className="text-[9px] tracking-[0.2em] uppercase mb-4 opacity-80" style={{ color: theme?.colors?.[3] || '#333' }}>To The Wedding Of</p>
            <h1 className="font-heading text-5xl sm:text-6xl mb-6" style={{ color: goldColor }}>R & A</h1>
            <p className="text-[10px] italic opacity-80 mb-1" style={{ color: theme?.colors?.[3] || '#333' }}>Kepada Yth.</p>
            <p className="font-bold text-sm tracking-wider capitalize text-center px-4" style={{ color: theme?.colors?.[3] || '#333' }}>{guestName.replace(/-/g, ' ')}</p>
          </motion.div>

          {/* Envelope Back (Z-0) */}
          <div 
            className="absolute inset-0 z-0 rounded-lg shadow-2xl"
            style={{ backgroundColor: envelopeColor }}
          />

          {/* Left Flap (Z-20) */}
          <div 
            className="absolute z-20 top-0 bottom-0 left-0 w-[60%]"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              filter: 'brightness(0.95)'
            }}
          />

          {/* Right Flap (Z-20) */}
          <div 
            className="absolute z-20 top-0 bottom-0 right-0 w-[60%]"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
              filter: 'brightness(0.92)'
            }}
          />

          {/* Bottom Flap (Z-20) */}
          <div 
            className="absolute z-20 bottom-0 left-0 right-0 h-[65%] rounded-b-lg"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
              filter: 'brightness(0.85)'
            }}
          />

          {/* Top Flap (Animated) (Z-30) */}
          <motion.div 
            initial={{ rotateX: 0 }}
            animate={{ rotateX: step > 0 ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute z-30 top-0 left-0 right-0 h-[60%] origin-top rounded-t-lg"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backfaceVisibility: 'hidden',
              filter: 'brightness(1.05)'
            }}
          />
          
          {/* Inner Top Flap (Visible when open) (Z-0) */}
          <div 
            className="absolute z-0 top-0 left-0 right-0 h-[60%] origin-top rounded-t-lg opacity-0"
            style={{ 
              backgroundColor: envelopeColor,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              rotate: '180deg',
              transform: 'rotateX(180deg)',
              filter: 'brightness(0.8)'
            }}
          />
          
          {/* Button / Wax Seal (Z-50) */}
          <motion.div
            animate={{ opacity: step > 0 ? 0 : 1, scale: step > 0 ? 0 : 1 }}
            className="absolute z-50 left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpen}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)] cursor-pointer"
              style={{ backgroundColor: goldColor }}
            >
               <span className="font-heading text-2xl text-navy-dark">R&A</span>
            </motion.button>
          </motion.div>

        </motion.div>
        
        {step === 0 && (
          <p className="absolute bottom-6 text-xs text-white/50 tracking-widest uppercase animate-pulse">
            {isCoverOnly ? "Mode Pratinjau" : "Buka Amplop"}
          </p>
        )}
      </div>
    </AnimatePresence>
  );
}
