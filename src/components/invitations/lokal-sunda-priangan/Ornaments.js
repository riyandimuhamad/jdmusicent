import React from 'react';

export const SigerOrnament = ({ className }) => (
  <svg viewBox="0 0 200 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Siger Crown */}
    <path d="M100 10 L120 40 L160 30 L140 60 L180 60 L150 80 L190 90 L10 90 L50 80 L20 60 L60 60 L40 30 L80 40 Z" fill="var(--color-accent)" opacity="0.1" />
    <path d="M100 10 L120 40 L160 30 L140 60 L180 60 L150 80 L190 90 L10 90 L50 80 L20 60 L60 60 L40 30 L80 40 Z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
    
    {/* Inner details */}
    <path d="M100 20 L110 45 L140 40 L125 65 L150 75 L100 85 L50 75 L75 65 L60 40 L90 45 Z" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
    
    {/* Jewels / Dots */}
    <circle cx="100" cy="10" r="3" fill="var(--color-accent)" />
    <circle cx="160" cy="30" r="2" fill="var(--color-accent)" />
    <circle cx="40" cy="30" r="2" fill="var(--color-accent)" />
    <circle cx="180" cy="60" r="2" fill="var(--color-accent)" />
    <circle cx="20" cy="60" r="2" fill="var(--color-accent)" />
    <circle cx="100" cy="40" r="4" fill="var(--color-accent)" opacity="0.5" />
    <circle cx="100" cy="60" r="5" fill="var(--color-accent)" />
    
    {/* Droplets */}
    <path d="M100 85 Q100 95 100 100" stroke="var(--color-accent)" strokeWidth="1" />
    <circle cx="100" cy="102" r="1.5" fill="var(--color-accent)" />
    
    <path d="M70 80 Q70 90 70 95" stroke="var(--color-accent)" strokeWidth="1" />
    <circle cx="70" cy="97" r="1.5" fill="var(--color-accent)" />
    
    <path d="M130 80 Q130 90 130 95" stroke="var(--color-accent)" strokeWidth="1" />
    <circle cx="130" cy="97" r="1.5" fill="var(--color-accent)" />
  </svg>
);

export const GununganOrnament = ({ className }) => (
  <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0 C70 50 100 80 100 150 L0 150 C0 80 30 50 50 0 Z" stroke="var(--color-accent)" strokeWidth="1.5" />
    <path d="M50 15 C65 55 90 85 90 145 L10 145 C10 85 35 55 50 15 Z" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
    {/* Tree of life core */}
    <path d="M50 145 L50 40" stroke="var(--color-accent)" strokeWidth="2" />
    <path d="M50 100 Q70 90 80 60" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M50 100 Q30 90 20 60" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M50 70 Q65 60 70 40" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M50 70 Q35 60 30 40" stroke="var(--color-accent)" strokeWidth="1" />
    <circle cx="50" cy="40" r="3" fill="var(--color-accent)" />
    <circle cx="80" cy="60" r="2" fill="var(--color-accent)" />
    <circle cx="20" cy="60" r="2" fill="var(--color-accent)" />
    <circle cx="70" cy="40" r="1.5" fill="var(--color-accent)" />
    <circle cx="30" cy="40" r="1.5" fill="var(--color-accent)" />
  </svg>
);

export const FloralCorner = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main Stem */}
    <path d="M0 0 C60 0 140 60 180 180" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M0 0 C40 20 80 80 100 180" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <path d="M0 0 C20 40 40 120 30 180" stroke="var(--color-accent)" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
    
    {/* Leaves */}
    <path d="M30 15 C50 15 65 30 55 50 C40 50 25 35 30 15 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M70 35 C90 40 100 60 85 75 C65 70 55 50 70 35 Z" fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M110 70 C130 80 135 105 115 120 C95 110 90 85 110 70 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M140 115 C160 130 160 160 140 170 C120 155 120 125 140 115 Z" fill="var(--color-accent)" fillOpacity="0.2" stroke="var(--color-accent)" strokeWidth="1" />
    
    <path d="M15 40 C30 50 35 70 20 80 C5 70 0 50 15 40 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M45 85 C60 100 60 125 40 135 C20 120 20 95 45 85 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
    <path d="M75 135 C90 150 85 175 65 185 C50 170 55 145 75 135 Z" fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="1" />

    {/* Flowers / Jasmine Buds */}
    <path d="M90 20 C95 15 105 15 110 25 C105 30 95 30 90 20 Z" fill="var(--color-accent)" />
    <path d="M130 45 C135 40 145 40 150 50 C145 55 135 55 130 45 Z" fill="var(--color-accent)" opacity="0.8"/>
    <path d="M165 85 C170 80 180 80 185 90 C180 95 170 95 165 85 Z" fill="var(--color-accent)" opacity="0.6"/>
  </svg>
);
