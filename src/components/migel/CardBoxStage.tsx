import React, { useMemo, useRef, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { SUIT_META } from '../../lib/migelData';
import type { MigelCard, SuitType } from '../../types/migel';
import { PlayingCard3D } from './PlayingCard3D';

interface CardBoxStageProps {
  mode: 'deck' | 'pick';
  boxOpened: boolean;
  allCards: MigelCard[];
  discoveredIds: number[];
  onOpenGift: () => void;
  onBoxClick: () => void;
  onShakeBox: () => void;
  onSelectCard: (card: MigelCard) => void;
  onHoverCard?: () => void;
  onDragStart?: () => void;
}

interface FanSlot {
  x: number;
  y: number;
  rot: number;
  z: number;
  scale: number;
  floatDur: string;
}

const FAN_SLOTS_DESKTOP: FanSlot[] = [
  { x: -245, y: -158, rot: -18, z: 12, scale: 0.92, floatDur: '4.8s' },
  { x: -128, y: -204, rot: -9, z: 16, scale: 0.96, floatDur: '4.1s' },
  { x: 0, y: -222, rot: 0, z: 22, scale: 1.0, floatDur: '3.9s' },
  { x: 128, y: -204, rot: 9, z: 16, scale: 0.96, floatDur: '4.4s' },
  { x: 245, y: -158, rot: 18, z: 12, scale: 0.92, floatDur: '5.1s' },
];

const FAN_SLOTS_MOBILE: FanSlot[] = [
  { x: -102, y: -148, rot: -14, z: 12, scale: 0.72, floatDur: '4.6s' },
  { x: -50, y: -178, rot: -7, z: 15, scale: 0.75, floatDur: '4.1s' },
  { x: 0, y: -192, rot: 0, z: 20, scale: 0.78, floatDur: '3.8s' },
  { x: 50, y: -178, rot: 7, z: 15, scale: 0.75, floatDur: '4.3s' },
  { x: 102, y: -148, rot: 14, z: 12, scale: 0.72, floatDur: '4.9s' },
];

export const CardBoxStage: React.FC<CardBoxStageProps> = ({
  mode,
  boxOpened,
  allCards,
  discoveredIds,
  onOpenGift,
  onBoxClick,
  onShakeBox,
  onSelectCard,
  onHoverCard,
  onDragStart,
}) => {
  const [suitFilter, setSuitFilter] = useState<'all' | 'unread' | SuitType>('all');
  const [deckOffset, setDeckOffset] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [boxTilt, setBoxTilt] = useState({ rx: 0, ry: 0 });
  const [dragState, setDragState] = useState<{
    cardId: number | null;
    dx: number;
    dy: number;
  }>({ cardId: null, dx: 0, dy: 0 });

  const pointerStartRef = useRef<{
    cardId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const filteredPool = useMemo(() => {
    let pool = allCards;
    if (suitFilter === 'unread') {
      const unread = allCards.filter((c) => !discoveredIds.includes(c.id));
      pool = unread.length > 0 ? unread : allCards;
    } else if (suitFilter !== 'all') {
      pool = allCards.filter((c) => c.suit === suitFilter);
    }
    return pool;
  }, [allCards, discoveredIds, suitFilter]);

  const visibleCards = useMemo(() => {
    const count = Math.min(5, filteredPool.length);
    const slice: MigelCard[] = [];
    for (let i = 0; i < count; i++) {
      slice.push(filteredPool[(deckOffset + i) % filteredPool.length]);
    }
    return slice;
  }, [filteredPool, deckOffset]);

  const handleShuffle = () => {
    setIsShaking(true);
    onShakeBox();
    window.setTimeout(() => {
      setDeckOffset((prev) => (prev + 3) % Math.max(1, filteredPool.length));
      setHighlightedIndex(2);
      setIsShaking(false);
    }, 420);
    window.setTimeout(() => {
      setHighlightedIndex(null);
    }, 1800);
  };

  const handleStageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setBoxTilt({ rx: ny, ry: nx });
  };

  const handleCardPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    card: MigelCard
  ) => {
    if (!boxOpened) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartRef.current = {
      cardId: card.id,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    setDragState({ cardId: card.id, dx: 0, dy: 0 });
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const active = pointerStartRef.current;
    if (!active) return;
    const dx = e.clientX - active.startX;
    const dy = e.clientY - active.startY;
    if (Math.hypot(dx, dy) > 8 && !active.moved) {
      active.moved = true;
      onDragStart?.();
    }
    setDragState({ cardId: active.cardId, dx, dy });
  };

  const handleCardPointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    card: MigelCard
  ) => {
    const active = pointerStartRef.current;
    if (!active || active.cardId !== card.id) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    const dist = Math.hypot(dragState.dx, dragState.dy);
    pointerStartRef.current = null;
    setDragState({ cardId: null, dx: 0, dy: 0 });

    // Select card if clicked cleanly (< 10px) or pulled out from the box (> 52px)
    if (!active.moved || dist > 52 || dist < 10) {
      onSelectCard(card);
    }
  };

  return (
    <section
      onPointerMove={handleStageMove}
      onPointerLeave={() => setBoxTilt({ rx: 0, ry: 0 })}
      className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-12 pt-4 sm:pt-6"
    >
      {/* Editorial Hero Header (Screen 01 / Deck Entry) */}
      <div className="max-w-2xl text-center">
        <p className="font-editorial uppercase tracking-[0.26em] text-xs sm:text-sm text-[#963B65]">
          Special Keepsake Deck · 20 Collectible Cards
        </p>
        <h1 className="font-editorial mt-2 text-4xl font-semibold tracking-wide text-[#642B48] sm:text-5xl md:text-6xl">
          A LITTLE DECK FOR MIGEL <span className="text-[#C76A91]">♡</span>
        </h1>
        <p className="font-serif-body italic mt-3 text-base text-[#963B65] sm:text-lg">
          “A little collection of cards, filled with little things I want you to remember.”
        </p>
        <p className="font-serif-body mt-1.5 text-xs sm:text-sm text-[#642B48]/80">
          {boxOpened
            ? 'Hover a card, click, or gently drag one straight out of the box — then flip it over.'
            : 'Pick a card, flip it over, and discover a little surprise waiting just for you.'}
        </p>
      </div>

      {/* Filter & Box Controls (Visible in Pick Mode / Once Opened) */}
      {boxOpened && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-y border-[#C76A91]/25 py-2.5 px-4">
          {(
            [
              { id: 'all', label: 'All Cards (20)' },
              { id: 'unread', label: `Unopened (${20 - discoveredIds.length})` },
              { id: 'hearts', label: '♥ Hearts' },
              { id: 'diamonds', label: '♦ Diamonds' },
              { id: 'clubs', label: '♣ Clubs' },
              { id: 'spades', label: '♠ Spades' },
            ] as const
          ).map((item) => {
            const active = suitFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSuitFilter(item.id);
                  setDeckOffset(0);
                }}
                className={`min-h-[36px] cursor-pointer whitespace-nowrap font-editorial text-sm tracking-wide transition-colors ${
                  active
                    ? 'text-[#963B65] font-semibold underline decoration-[#C76A91] decoration-2 underline-offset-4'
                    : 'text-[#642B48]/70 hover:text-[#963B65]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ================= 3D CARD BOX & FLOATING EMERGING CARDS STAGE ================= */}
      <div
        className={`relative flex w-full max-w-4xl items-end justify-center transition-all duration-700 ${
          boxOpened
            ? 'mt-28 sm:mt-40 min-h-[350px] sm:min-h-[430px]'
            : 'mt-16 sm:mt-20 min-h-[300px] sm:min-h-[340px]'
        }`}
      >
        {/* Soft Rose Ambient Halo Behind Box */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full opacity-60 blur-3xl sm:h-72 sm:w-[420px]"
          style={{
            background:
              'radial-gradient(circle, rgba(242,175,203,0.85) 0%, rgba(232,199,168,0.45) 55%, transparent 78%)',
          }}
        />

        {/* EMERGING FLOATING CARDS (Fan out dynamically when box is open) */}
        <div
          aria-hidden={!boxOpened}
          className={`perspective-1400 pointer-events-none absolute bottom-[125px] sm:bottom-[145px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center transition-all duration-700 ${
            boxOpened ? 'opacity-100 scale-100' : 'opacity-0 scale-75 translate-y-24'
          }`}
        >
          {visibleCards.map((card, idx) => {
            const desktopSlot = FAN_SLOTS_DESKTOP[idx] || FAN_SLOTS_DESKTOP[2];
            const mobileSlot = FAN_SLOTS_MOBILE[idx] || FAN_SLOTS_MOBILE[2];
            const isDraggingThis = dragState.cardId === card.id;
            const isHighlighted = highlightedIndex === idx;
            const discovered = discoveredIds.includes(card.id);

            return (
              <div
                key={`${card.id}-${idx}`}
                className="pointer-events-auto absolute transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  zIndex: isDraggingThis ? 60 : isHighlighted ? 45 : desktopSlot.z,
                  transform: isDraggingThis
                    ? `translate(${desktopSlot.x + dragState.dx}px, ${
                        desktopSlot.y + dragState.dy - 24
                      }px) rotate(${dragState.dx * 0.06}deg) scale(1.06)`
                    : undefined,
                }}
              >
                {/* Responsive desktop vs mobile position wrapper */}
                <div
                  onPointerDown={(e) => handleCardPointerDown(e, card)}
                  onPointerMove={handleCardPointerMove}
                  onPointerUp={(e) => handleCardPointerUp(e, card)}
                  onPointerEnter={() => onHoverCard?.()}
                  style={
                    isDraggingThis
                      ? undefined
                      : ({
                          '--dx': `${desktopSlot.x}px`,
                          '--dy': `${desktopSlot.y - (isHighlighted ? 34 : 0)}px`,
                          '--drot': `${desktopSlot.rot}deg`,
                          '--dscale': desktopSlot.scale,
                          '--mx': `${mobileSlot.x}px`,
                          '--my': `${mobileSlot.y - (isHighlighted ? 24 : 0)}px`,
                          '--mrot': `${mobileSlot.rot}deg`,
                          '--mscale': mobileSlot.scale,
                          '--float-dur': desktopSlot.floatDur,
                        } as React.CSSProperties)
                  }
                  className={`touch-none cursor-grab active:cursor-grabbing ${
                    isDraggingThis
                      ? ''
                      : '[transform:translate(var(--mx),var(--my))_rotate(var(--mrot))_scale(var(--mscale))] sm:[transform:translate(var(--dx),var(--dy))_rotate(var(--drot))_scale(var(--dscale))] transition-transform duration-500 hover:z-50'
                  }`}
                >
                  <div className={isDraggingThis ? '' : 'animate-card-float'}>
                    <PlayingCard3D
                      card={card}
                      isFlipped={false}
                      isDiscovered={discovered}
                      size="md"
                      interactiveHover={boxOpened}
                      showPickHint={boxOpened}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 3D COLLECTIBLE POKER CARD BOX ================= */}
        <div
          className={`perspective-1000 relative z-30 mb-2 flex flex-col items-center ${
            isShaking ? 'animate-box-shake' : ''
          }`}
        >
          <div
            onClick={() => {
              if (!boxOpened) {
                onOpenGift();
              } else {
                onBoxClick();
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!boxOpened) onOpenGift();
                else onBoxClick();
              }
            }}
            aria-label={
              boxOpened
                ? 'Migel collectible card box — click to shuffle and lift cards'
                : 'Migel collectible card box — click to open your gift'
            }
            className="preserve-3d group relative h-[250px] w-[198px] sm:h-[282px] sm:w-[224px] cursor-pointer transition-transform duration-500 ease-out"
            style={{
              transform: `rotateX(${boxTilt.rx}deg) rotateY(${boxTilt.ry - 8}deg)`,
            }}
          >
            {/* Box Right 3D Side Thickness Panel */}
            <div
              className="cardbox-side-surface absolute top-2 -right-5 h-[calc(100%-8px)] w-6 origin-left rounded-r-lg border-y border-r border-[#FFF5F8]/25 shadow-xl"
              style={{
                transform: 'rotateY(74deg)',
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-[#F8C8DC]/60 text-[10px]">
                <span>♥</span>
                <span>♦</span>
                <span>♣</span>
                <span>♠</span>
              </div>
            </div>

            {/* Inner Velvet Card Stack Visible Inside Open Box */}
            <div
              className={`absolute inset-x-3 -top-3 h-10 rounded-t-md border border-[#C76A91]/40 bg-gradient-to-b from-[#FFF5F8] via-[#F8C8DC] to-[#F2AFCB] transition-all duration-500 ${
                boxOpened ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="mx-2 mt-1.5 h-1 rounded-full bg-[#C76A91]/25" />
              <div className="mx-2 mt-1 h-1 rounded-full bg-[#C76A91]/25" />
              <div className="mx-2 mt-1 h-1 rounded-full bg-[#C76A91]/20" />
            </div>

            {/* Hinged Top Box Lid */}
            <div
              className="cardbox-lid-surface preserve-3d absolute inset-x-0 -top-2 h-14 origin-bottom rounded-t-2xl border border-[#FFF5F8]/45 shadow-lg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: boxOpened
                  ? 'translateY(-14px) rotateX(122deg)'
                  : 'translateY(0px) rotateX(0deg)',
              }}
            >
              <div className="flex h-full items-center justify-center border-b border-[#642B48]/20">
                <span className="font-editorial uppercase tracking-[0.26em] text-[10px] text-[#642B48]/85">
                  ♡ For Migel ♡
                </span>
              </div>
            </div>

            {/* Front Box Face */}
            <div className="cardbox-dusty-surface relative z-20 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#FFF5F8]/55 p-3.5 shadow-[0_28px_52px_-12px_rgba(100,43,72,0.45)]">
              {/* Embossed Paper Texture Highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.65), transparent 55%)',
                }}
              />

              {/* Ornamental Gold-Rose Border Frame */}
              <div className="relative flex flex-1 flex-col items-center justify-between rounded-xl border border-[#FFF5F8]/60 bg-[#963B65]/15 p-3 text-center">
                {/* Corner Stars */}
                <span className="absolute top-1.5 left-2 text-[10px] text-[#E8C7A8]">✦</span>
                <span className="absolute top-1.5 right-2 text-[10px] text-[#E8C7A8]">✦</span>
                <span className="absolute bottom-1.5 left-2 text-[10px] text-[#E8C7A8]">✦</span>
                <span className="absolute bottom-1.5 right-2 text-[10px] text-[#E8C7A8]">✦</span>

                <p className="font-editorial uppercase tracking-[0.24em] text-[9px] sm:text-[10px] text-[#FFF5F8]/95">
                  Edition N° 01
                </p>

                {/* Central Heart Crest & MIGEL Lettering */}
                <div className="my-auto flex flex-col items-center">
                  <div className="mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-[#E8C7A8]/80 bg-[#FFF5F8]/20 shadow-inner">
                    <span className="text-xl text-[#FFF5F8] drop-shadow">♥</span>
                  </div>
                  <span className="font-script text-2xl sm:text-3xl text-[#FFF5F8] drop-shadow-[0_2px_4px_rgba(100,43,72,0.35)]">
                    A Little Deck
                  </span>
                  <span className="font-editorial mt-0.5 text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#FFF5F8]">
                    MIGEL
                  </span>
                  <div className="mt-1.5 h-px w-16 bg-[#E8C7A8]/70" />
                  <span className="font-editorial mt-1.5 text-[10px] uppercase tracking-[0.2em] text-[#FFF5F8]/85">
                    20 Sweet Reminders
                  </span>
                </div>

                {/* Bottom Suits */}
                <div className="flex items-center gap-2.5 text-xs text-[#FFF5F8]/85">
                  <span>{SUIT_META.hearts.symbol}</span>
                  <span>{SUIT_META.diamonds.symbol}</span>
                  <span>{SUIT_META.clubs.symbol}</span>
                  <span>{SUIT_META.spades.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ground Contact Shadow */}
          <div
            aria-hidden="true"
            className="mt-2 h-4 w-44 rounded-full bg-[#642B48]/25 blur-md sm:w-52"
          />
        </div>
      </div>

      {/* Primary Action Controls Below Box */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {!boxOpened || mode === 'deck' ? (
          <button
            type="button"
            onClick={onOpenGift}
            className="min-h-[48px] cursor-pointer rounded-full border border-[#E8C7A8]/70 bg-gradient-to-r from-[#C76A91] via-[#963B65] to-[#C76A91] px-8 py-3 font-editorial text-base sm:text-lg font-semibold tracking-[0.16em] text-[#FFF5F8] shadow-[0_14px_30px_rgba(150,59,101,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(150,59,101,0.45)] active:translate-y-0"
          >
            OPEN YOUR GIFT ♡
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleShuffle}
              className="min-h-[44px] inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#C76A91]/50 bg-[#FFF5F8]/85 px-6 py-2.5 font-editorial text-sm sm:text-base font-semibold tracking-wider text-[#963B65] shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#963B65] hover:bg-[#FFF5F8]"
            >
              <RefreshCw className={`h-4 w-4 ${isShaking ? 'animate-spin' : ''}`} />
              Shake Box & Draw New Cards
            </button>

            <button
              type="button"
              onClick={() => {
                const unread = allCards.filter((c) => !discoveredIds.includes(c.id));
                const pool = unread.length > 0 ? unread : allCards;
                const randomCard = pool[Math.floor(Math.random() * pool.length)];
                onSelectCard(randomCard);
              }}
              className="min-h-[44px] inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E8C7A8]/80 bg-gradient-to-r from-[#C76A91] to-[#963B65] px-6 py-2.5 font-editorial text-sm sm:text-base font-semibold tracking-wider text-[#FFF5F8] shadow-[0_10px_24px_rgba(150,59,101,0.28)] transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 text-[#E8C7A8]" />
              Surprise Me, Migel ♡
            </button>
          </>
        )}
      </div>
    </section>
  );
};
