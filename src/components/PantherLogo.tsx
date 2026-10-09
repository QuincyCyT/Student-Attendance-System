import React, { useState } from 'react';

interface PantherLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const PantherLogo: React.FC<PantherLogoProps> = ({
  className = '',
  size = 'lg',
  showBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const imageSrc = '/panther_logo.png';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full select-none transition-transform hover:scale-105 ${
        showBorder
          ? 'p-1.5 bg-gradient-to-br from-[#FFF7FB] via-amber-200 to-[#5B3765] shadow-2xl ring-4 ring-[#FFF7FB]/80'
          : ''
      } ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#5B3765] border-2 border-[#FFF7FB] flex items-center justify-center shadow-inner relative`}
      >
        {!imageError ? (
          <img
            src={imageSrc}
            alt="CCS Panther Mascot Logo"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center scale-105"
          />
        ) : (
          /* High-fidelity Vector Panther Emblem Fallback */
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-2"
          >
            <circle cx="50" cy="50" r="48" fill="#5B3765" />
            <circle cx="50" cy="50" r="44" stroke="#FFF7FB" strokeWidth="2" strokeDasharray="2 2" />
            {/* Panther Silhouette */}
            <path
              d="M30 68 C28 50 35 34 50 34 C65 34 72 50 70 68 C62 60 58 58 50 58 C42 58 38 60 30 68 Z"
              fill="#1A1024"
            />
            {/* Ears */}
            <path d="M34 40 L26 26 L42 32 Z" fill="#1A1024" stroke="#FFF7FB" strokeWidth="1" />
            <path d="M66 40 L74 26 L58 32 Z" fill="#1A1024" stroke="#FFF7FB" strokeWidth="1" />
            {/* Snout & Jaws */}
            <path
              d="M42 46 C42 42 58 42 58 46 C58 54 53 58 50 58 C47 58 42 54 42 46 Z"
              fill="#2A1B38"
            />
            {/* Nose */}
            <polygon points="47,48 53,48 50,52" fill="#E8B4D9" />
            {/* Glowing Panther Eyes */}
            <ellipse cx="41" cy="42" rx="3.5" ry="2" fill="#FBBF24" transform="rotate(-15 41 42)" />
            <circle cx="41" cy="42" r="1" fill="#111827" />
            <ellipse cx="59" cy="42" rx="3.5" ry="2" fill="#FBBF24" transform="rotate(15 59 42)" />
            <circle cx="59" cy="42" r="1" fill="#111827" />
            {/* Whisker highlights */}
            <line x1="32" y1="52" x2="42" y2="51" stroke="#FFF7FB" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="30" y1="56" x2="41" y2="54" stroke="#FFF7FB" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="68" y1="52" x2="58" y2="51" stroke="#FFF7FB" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <line x1="70" y1="56" x2="59" y2="54" stroke="#FFF7FB" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            {/* Fang accents */}
            <polygon points="45,54 47,58 46,54" fill="#FFF7FB" />
            <polygon points="55,54 53,58 54,54" fill="#FFF7FB" />
          </svg>
        )}
      </div>
    </div>
  );
};
