import React, { useMemo } from 'react';
import { ArrowLeft, ArrowRight, Grid2X2, RotateCw, Sparkles } from 'lucide-react';
import { SUIT_META } from '../../lib/migelData';
import type { MigelCard } from '../../types/migel';
import { PlayingCard3D } from './PlayingCard3D';

interface ReminderRevealScreenProps {
  card: MigelCard;
  isFlipped: boolean;
  justDiscoveredSecret: boolean;
  justDiscoveredRare: boolean;
  onFlipToggle: () => void;
  onPrevCard: () => void;
  onNextCard: () => void;
  onBackToDeck: () => void;
  onOpenCollection: () => void;
}

interface BurstSpec {
  id: number;
  bx: string;
  by: string;
  brot: string;
  bdur: string;
  symbol: string;
  color: string;
}

export const ReminderRevealScreen: React.FC<ReminderRevealScreenProps> = ({
  card,
  isFlipped,
  justDiscoveredSecret,
  justDiscoveredRare,
  onFlipToggle,
  onPrevCard,
  onNextCard,
  onBackToDeck,
  onOpenCollection,
}) => {
  const suitMeta = SUIT_META[card.suit];
  const isSecret = card.rarity === 'secret';
  const isRare = card.rarity === 'rare';

  const burstParticles = useMemo<BurstSpec[]>(() => {
    const count = isSecret ? 26 : isRare ? 16 : 10;
    return Array.from({ length: count }, (_, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const radius = isSecret ? 145 + (idx % 3) * 40 : 105 + (idx % 3) * 30;
      const bx = `${Math.round(Math.cos(angle) * radius)}px`;
      const by = `${Math.round(Math.sin(angle) * radius - 35)}px`;
      const symbols = isSecret
        ? ['♡', '✦', '♥', '★']
        : isRare
          ? ['✦', '♡', '♥']
          : ['♡', '✦'];
      const colors = isSecret
        ? ['#E8C7A8', '#963B65', '#F2AFCB', '#C76A91']
        : ['#C76A91', '#963B65', '#E8C7A8'];
      return {
        id: idx,
        bx,
        by,
        brot: `${(idx % 2 === 0 ? 1 : -1) * (120 + idx * 14)}deg`,
        bdur: `${1.1 + (idx % 4) * 0.22}s`,
        symbol: symbols[idx % symbols.length],
        color: colors[idx % colors.length],
      };
    });
  }, [isSecret, isRare]);

  return (
    <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-16 pt-4 sm:pt-8">
      {/* Top Status & Return Link */}
      <div className="mb-5 flex w-full max-w-xl items-center justify-between text-xs sm:text-sm">
        <button
          type="button"
          onClick={onBackToDeck}
          className="min-h-[44px] inline-flex cursor-pointer items-center gap-1.5 font-editorial text-[#963B65] hover:text-[#642B48] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Card Box
        </button>

        <span className="font-mono-num text-[#963B65]/80">
          Card {card.cardNumberLabel} · {suitMeta.symbol} {suitMeta.name}
        </span>
      </div>

      {/* Special Secret / Rare Discovery Banner */}
      {isFlipped && (justDiscoveredSecret || isSecret) && (
        <div className="mb-5 text-center animate-fade-in">
          <p className="font-editorial inline-flex items-center gap-2 text-sm sm:text-base font-semibold tracking-[0.22em] text-[#963B65] uppercase">
            <Sparkles className="h-4 w-4 text-[#C9966B]" />
            MIGEL FOUND THE SECRET CARD! ♡
            <Sparkles className="h-4 w-4 text-[#C9966B]" />
          </p>
        </div>
      )}

      {isFlipped && !isSecret && (justDiscoveredRare || isRare) && (
        <div className="mb-5 text-center">
          <p className="font-editorial inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#A26845] uppercase">
            ✦ Rare Foil Keepsake Card ✦
          </p>
        </div>
      )}

      {/* Pre-flip Invitation */}
      <div className="mb-6 text-center max-w-md">
        <p className="font-serif-body italic text-base sm:text-lg text-[#642B48]">
          {isFlipped
            ? `${card.title} — ${suitMeta.theme}`
            : 'A little surprise is waiting for you, Migel...'}
        </p>
      </div>

      {/* Centered 3D Flippable Playing Card + Particle Burst */}
      <div className="relative flex items-center justify-center">
        {/* Heart / Sparkle Burst when Flipped */}
        {isFlipped && (
          <div
            key={`burst-${card.id}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
          >
            {burstParticles.map((p) => (
              <span
                key={p.id}
                className="animate-burst-particle absolute text-base sm:text-xl select-none"
                style={
                  {
                    color: p.color,
                    '--bx': p.bx,
                    '--by': p.by,
                    '--brot': p.brot,
                    '--bdur': p.bdur,
                  } as React.CSSProperties
                }
              >
                {p.symbol}
              </span>
            ))}
          </div>
        )}

        <div
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.015]"
          onClick={onFlipToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFlipToggle();
            }
          }}
          aria-label={
            isFlipped
              ? 'Flip card back to artwork side'
              : 'Flip your card to reveal Migel’s reminder'
          }
        >
          <PlayingCard3D card={card} isFlipped={isFlipped} size="lg" />
        </div>
      </div>

      {/* Primary Flip CTA & Navigation Controls */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onFlipToggle}
          className="min-h-[48px] inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-[#E8C7A8]/80 bg-gradient-to-r from-[#C76A91] via-[#963B65] to-[#C76A91] px-8 py-3 font-editorial text-base sm:text-lg font-semibold tracking-[0.16em] text-[#FFF5F8] shadow-[0_14px_30px_rgba(150,59,101,0.32)] transition-all hover:-translate-y-0.5"
        >
          <RotateCw className="h-4 w-4" />
          {isFlipped ? 'VIEW CARD ARTWORK' : 'FLIP YOUR CARD ♡'}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-1">
          <button
            type="button"
            onClick={onPrevCard}
            className="min-h-[44px] inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C76A91]/40 bg-[#FFF5F8]/80 px-5 py-2 font-editorial text-sm text-[#642B48] hover:border-[#963B65] hover:text-[#963B65] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous Card
          </button>

          <button
            type="button"
            onClick={onOpenCollection}
            className="min-h-[44px] inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C76A91]/40 bg-[#FFF5F8]/80 px-5 py-2 font-editorial text-sm text-[#963B65] hover:border-[#963B65] transition-colors"
          >
            <Grid2X2 className="h-3.5 w-3.5" />
            View Collection
          </button>

          <button
            type="button"
            onClick={onNextCard}
            className="min-h-[44px] inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C76A91]/40 bg-[#FFF5F8]/80 px-5 py-2 font-editorial text-sm text-[#642B48] hover:border-[#963B65] hover:text-[#963B65] transition-colors"
          >
            Next Card
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
