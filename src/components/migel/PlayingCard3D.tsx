import React from 'react';
import { SUIT_META } from '../../lib/migelData';
import type { MigelCard } from '../../types/migel';
import { VintageCardArtwork } from './VintageCardArtwork';

interface PlayingCard3DProps {
  card: MigelCard;
  isFlipped: boolean;
  isDiscovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactiveHover?: boolean;
  showPickHint?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-[146px] h-[212px]',
  md: 'w-[196px] h-[284px] sm:w-[216px] sm:h-[312px]',
  lg: 'w-[280px] h-[408px] sm:w-[324px] sm:h-[468px]',
};

export const PlayingCard3D: React.FC<PlayingCard3DProps> = ({
  card,
  isFlipped,
  isDiscovered = false,
  size = 'md',
  interactiveHover = false,
  showPickHint = false,
  onClick,
  className = '',
}) => {
  const suitInfo = SUIT_META[card.suit];
  const isRare = card.rarity === 'rare';
  const isSecret = card.rarity === 'secret';

  const rarityBorder = isSecret
    ? 'secret-foil-card border-[#E8C7A8]'
    : isRare
      ? 'rare-foil-card border-[#E8C7A8]/90'
      : 'border-[#C76A91]/45';

  return (
    <div
      onClick={onClick}
      className={`perspective-1400 relative select-none ${SIZE_CLASSES[size]} ${
        interactiveHover ? 'group cursor-pointer' : ''
      } ${className}`}
    >
      {/* Hover "Pick me, Migel ♡" micro-caption */}
      {showPickHint && (
        <div
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-30"
        >
          <span className="font-script text-xl sm:text-2xl text-[#963B65] drop-shadow-[0_2px_6px_rgba(255,245,248,0.95)]">
            Pick me, Migel ♡
          </span>
        </div>
      )}

      {/* 3D Rotating Container */}
      <div
        className={`preserve-3d relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isFlipped ? 'rotate-y-180' : ''
        } ${
          interactiveHover
            ? 'group-hover:-translate-y-3 group-hover:scale-[1.04]'
            : ''
        }`}
      >
        {/* ================= CARD FRONT (Face-Up Vintage Illustration) ================= */}
        <div
          className={`backface-hidden vintage-card-front absolute inset-0 rounded-[18px] border-[1.5px] p-2.5 sm:p-3 overflow-hidden flex flex-col justify-between ${rarityBorder} ${
            interactiveHover
              ? 'group-hover:shadow-[0_24px_48px_rgba(150,59,101,0.34),0_0_24px_rgba(242,175,203,0.7)]'
              : ''
          }`}
        >
          {/* Foil Shimmer Sweep for Rare / Secret */}
          {(isRare || isSecret) && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
              <div
                className="animate-foil-sweep absolute inset-y-0 w-1/2 opacity-40"
                style={{
                  background: isSecret
                    ? 'linear-gradient(90deg, transparent, rgba(255,245,248,0.85), rgba(232,199,168,0.75), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(232,199,168,0.6), transparent)',
                }}
              />
            </div>
          )}

          {/* Inner Ornamental Frame */}
          <div
            className={`relative flex-1 rounded-[12px] border p-2 sm:p-2.5 flex flex-col justify-between ${
              isSecret
                ? 'border-[#C9966B]/80 bg-gradient-to-b from-[#FFF7FA]/75 to-[#F8C8DC]/25'
                : isRare
                  ? 'border-[#C9966B]/65'
                  : 'border-[#C76A91]/35'
            }`}
          >
            {/* Top Corner Rank + Card Number */}
            <div className="flex items-start justify-between leading-none">
              <div className="flex flex-col items-center text-[#963B65]">
                <span
                  className={`font-editorial font-semibold ${
                    size === 'sm'
                      ? 'text-sm'
                      : size === 'md'
                        ? 'text-lg'
                        : 'text-2xl'
                  }`}
                >
                  {card.rank}
                </span>
                <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>
                  {suitInfo.symbol}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono-num tracking-wider text-[#963B65]/80 ${
                    size === 'sm' ? 'text-[9px]' : 'text-[11px]'
                  }`}
                >
                  {card.cardNumberLabel}
                </span>
                {isSecret && (
                  <p className="font-editorial uppercase tracking-[0.18em] text-[8px] sm:text-[9px] text-[#963B65] font-semibold">
                    Secret ♡
                  </p>
                )}
                {isRare && !isSecret && (
                  <p className="font-editorial uppercase tracking-[0.18em] text-[8px] sm:text-[9px] text-[#A26845] font-semibold">
                    Rare Foil
                  </p>
                )}
              </div>
            </div>

            {/* Center Vintage Artwork */}
            <div
              className={`mx-auto flex items-center justify-center ${
                size === 'sm'
                  ? 'w-[84px] h-[92px]'
                  : size === 'md'
                    ? 'w-[122px] h-[134px]'
                    : 'w-[186px] h-[204px]'
              }`}
            >
              <VintageCardArtwork
                motif={card.artworkMotif}
                rarity={card.rarity}
                suit={card.suit}
              />
            </div>

            {/* Bottom Title + Inverted Corner Rank */}
            <div className="flex items-end justify-between gap-1 leading-none">
              <div className="min-w-0">
                <p
                  className={`font-editorial italic text-[#642B48] truncate ${
                    size === 'sm'
                      ? 'text-[11px]'
                      : size === 'md'
                        ? 'text-sm'
                        : 'text-lg'
                  }`}
                >
                  {card.title}
                </p>
                {size !== 'sm' && (
                  <p className="font-editorial uppercase tracking-[0.14em] text-[9px] text-[#963B65]/80 mt-0.5 truncate">
                    {suitInfo.theme}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center rotate-180 text-[#963B65] shrink-0">
                <span
                  className={`font-editorial font-semibold ${
                    size === 'sm'
                      ? 'text-sm'
                      : size === 'md'
                        ? 'text-lg'
                        : 'text-2xl'
                  }`}
                >
                  {card.rank}
                </span>
                <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>
                  {suitInfo.symbol}
                </span>
              </div>
            </div>

            {/* Subtle Corner Discovered Checkmark (Non-intrusive) */}
            {isDiscovered && size !== 'lg' && (
              <span
                title="Discovered by Migel"
                className="absolute bottom-1.5 left-2 font-editorial text-[10px] tracking-widest uppercase text-[#963B65]/75"
              >
                ✓ Read
              </span>
            )}
          </div>
        </div>

        {/* ================= CARD BACK (Blush Pink Reminder Reveal) ================= */}
        <div
          className={`backface-hidden rotate-y-180 vintage-card-back absolute inset-0 rounded-[18px] border-[1.5px] p-2.5 sm:p-3 overflow-hidden flex flex-col ${
            isSecret
              ? 'secret-foil-card border-[#E8C7A8]'
              : isRare
                ? 'rare-foil-card border-[#E8C7A8]/90'
                : 'border-[#FFF5F8]/85'
          }`}
        >
          {/* Ornamental Blush-Pink Inner Border */}
          <div className="relative flex-1 rounded-[12px] border border-[#963B65]/35 bg-[#FFF5F8]/70 backdrop-blur-[2px] p-3 sm:p-4 flex flex-col justify-between text-center">
            {/* Corner Decorative Stars */}
            <span className="absolute top-2 left-2.5 text-[#C76A91] text-xs">✦</span>
            <span className="absolute top-2 right-2.5 text-[#C76A91] text-xs">✦</span>
            <span className="absolute bottom-2 left-2.5 text-[#C76A91] text-xs">✦</span>
            <span className="absolute bottom-2 right-2.5 text-[#C76A91] text-xs">✦</span>

            {/* Top Header */}
            <div className="pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[#963B65]">
                <span className="text-[11px]">♡</span>
                <span className="font-mono-num text-[10px] tracking-widest text-[#963B65]/75">
                  {card.cardNumberLabel}
                </span>
                <span className="text-[11px]">♡</span>
              </div>
              <p
                className={`font-editorial uppercase tracking-[0.18em] text-[#963B65] font-semibold mt-1 ${
                  size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[9px]' : 'text-[11px]'
                }`}
              >
                A LITTLE REMINDER FOR MIGEL ♡
              </p>
              <div className="mx-auto mt-2 h-px w-16 bg-gradient-to-r from-transparent via-[#C76A91]/60 to-transparent" />
            </div>

            {/* Centered Message */}
            <div className="my-auto px-1 sm:px-2 flex flex-col items-center justify-center">
              <div className="mb-2 text-[#C76A91] opacity-85">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path
                    d="M12 18C12 18 3 12 3 6.5C3 3.8 5.1 2 7.6 2C9.3 2 10.9 2.9 12 4.4C13.1 2.9 14.7 2 16.4 2C18.9 2 21 3.8 21 6.5C21 12 12 18 12 18Z"
                    fill="#F2AFCB"
                    stroke="#963B65"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>

              <p
                className={`font-serif-body italic leading-relaxed text-[#642B48] transition-opacity duration-700 ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                } ${
                  size === 'sm'
                    ? 'text-[11px]'
                    : size === 'md'
                      ? 'text-sm'
                      : 'text-lg sm:text-xl leading-[1.65]'
                }`}
              >
                “{card.message}”
              </p>
            </div>

            {/* Bottom Keepsake Signature */}
            <div className="pb-0.5">
              <div className="mx-auto mb-2 h-px w-14 bg-gradient-to-r from-transparent via-[#C76A91]/50 to-transparent" />
              <p
                className={`font-editorial italic text-[#963B65] ${
                  size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[11px]' : 'text-sm'
                }`}
              >
                Keep this little reminder close to your heart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
