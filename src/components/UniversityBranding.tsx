import React, { useState } from 'react';

interface UniversityBrandingProps {
  className?: string;
  lightText?: boolean;
}

export const UniversityBranding: React.FC<UniversityBrandingProps> = ({
  className = '',
  lightText = true,
}) => {
  const [jrmsuError, setJrmsuError] = useState(false);
  const [ccsError, setCcsError] = useState(false);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logos Container */}
      <div className="flex items-center gap-2 shrink-0">
        {/* JRMSU Seal */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white/10 p-0.5 border border-amber-300/40 shadow-md flex items-center justify-center">
          {!jrmsuError ? (
            <img
              src="/jrmsu_seal.jpg"
              alt="Jose Rizal Memorial State University Seal"
              referrerPolicy="no-referrer"
              onError={() => setJrmsuError(true)}
              className="w-full h-full object-contain rounded-full"
            />
          ) : (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#0A369D" stroke="#E5A93C" strokeWidth="4" />
              <circle cx="50" cy="50" r="38" fill="#0D47A1" />
              <circle cx="50" cy="50" r="28" fill="#1565C0" />
              <path d="M42 42 C42 34 58 34 58 42 C58 52 42 52 42 62 L58 62" stroke="#FFF" strokeWidth="3" fill="none" />
              <polygon points="48,70 52,70 50,65" fill="#E5A93C" />
            </svg>
          )}
        </div>

        {/* CCS Shield Logo */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 overflow-hidden flex items-center justify-center shrink-0">
          {!ccsError ? (
            <img
              src="/ccs_shield.jpg"
              alt="College of Computing Studies Shield"
              referrerPolicy="no-referrer"
              onError={() => setCcsError(true)}
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          ) : (
            <svg viewBox="0 0 100 120" className="w-full h-full">
              <path d="M20 20 L80 20 L80 70 C80 95 50 115 50 115 C50 115 20 95 20 70 Z" fill="#5B3568" stroke="#E5A93C" strokeWidth="4" />
              <rect x="35" y="40" width="30" height="20" rx="3" fill="#FFF" />
              <rect x="30" y="62" width="40" height="4" rx="2" fill="#E5A93C" />
            </svg>
          )}
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-[12px] sm:text-[13px] font-bold tracking-tight leading-tight ${
            lightText ? 'text-white' : 'text-slate-900'
          }`}
        >
          Jose Rizal Memorial State University
        </span>
        <span
          className={`text-[9.5px] sm:text-[10.5px] font-bold tracking-wider uppercase mt-0.5 ${
            lightText ? 'text-purple-200/90' : 'text-[#5B3568]'
          }`}
        >
          COLLEGE OF COMPUTING STUDIES
        </span>
      </div>
    </div>
  );
};
