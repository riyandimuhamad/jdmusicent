import React from 'react';

export const DynamicOrnament = ({ themeId, type = 'hero', className }) => {
  // Determine culture from themeId (e.g., lokal-sunda-priangan -> sunda)
  let culture = 'modern'; // fallback
  if (themeId?.includes('sunda-priangan')) culture = 'priangan';
  else if (themeId?.includes('sunda-cirebonan')) culture = 'cirebon';
  else if (themeId?.includes('banten-majesty')) culture = 'banten';

  // --- PRIANGAN ORNAMENTS (Siger & Gunungan & Floral) ---
  if (culture === 'priangan') {
    if (type === 'hero') {
      return (
        <svg viewBox="0 0 200 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10 L120 40 L160 30 L140 60 L180 60 L150 80 L190 90 L10 90 L50 80 L20 60 L60 60 L40 30 L80 40 Z" fill="var(--color-accent)" opacity="0.1" />
          <path d="M100 10 L120 40 L160 30 L140 60 L180 60 L150 80 L190 90 L10 90 L50 80 L20 60 L60 60 L40 30 L80 40 Z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M100 20 L110 45 L140 40 L125 65 L150 75 L100 85 L50 75 L75 65 L60 40 L90 45 Z" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="10" r="3" fill="var(--color-accent)" />
          <circle cx="160" cy="30" r="2" fill="var(--color-accent)" />
          <circle cx="40" cy="30" r="2" fill="var(--color-accent)" />
          <circle cx="180" cy="60" r="2" fill="var(--color-accent)" />
          <circle cx="20" cy="60" r="2" fill="var(--color-accent)" />
          <circle cx="100" cy="40" r="4" fill="var(--color-accent)" opacity="0.5" />
          <circle cx="100" cy="60" r="5" fill="var(--color-accent)" />
          <path d="M100 85 Q100 95 100 100" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="100" cy="102" r="1.5" fill="var(--color-accent)" />
        </svg>
      );
    }
    if (type === 'corner') {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C60 0 140 60 180 180" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 0 C40 20 80 80 100 180" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          <path d="M30 15 C50 15 65 30 55 50 C40 50 25 35 30 15 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M70 35 C90 40 100 60 85 75 C65 70 55 50 70 35 Z" fill="var(--color-accent)" fillOpacity="0.15" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M110 70 C130 80 135 105 115 120 C95 110 90 85 110 70 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M15 40 C30 50 35 70 20 80 C5 70 0 50 15 40 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M45 85 C60 100 60 125 40 135 C20 120 20 95 45 85 Z" fill="var(--color-accent)" fillOpacity="0.1" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M90 20 C95 15 105 15 110 25 C105 30 95 30 90 20 Z" fill="var(--color-accent)" />
          <path d="M130 45 C135 40 145 40 150 50 C145 55 135 55 130 45 Z" fill="var(--color-accent)" opacity="0.8"/>
        </svg>
      );
    }
    if (type === 'separator') {
      return (
        <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 C70 50 100 80 100 150 L0 150 C0 80 30 50 50 0 Z" stroke="var(--color-accent)" strokeWidth="1.5" />
          <path d="M50 15 C65 55 90 85 90 145 L10 145 C10 85 35 55 50 15 Z" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
          <path d="M50 145 L50 40" stroke="var(--color-accent)" strokeWidth="2" />
          <circle cx="50" cy="40" r="3" fill="var(--color-accent)" />
          <circle cx="80" cy="60" r="2" fill="var(--color-accent)" />
          <circle cx="20" cy="60" r="2" fill="var(--color-accent)" />
        </svg>
      );
    }
  }

  // --- CIREBONAN ORNAMENTS (Megamendung) ---
  if (culture === 'cirebon') {
    if (type === 'hero' || type === 'separator') {
      return (
        <svg viewBox="0 0 200 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 90 C 20 60, 50 50, 70 70 C 80 40, 120 40, 130 70 C 150 50, 180 60, 180 90 Z" fill="var(--color-accent)" opacity="0.1" stroke="var(--color-accent)" strokeWidth="2" />
          <path d="M30 90 C 30 70, 50 60, 65 75 C 75 55, 105 55, 115 75 C 130 60, 150 70, 150 90 Z" fill="var(--color-accent)" opacity="0.3" stroke="var(--color-accent)" strokeWidth="1.5" />
          <path d="M45 90 C 45 80, 55 75, 60 85 C 70 70, 90 70, 95 85 C 105 75, 120 80, 120 90 Z" fill="var(--color-accent)" opacity="0.6" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="100" cy="90" r="3" fill="var(--color-accent)" />
        </svg>
      );
    }
    if (type === 'corner') {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C 80 0, 120 40, 120 120 C 80 80, 40 80, 0 120 Z" fill="var(--color-accent)" opacity="0.1" stroke="var(--color-accent)" strokeWidth="1.5" />
          <path d="M0 0 C 60 0, 90 30, 90 90 C 60 60, 30 60, 0 90 Z" fill="var(--color-accent)" opacity="0.2" stroke="var(--color-accent)" strokeWidth="1" />
          <path d="M0 0 C 40 0, 60 20, 60 60 C 40 40, 20 40, 0 60 Z" fill="var(--color-accent)" opacity="0.4" stroke="var(--color-accent)" strokeWidth="1" />
        </svg>
      );
    }
  }

  // --- BANTEN MAJESTY ORNAMENTS (Menara Banten Silhouette) ---
  if (culture === 'banten') {
    if (type === 'hero' || type === 'separator') {
      return (
        <svg viewBox="0 0 100 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Menara Banten Base */}
          <rect x="30" y="120" width="40" height="30" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent)" fillOpacity="0.1" />
          <rect x="35" y="90" width="30" height="30" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent)" fillOpacity="0.1" />
          <rect x="40" y="60" width="20" height="30" stroke="var(--color-accent)" strokeWidth="1.5" fill="var(--color-accent)" fillOpacity="0.1" />
          <path d="M45 60 L50 20 L55 60 Z" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="1" />
          {/* Roof details */}
          <path d="M25 120 L75 120" stroke="var(--color-accent)" strokeWidth="2" />
          <path d="M30 90 L70 90" stroke="var(--color-accent)" strokeWidth="2" />
          <path d="M35 60 L65 60" stroke="var(--color-accent)" strokeWidth="2" />
          <circle cx="50" cy="15" r="3" fill="var(--color-accent)" />
        </svg>
      );
    }
    if (type === 'corner') {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Surosowan Geometric Corner */}
          <path d="M0 0 L150 0 L150 20 L20 20 L20 150 L0 150 Z" fill="var(--color-accent)" opacity="0.3" />
          <path d="M0 0 L120 0 L120 10 L10 10 L10 120 L0 120 Z" fill="var(--color-accent)" opacity="0.6" />
          <path d="M40 40 L80 40 L80 80 L40 80 Z" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="5" fill="var(--color-accent)" />
        </svg>
      );
    }
  }

  // --- MODERN / DEFAULT ORNAMENTS ---
  if (type === 'hero' || type === 'separator') {
    return (
      <svg viewBox="0 0 100 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="25" r="4" fill="var(--color-accent)" />
        <path d="M10 25 L40 25" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
        <path d="M60 25 L90 25" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
        <circle cx="25" cy="25" r="2" fill="var(--color-accent)" opacity="0.5" />
        <circle cx="75" cy="25" r="2" fill="var(--color-accent)" opacity="0.5" />
      </svg>
    );
  }
  
  if (type === 'corner') {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L100 0" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
        <path d="M0 0 L0 100" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
        <path d="M20 20 L60 20" stroke="var(--color-accent)" strokeWidth="1" />
        <path d="M20 20 L20 60" stroke="var(--color-accent)" strokeWidth="1" />
      </svg>
    );
  }

  return null;
};
