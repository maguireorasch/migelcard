import React from 'react';
import type { CardRarity, MigelCard } from '../../types/migel';

interface VintageCardArtworkProps {
  motif: MigelCard['artworkMotif'];
  rarity: CardRarity;
  suit: MigelCard['suit'];
}

export const VintageCardArtwork: React.FC<VintageCardArtworkProps> = ({
  motif,
  rarity,
  suit,
}) => {
  const isRare = rarity === 'rare';
  const isSecret = rarity === 'secret';
  const accentStroke = isSecret || isRare ? '#C9966B' : '#C76A91';
  const primaryFill = isSecret ? '#B83D72' : '#963B65';
  const softFill = isSecret ? '#FCE0EC' : '#F8C8DC';

  return (
    <svg
      viewBox="0 0 120 132"
      className="w-full h-full drop-shadow-[0_2px_6px_rgba(150,59,101,0.12)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vintage Arch Frame Behind Motif */}
      <path
        d="M16 112 V54 C16 28 36 12 60 12 C84 12 104 28 104 54 V112"
        stroke={accentStroke}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <circle
        cx="60"
        cy="64"
        r="34"
        fill={softFill}
        fillOpacity="0.45"
        stroke={accentStroke}
        strokeWidth="1"
      />

      {/* Top Celestial Star */}
      <path
        d="M60 19 L62 24 L67 26 L62 28 L60 33 L58 28 L53 26 L58 24 Z"
        fill={isRare || isSecret ? '#E8C7A8' : '#C76A91'}
      />

      {/* Motif-specific Vintage Romantic Line Art */}
      {(motif === 'rose-heart' || motif === 'laurel-heart') && (
        <g>
          <path
            d="M60 90 C60 90 32 72 32 52 C32 42 40 35 49 35 C54 35 58 38 60 42 C62 38 66 35 71 35 C80 35 88 42 88 52 C88 72 60 90 60 90 Z"
            fill={primaryFill}
            fillOpacity="0.88"
            stroke="#642B48"
            strokeWidth="1.5"
          />
          <path
            d="M44 50 C44 45 48 42 52 43"
            stroke="#FFF5F8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M36 86 C42 94 52 98 60 98 C68 98 78 94 84 86"
            stroke={accentStroke}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {(motif === 'sunbeam-locket' || motif === 'pearl-mirror') && (
        <g>
          <circle
            cx="60"
            cy="64"
            r="20"
            fill="#FFF5F8"
            stroke={primaryFill}
            strokeWidth="1.8"
          />
          <circle
            cx="60"
            cy="64"
            r="15"
            fill={softFill}
            stroke={accentStroke}
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path
            d="M60 72 C60 72 51 66 51 59 C51 55.5 54 53 57 53 C58.8 53 59.6 54.2 60 55.3 C60.4 54.2 61.2 53 63 53 C66 53 69 55.5 69 59 C69 66 60 72 60 72 Z"
            fill={primaryFill}
          />
          <path d="M60 36 V44" stroke={primaryFill} strokeWidth="1.8" />
          <circle cx="60" cy="34" r="3" stroke={primaryFill} strokeWidth="1.5" />
        </g>
      )}

      {(motif === 'ribbon-teacup' || motif === 'moonlit-mug') && (
        <g>
          <path
            d="M40 58 H76 V72 C76 82 68 89 58 89 C48 89 40 82 40 72 V58 Z"
            fill="#FFF5F8"
            stroke={primaryFill}
            strokeWidth="1.7"
          />
          <path
            d="M76 62 H82 C85 62 87 65 87 68 C87 72 84 74 80 74 H75"
            stroke={primaryFill}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <ellipse cx="58" cy="91" rx="22" ry="3.5" fill={softFill} stroke={primaryFill} strokeWidth="1.3" />
          <path d="M51 44 C49 48 53 51 51 54" stroke={accentStroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M62 42 C60 46 64 50 62 54" stroke={accentStroke} strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M58 77 C58 77 52 72.5 52 68.5 C52 66.5 53.6 65 55.5 65 C56.8 65 57.6 65.8 58 66.7 C58.4 65.8 59.2 65 60.5 65 C62.4 65 64 66.5 64 68.5 C64 72.5 58 77 58 77 Z"
            fill={primaryFill}
          />
        </g>
      )}

      {(motif === 'velvet-bow' || motif === 'silk-envelope') && (
        <g>
          <rect
            x="34"
            y="49"
            width="52"
            height="34"
            rx="4"
            fill="#FFF5F8"
            stroke={primaryFill}
            strokeWidth="1.7"
          />
          <path d="M35 51 L60 70 L85 51" stroke={primaryFill} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="60" cy="69" r="6" fill={primaryFill} />
          <path
            d="M60 72 C60 72 56.5 69.5 56.5 67.5 C56.5 66.5 57.3 65.7 58.3 65.7 C59 65.7 59.6 66.2 60 66.8 C60.4 66.2 61 65.7 61.7 65.7 C62.7 65.7 63.5 66.5 63.5 67.5 C63.5 69.5 60 72 60 72 Z"
            fill="#FFF5F8"
          />
        </g>
      )}

      {(motif === 'swan-feather' || motif === 'butterfly-quill') && (
        <g>
          <path
            d="M40 88 C45 64 60 44 82 36 C78 54 68 72 44 86 Z"
            fill={softFill}
            stroke={primaryFill}
            strokeWidth="1.6"
          />
          <path d="M37 91 L79 39" stroke={primaryFill} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="77" cy="68" r="2.2" fill={accentStroke} />
          <circle cx="43" cy="52" r="2" fill={accentStroke} />
        </g>
      )}

      {(motif === 'starlight-crown' || motif === 'ruby-ring' || motif === 'garden-key' || motif === 'celestial-spark') && (
        <g>
          {/* Radiant Rare Gold-Pink Emblem */}
          <path
            d="M36 74 L42 48 L53 60 L60 42 L67 60 L78 48 L84 74 Z"
            fill="#E8C7A8"
            fillOpacity="0.65"
            stroke={primaryFill}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <rect x="36" y="74" width="48" height="7" rx="3" fill={primaryFill} />
          <circle cx="60" cy="40" r="3" fill="#E8C7A8" stroke={primaryFill} strokeWidth="1.2" />
          <circle cx="42" cy="46" r="2.5" fill="#E8C7A8" stroke={primaryFill} strokeWidth="1.2" />
          <circle cx="78" cy="46" r="2.5" fill="#E8C7A8" stroke={primaryFill} strokeWidth="1.2" />
          <path
            d="M60 69 C60 69 54.5 65 54.5 61.5 C54.5 59.5 56 58 57.8 58 C58.9 58 59.6 58.6 60 59.5 C60.4 58.6 61.1 58 62.2 58 C64 58 65.5 59.5 65.5 61.5 C65.5 65 60 69 60 69 Z"
            fill="#FFF5F8"
          />
        </g>
      )}

      {(motif === 'cloud-pillow' || motif === 'crescent-lantern') && (
        <g>
          <path
            d="M66 42 C53 42 44 52 44 64 C44 76 54 86 67 86 C73 86 78 83 82 79 C73 80 65 73 65 63 C65 53 71 45 80 43 C76 42.3 71 42 66 42 Z"
            fill="#FFF5F8"
            stroke={primaryFill}
            strokeWidth="1.7"
          />
          <path
            d="M42 74 C36 74 32 70 32 65 C32 60 36 56 41 56 C43 51 48 48 53 49"
            stroke={accentStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="79" cy="54" r="2" fill={primaryFill} />
          <circle cx="85" cy="64" r="1.5" fill={accentStroke} />
        </g>
      )}

      {(motif === 'cherry-blossom' || motif === 'blooming-compass' || motif === 'morning-tulip') && (
        <g>
          <circle cx="60" cy="52" r="9" fill={softFill} stroke={primaryFill} strokeWidth="1.4" />
          <circle cx="72" cy="61" r="9" fill={softFill} stroke={primaryFill} strokeWidth="1.4" />
          <circle cx="67" cy="75" r="9" fill={softFill} stroke={primaryFill} strokeWidth="1.4" />
          <circle cx="53" cy="75" r="9" fill={softFill} stroke={primaryFill} strokeWidth="1.4" />
          <circle cx="48" cy="61" r="9" fill={softFill} stroke={primaryFill} strokeWidth="1.4" />
          <circle cx="60" cy="64" r="7" fill={primaryFill} />
          <circle cx="60" cy="64" r="2.5" fill="#FFF5F8" />
        </g>
      )}

      {motif === 'secret-treasure' && (
        <g>
          {/* Secret Card Golden-Pink Celestial Heart Medallion */}
          <circle
            cx="60"
            cy="64"
            r="26"
            fill="url(#secretGlow)"
            stroke="#C9966B"
            strokeWidth="2"
          />
          <path
            d="M60 80 C60 80 41 67 41 54 C41 47.5 46 43 52 43 C55.6 43 58.6 45 60 48 C61.4 45 64.4 43 68 43 C74 43 79 47.5 79 54 C79 67 60 80 60 80 Z"
            fill="#963B65"
            stroke="#FFF5F8"
            strokeWidth="1.4"
          />
          <path
            d="M60 30 L62 35 L67 37 L62 39 L60 44 L58 39 L53 37 L58 35 Z"
            fill="#FFF5F8"
          />
          <path
            d="M32 62 L34 65 L37 67 L34 69 L32 72 L30 69 L27 67 L30 65 Z"
            fill="#E8C7A8"
          />
          <path
            d="M88 56 L90 59 L93 61 L90 63 L88 66 L86 63 L83 61 L86 59 Z"
            fill="#E8C7A8"
          />
          <defs>
            <radialGradient id="secretGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#FFF5F8" />
              <stop offset="65%" stopColor="#F8C8DC" />
              <stop offset="100%" stopColor="#E8C7A8" />
            </radialGradient>
          </defs>
        </g>
      )}

      {/* Subtle Bottom Suit Flourish */}
      <text
        x="60"
        y="113"
        textAnchor="middle"
        fill={primaryFill}
        fontSize="11"
        fontFamily="Cormorant Garamond, serif"
        letterSpacing="3"
      >
        {suit === 'hearts' && '♥  ♥  ♥'}
        {suit === 'diamonds' && '♦  ♦  ♦'}
        {suit === 'clubs' && '♣  ♣  ♣'}
        {suit === 'spades' && '♠  ♠  ♠'}
      </text>
    </svg>
  );
};
