import React, { useMemo, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SUIT_META } from '../../lib/migelData';
import type { MigelCard, SuitType } from '../../types/migel';
import { PlayingCard3D } from './PlayingCard3D';

interface CollectionGalleryScreenProps {
  allCards: MigelCard[];
  discoveredIds: number[];
  onSelectCard: (card: MigelCard) => void;
  onBackToDeck: () => void;
}

export const CollectionGalleryScreen: React.FC<CollectionGalleryScreenProps> = ({
  allCards,
  discoveredIds,
  onSelectCard,
  onBackToDeck,
}) => {
  const [filter, setFilter] = useState<'all' | SuitType>('all');

  const filteredCards = useMemo(() => {
    if (filter === 'all') return allCards;
    return allCards.filter((c) => c.suit === filter);
  }, [allCards, filter]);

  const discoveredCount = discoveredIds.length;
  const allFound = discoveredCount === allCards.length;

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:pt-8">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onBackToDeck}
          className="mb-3 min-h-[44px] inline-flex cursor-pointer items-center gap-1.5 font-editorial text-sm text-[#963B65] hover:text-[#642B48] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Card Box
        </button>

        <p className="font-editorial uppercase tracking-[0.24em] text-xs text-[#963B65]">
          Keepsake Album · {discoveredCount} of {allCards.length} Discovered
        </p>
        <h2 className="font-editorial mt-1.5 text-3xl font-semibold text-[#642B48] sm:text-4xl">
          Migel’s Card Collection <span className="text-[#C76A91]">♡</span>
        </h2>
        <p className="font-serif-body italic mt-2 max-w-lg text-sm text-[#963B65]">
          {allFound
            ? 'Every single reminder is yours now — come back whenever your heart needs a quiet smile.'
            : 'Unopened cards rest face down in blush pink. Click any card to reveal or revisit its reminder.'}
        </p>

        {/* Suit Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-[#C76A91]/25 py-2.5 px-4">
          {(
            [
              { id: 'all', label: `All (${allCards.length})` },
              { id: 'hearts', label: `${SUIT_META.hearts.symbol} Hearts` },
              { id: 'diamonds', label: `${SUIT_META.diamonds.symbol} Diamonds` },
              { id: 'clubs', label: `${SUIT_META.clubs.symbol} Clubs` },
              { id: 'spades', label: `${SUIT_META.spades.symbol} Spades` },
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`min-h-[36px] cursor-pointer whitespace-nowrap font-editorial text-sm tracking-wide transition-colors ${
                  active
                    ? 'text-[#963B65] font-semibold underline decoration-[#C76A91] decoration-2 underline-offset-4'
                    : 'text-[#642B48]/70 hover:text-[#963B65]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 20-Card Gallery Grid */}
      <div className="mt-9 grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredCards.map((card) => {
          const discovered = discoveredIds.includes(card.id);
          const isSecret = card.rarity === 'secret';
          const isRare = card.rarity === 'rare';

          return (
            <div key={card.id} className="flex flex-col items-center">
              {discovered ? (
                <button
                  type="button"
                  onClick={() => onSelectCard(card)}
                  className="group cursor-pointer text-left focus:outline-none"
                  aria-label={`Revisit card ${card.cardNumberLabel}: ${card.title}`}
                >
                  <PlayingCard3D
                    card={card}
                    isFlipped={false}
                    isDiscovered={true}
                    size="sm"
                    interactiveHover={true}
                  />
                </button>
              ) : (
                /* Sealed Unopened Card Back */
                <button
                  type="button"
                  onClick={() => onSelectCard(card)}
                  className={`group relative h-[212px] w-[146px] cursor-pointer rounded-[18px] border-[1.5px] p-2.5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_36px_rgba(150,59,101,0.28)] vintage-card-back ${
                    isSecret
                      ? 'border-[#E8C7A8] shadow-[0_12px_28px_rgba(232,199,168,0.45)]'
                      : isRare
                        ? 'border-[#E8C7A8]/80'
                        : 'border-[#FFF5F8]/85'
                  }`}
                  aria-label={`Open sealed card ${card.cardNumberLabel}`}
                >
                  <div className="flex h-full w-full flex-col items-center justify-between rounded-[12px] border border-dashed border-[#963B65]/40 bg-[#FFF5F8]/45 p-2.5 text-center">
                    <span className="font-mono-num text-[10px] text-[#963B65]/75">
                      {card.cardNumberLabel}
                    </span>

                    <div className="flex flex-col items-center gap-1.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C76A91]/50 bg-[#FFF5F8]/80 text-base text-[#963B65] transition-transform duration-300 group-hover:scale-110">
                        {isSecret ? <Sparkles className="h-4 w-4 text-[#C9966B]" /> : '♡'}
                      </span>
                      <span className="font-editorial text-xs italic text-[#642B48]">
                        {isSecret ? 'Secret Card' : 'Sealed for Migel'}
                      </span>
                    </div>

                    <span className="font-editorial uppercase tracking-[0.16em] text-[9px] text-[#963B65]/80">
                      Tap to Open
                    </span>
                  </div>
                </button>
              )}

              {/* Caption Below Each Card */}
              <div className="mt-2.5 text-center max-w-[146px]">
                <p className="font-editorial text-sm font-medium text-[#642B48] truncate">
                  {discovered ? card.title : `Mystery Card ${card.cardNumberLabel}`}
                </p>
                <p className="font-editorial text-[11px] text-[#963B65]/80">
                  {discovered
                    ? `${SUIT_META[card.suit].symbol} ${
                        card.rarity === 'secret'
                          ? 'Secret'
                          : card.rarity === 'rare'
                            ? 'Rare Foil'
                            : SUIT_META[card.suit].name
                      }`
                    : `${SUIT_META[card.suit].symbol} Unopened`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
