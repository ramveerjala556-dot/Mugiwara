import React from 'react';

// Jolly Roger Straw Hat Pirate Skull Icon (Original Mugiwara Emblem)
export const JollyRogerIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Crossbones */}
    <path
      d="M16 22 L84 78 M84 22 L16 78"
      stroke="#F3F4F6"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <circle cx="14" cy="18" r="6" fill="#F3F4F6" />
    <circle cx="20" cy="14" r="6" fill="#F3F4F6" />
    <circle cx="86" cy="18" r="6" fill="#F3F4F6" />
    <circle cx="80" cy="14" r="6" fill="#F3F4F6" />
    <circle cx="14" cy="82" r="6" fill="#F3F4F6" />
    <circle cx="20" cy="86" r="6" fill="#F3F4F6" />
    <circle cx="86" cy="82" r="6" fill="#F3F4F6" />
    <circle cx="80" cy="86" r="6" fill="#F3F4F6" />

    {/* Skull Base */}
    <circle cx="50" cy="52" r="26" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2.5" />
    
    {/* Teeth Jaw */}
    <rect x="40" y="68" width="20" height="13" rx="3" fill="#FFFFFF" stroke="#1F2937" strokeWidth="2.5" />
    <line x1="45" y1="69" x2="45" y2="80" stroke="#1F2937" strokeWidth="2" />
    <line x1="50" y1="69" x2="50" y2="80" stroke="#1F2937" strokeWidth="2" />
    <line x1="55" y1="69" x2="55" y2="80" stroke="#1F2937" strokeWidth="2" />

    {/* Big Pirate Eyes */}
    <circle cx="41" cy="52" r="7.5" fill="#111827" />
    <circle cx="59" cy="52" r="7.5" fill="#111827" />
    
    {/* Nose Hole */}
    <polygon points="50,60 47,65 53,65" fill="#111827" />

    {/* Straw Hat Crown */}
    <path
      d="M24 38 Q50 12 76 38 Z"
      fill="#F59E0B"
      stroke="#D97706"
      strokeWidth="2.5"
    />
    {/* Straw Hat Red Ribbon */}
    <path
      d="M22 38 C32 34 68 34 78 38 C75 42 25 42 22 38 Z"
      fill="#DC2626"
    />
    {/* Straw Hat Brim */}
    <ellipse cx="50" cy="38" rx="36" ry="6.5" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
  </svg>
);

// Thousand Sunny Lion Figurehead / Sun Icon
export const ThousandSunnyIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Mane Petals */}
    <g fill="#F59E0B">
      <polygon points="24,2 27,11 21,11" />
      <polygon points="38,8 35,17 30,12" />
      <polygon points="46,20 37,23 37,17" />
      <polygon points="43,34 34,31 37,26" />
      <polygon points="32,44 27,36 33,32" />
      <polygon points="16,44 15,32 21,36" />
      <polygon points="5,34 11,26 14,31" />
      <polygon points="2,20 11,17 11,23" />
      <polygon points="10,8 18,12 13,17" />
    </g>
    {/* Lion Face */}
    <circle cx="24" cy="24" r="14" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
    {/* Cheerful Eyes */}
    <circle cx="19" cy="22" r="2.5" fill="#1F2937" />
    <circle cx="29" cy="22" r="2.5" fill="#1F2937" />
    {/* Nose and Muzzle */}
    <circle cx="24" cy="27" r="4.5" fill="#FEF08A" />
    <polygon points="24,25 22,27 26,27" fill="#1F2937" />
    {/* Big Smile */}
    <path d="M21 29 Q24 33 27 29" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Quick Action Pastel Illustrations
export const CodeIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="16" width="60" height="42" rx="6" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="3" />
    <path d="M6 58 H74 V62 C74 65 71 67 68 67 H12 C9 67 6 65 6 62 Z" fill="#93C5FD" />
    <path d="M28 32 L20 37 L28 42" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M52 32 L60 37 L52 42" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M44 28 L36 46" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const ResearchIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stack of books */}
    <rect x="16" y="52" width="48" height="12" rx="3" fill="#8B5CF6" fillOpacity="0.25" stroke="#7C3AED" strokeWidth="2.5" />
    <rect x="20" y="38" width="42" height="12" rx="3" fill="#A78BFA" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2.5" />
    <rect x="24" y="24" width="34" height="12" rx="3" fill="#C4B5FD" fillOpacity="0.4" stroke="#A78BFA" strokeWidth="2.5" />
    {/* Magnifier */}
    <circle cx="52" cy="28" r="14" fill="#EDE9FE" fillOpacity="0.8" stroke="#7C3AED" strokeWidth="3" />
    <line x1="62" y1="38" x2="72" y2="48" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 25 Q52 21 57 26" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CreateIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Scroll */}
    <rect x="18" y="16" width="38" height="50" rx="4" fill="#FDE68A" fillOpacity="0.5" stroke="#D97706" strokeWidth="2.5" />
    <line x1="26" y1="26" x2="46" y2="26" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="34" x2="48" y2="34" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="42" x2="42" y2="42" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    {/* Feather Quill */}
    <path d="M64 12 C60 22 54 36 44 48 C46 44 50 42 54 42 C56 36 58 26 64 12 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    <path d="M44 48 L40 54 L46 51 Z" fill="#92400E" />
  </svg>
);

export const AnalyzeIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Trend Line and Bars */}
    <rect x="14" y="44" width="10" height="22" rx="2" fill="#10B981" fillOpacity="0.4" stroke="#059669" strokeWidth="2" />
    <rect x="29" y="32" width="10" height="34" rx="2" fill="#10B981" fillOpacity="0.6" stroke="#059669" strokeWidth="2" />
    <rect x="44" y="22" width="10" height="44" rx="2" fill="#10B981" fillOpacity="0.8" stroke="#059669" strokeWidth="2" />
    <rect x="59" y="14" width="10" height="52" rx="2" fill="#10B981" stroke="#047857" strokeWidth="2" />
    {/* Arrow */}
    <path d="M16 40 L34 26 L50 30 L66 12" stroke="#047857" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="62,10 68,11 67,17" fill="#047857" />
  </svg>
);

export const AutomateIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ship Steering Wheel (Helm) */}
    <circle cx="40" cy="40" r="16" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
    <circle cx="40" cy="40" r="6" fill="#DC2626" />
    {/* Spokes */}
    <line x1="40" y1="12" x2="40" y2="68" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
    <line x1="12" y1="40" x2="68" y2="40" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="20" x2="60" y2="60" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="20" x2="20" y2="60" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
    {/* Handles */}
    <circle cx="40" cy="10" r="3.5" fill="#EF4444" />
    <circle cx="40" cy="70" r="3.5" fill="#EF4444" />
    <circle cx="10" cy="40" r="3.5" fill="#EF4444" />
    <circle cx="70" cy="40" r="3.5" fill="#EF4444" />
  </svg>
);
