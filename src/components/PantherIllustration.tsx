import React, { useState } from 'react';

interface PantherIllustrationProps {
  className?: string;
  showGlow?: boolean;
}

export const PantherIllustration: React.FC<PantherIllustrationProps> = ({
  className = '',
  showGlow = true,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative select-none pointer-events-none flex items-center justify-center overflow-visible ${className}`}
    >
      {/* =========================================================================
          SOFT CIRCULAR GLOW / BLOB:
          In a lighter purple tone, positioned behind the panther, partially on
          both sides of the diagonal seam to give depth & separation.
      ========================================================================= */}
      {showGlow && (
        <div
          className="absolute w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 rounded-full bg-[#9B66A4]/40 blur-2xl pointer-events-none -translate-x-4 -translate-y-2"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Secondary subtle halo ring */}
      {showGlow && (
        <div
          className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#874F90]/30 blur-md pointer-events-none"
          style={{ zIndex: 2 }}
        />
      )}

      {/* =========================================================================
          OFFICIAL PANTHER LOGO / ILLUSTRATION:
          Matching Panther-removebg-preview.png:
          - Deep eggplant purple crouching panther
          - Leopard rosette spots on head, face & shoulder
          - Two white fur patches on chest
          - Snarling profile facing right with sharp fangs & white whiskers
          - Front paw stepping forward with extended claws
          - Upward curling tail
          - Soft purple circular disc behind body
      ========================================================================= */}
      <div
        className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] overflow-visible"
        style={{ zIndex: 3 }}
      >
        {!imageError ? (
          <img
            src="/panther_logo.png"
            alt="Official CCS Panther Mascot"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform scale-110 sm:scale-115 transition-transform duration-500"
          />
        ) : (
          /* Pixel-Accurate Stylized SVG of the Official Panther Artwork */
          <svg
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
          >
            {/* Soft Muted Lavender-Purple Background Circle */}
            <circle cx="245" cy="245" r="160" fill="#9A669C" />

            <g transform="translate(30, 20)">
              {/* Back & Body Silhouette */}
              <path
                d="M175 125 C240 95, 320 100, 370 155 C390 185, 390 235, 360 285 C330 255, 275 245, 225 255 C185 265, 145 285, 115 325 C105 285, 115 205, 145 155 Z"
                fill="#27122E"
              />
              
              {/* Hind Leg Left */}
              <path
                d="M360 245 C390 265, 415 305, 405 355 C395 375, 355 385, 335 375 C325 355, 335 325, 325 305 Z"
                fill="#1D0E23"
              />
              
              {/* Upward Curling Tail */}
              <path
                d="M380 175 C425 185, 460 225, 450 275 C440 315, 405 338, 385 328 C375 322, 380 312, 390 306 C410 302, 425 276, 420 246 C415 216, 395 196, 375 186 Z"
                fill="#27122E"
              />

              {/* Front Right Leg Prowling (Grounded with Claws) */}
              <path
                d="M195 235 C205 285, 215 345, 205 385 C195 408, 155 422, 130 402 C120 372, 150 332, 160 272 Z"
                fill="#31193B"
              />

              {/* Front Left Heavy Muscular Forearm (Stepping Forward Towards Viewer) */}
              <path
                d="M250 235 C275 275, 295 330, 285 385 C275 415, 240 425, 215 405 C210 365, 230 310, 235 255 Z"
                fill="#3D2048"
              />

              {/* Leopard Rosette Spots on Stepping Forearm */}
              <ellipse cx="235" cy="300" rx="6" ry="10" fill="#1C0B22" transform="rotate(20 235 300)" />
              <ellipse cx="255" cy="325" rx="5" ry="8" fill="#1C0B22" transform="rotate(25 255 325)" />
              <ellipse cx="230" cy="345" rx="6" ry="12" fill="#1C0B22" transform="rotate(15 230 345)" />

              {/* Two Distinct White Fur Chest Tufts */}
              <path d="M190 220 L185 240 L195 235 L190 248 L202 225 Z" fill="#FFF7FB" />
              <path d="M210 230 L208 248 L218 242 L215 255 L225 235 Z" fill="#FFF7FB" />

              {/* Sharp Claws on Front Stepping Paw */}
              <path d="M125 402 L110 428 L130 412 Z" fill="#FFF7FB" />
              <path d="M135 408 L125 435 L145 418 Z" fill="#FFF7FB" />
              <path d="M150 408 L145 435 L160 418 Z" fill="#FFF7FB" />
              <path d="M210 405 L195 430 L218 415 Z" fill="#FFF7FB" />
              <path d="M225 408 L218 435 L232 418 Z" fill="#FFF7FB" />
              <path d="M238 408 L235 435 L245 418 Z" fill="#FFF7FB" />

              {/* Panther Head (Snarling, Angled Right Profile) */}
              <path
                d="M150 150 C130 120, 85 130, 65 160 C55 180, 65 210, 95 230 C125 240, 160 220, 180 190 C190 170, 170 140, 150 150 Z"
                fill="#391C44"
              />

              {/* Leopard Rosette Spots on Crown & Temple */}
              <circle cx="120" cy="140" r="3.5" fill="#1B0A21" />
              <circle cx="132" cy="135" r="4" fill="#1B0A21" />
              <circle cx="145" cy="142" r="3" fill="#1B0A21" />
              <circle cx="110" cy="150" r="4.5" fill="#1B0A21" />
              <circle cx="126" cy="155" r="3.5" fill="#1B0A21" />
              <circle cx="140" cy="165" r="4" fill="#1B0A21" />
              <circle cx="98" cy="170" r="3" fill="#1B0A21" />
              <circle cx="112" cy="175" r="3.5" fill="#1B0A21" />

              {/* Ears with Pinkish Inner Detailing */}
              <path d="M155 136 L175 102 L136 116 Z" fill="#26102D" />
              <path d="M152 132 L165 108 L140 120 Z" fill="#FCE7F3" opacity="0.85" />
              
              <path d="M120 126 L108 94 L92 122 Z" fill="#26102D" />
              <path d="M116 123 L108 102 L98 120 Z" fill="#FCE7F3" opacity="0.85" />

              {/* Jaws & Snout */}
              <path d="M74 180 C62 190, 74 214, 90 214 C100 214, 104 198, 94 188 Z" fill="#1E0D24" />
              
              {/* Pink Tongue & Open Mouth Interior */}
              <ellipse cx="84" cy="200" rx="8" ry="6" fill="#F43F5E" opacity="0.75" />

              {/* Glowing Amber Eyes */}
              <ellipse cx="110" cy="160" rx="8.5" ry="5" fill="#FBBF24" transform="rotate(-15 110 160)" />
              <circle cx="110" cy="160" r="2.8" fill="#111827" />

              {/* Sharp Fangs (Upper & Lower) */}
              <polygon points="78,194 84,214 88,196" fill="#FFF7FB" />
              <polygon points="90,196 94,214 98,198" fill="#FFF7FB" />
              <polygon points="80,210 83,202 86,210" fill="#FFF7FB" />

              {/* Whiskers */}
              <line x1="52" y1="184" x2="16" y2="178" stroke="#FFF7FB" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              <line x1="54" y1="190" x2="12" y2="192" stroke="#FFF7FB" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              <line x1="56" y1="196" x2="18" y2="206" stroke="#FFF7FB" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

              {/* Muscle Contour Highlights */}
              <path
                d="M180 140 C235 120, 285 130, 325 170"
                stroke="#C084FC"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.65"
              />
              <path
                d="M210 180 C255 170, 295 185, 315 220"
                stroke="#A855F7"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};
