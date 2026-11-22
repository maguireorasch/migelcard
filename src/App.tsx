import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { CardBoxStage } from './components/migel/CardBoxStage';
import { CollectionGalleryScreen } from './components/migel/CollectionGalleryScreen';
import { ReminderRevealScreen } from './components/migel/ReminderRevealScreen';
import { RomanticAtmosphere } from './components/migel/RomanticAtmosphere';
import { migelAudio } from './lib/migelAudio';
import { MIGEL_CARDS } from './lib/migelData';
import { clearMigelState, loadMigelState, saveMigelState } from './lib/migelStorage';
import type { MigelCard, ScreenId } from './types/migel';

export function App() {
  const initialState = useMemo(() => loadMigelState(), []);

  const [screen, setScreen] = useState<ScreenId>(
    initialState.boxOpened ? 'pick' : 'deck'
  );
  const [boxOpened, setBoxOpened] = useState<boolean>(initialState.boxOpened);
  const [discoveredIds, setDiscoveredIds] = useState<number[]>(
    initialState.discoveredIds
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    initialState.soundEnabled
  );
  const [selectedCard, setSelectedCard] = useState<MigelCard>(
    () =>
      MIGEL_CARDS.find((c) => c.id === initialState.lastSelectedCardId) ||
      MIGEL_CARDS[0]
  );
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [justDiscoveredSecret, setJustDiscoveredSecret] = useState<boolean>(false);
  const [justDiscoveredRare, setJustDiscoveredRare] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Sync audio preference
  useEffect(() => {
    migelAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Persist to localStorage
  useEffect(() => {
    saveMigelState({
      discoveredIds,
      boxOpened,
      soundEnabled,
      lastSelectedCardId: selectedCard.id,
    });
  }, [discoveredIds, boxOpened, soundEnabled, selectedCard.id]);

  const handleOpenGift = () => {
    migelAudio.playShuffle();
    window.setTimeout(() => migelAudio.playSlide(), 180);
    setBoxOpened(true);
    setScreen('pick');
  };

  const handleBoxClick = () => {
    migelAudio.playShuffle();
    setScreen('pick');
  };

  const handleShakeBox = () => {
    migelAudio.playShuffle();
    window.setTimeout(() => migelAudio.playSlide(), 220);
  };

  const handleSelectCard = (card: MigelCard, startFlipped = false) => {
    migelAudio.playPop();
    window.setTimeout(() => migelAudio.playSlide(), 90);
    setSelectedCard(card);
    setIsCardFlipped(startFlipped);
    setJustDiscoveredSecret(false);
    setJustDiscoveredRare(false);
    setScreen('reminder');
  };

  const handleFlipToggle = () => {
    const nextFlipped = !isCardFlipped;
    setIsCardFlipped(nextFlipped);

    if (nextFlipped) {
      const alreadyDiscovered = discoveredIds.includes(selectedCard.id);
      if (!alreadyDiscovered) {
        setDiscoveredIds((prev) => [...prev, selectedCard.id]);
      }

      if (selectedCard.rarity === 'secret') {
        migelAudio.playRareDiscovery(true);
        setJustDiscoveredSecret(true);
      } else if (selectedCard.rarity === 'rare') {
        migelAudio.playRareDiscovery(false);
        setJustDiscoveredRare(true);
      } else {
        migelAudio.playFlip();
      }
    } else {
      migelAudio.playSlide();
    }
  };

  const handlePrevCard = () => {
    const idx = MIGEL_CARDS.findIndex((c) => c.id === selectedCard.id);
    const prevIdx = (idx - 1 + MIGEL_CARDS.length) % MIGEL_CARDS.length;
    handleSelectCard(MIGEL_CARDS[prevIdx], false);
  };

  const handleNextCard = () => {
    const idx = MIGEL_CARDS.findIndex((c) => c.id === selectedCard.id);
    const nextIdx = (idx + 1) % MIGEL_CARDS.length;
    handleSelectCard(MIGEL_CARDS[nextIdx], false);
  };

  const handleResetProgress = () => {
    clearMigelState();
    setDiscoveredIds([]);
    setBoxOpened(false);
    setIsCardFlipped(false);
    setJustDiscoveredSecret(false);
    setJustDiscoveredRare(false);
    setSelectedCard(MIGEL_CARDS[0]);
    setScreen('deck');
    setConfirmReset(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[#642B48]">
      {/* Dreamy Pink Vintage Editorial Backdrop */}
      <RomanticAtmosphere />

      {/* ================= 3-ZONE EDITORIAL HEADER BAR ================= */}
      <header className="relative z-40 w-full border-b border-[#C76A91]/20 bg-[#FFF5F8]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Zone 1: Brand Title */}
          <button
            type="button"
            onClick={() => setScreen(boxOpened ? 'pick' : 'deck')}
            className="cursor-pointer whitespace-nowrap shrink-0 text-left"
          >
            <span className="font-editorial text-lg sm:text-xl font-semibold tracking-wide text-[#642B48]">
              Migel’s Deck <span className="text-[#C76A91]">♡</span>
            </span>
          </button>

          {/* Zone 2: Single-Line Navigation Links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-7"
          >
            <button
              type="button"
              onClick={() => setScreen('deck')}
              className={`min-h-[40px] cursor-pointer whitespace-nowrap shrink-0 font-editorial text-sm tracking-[0.12em] uppercase transition-colors ${
                screen === 'deck'
                  ? 'text-[#963B65] font-semibold underline decoration-[#C76A91] decoration-2 underline-offset-4'
                  : 'text-[#642B48]/75 hover:text-[#963B65]'
              }`}
            >
              The Deck
            </button>

            <button
              type="button"
              onClick={() => {
                if (!boxOpened) {
                  handleOpenGift();
                } else {
                  setScreen('pick');
                }
              }}
              className={`min-h-[40px] cursor-pointer whitespace-nowrap shrink-0 font-editorial text-sm tracking-[0.12em] uppercase transition-colors ${
                screen === 'pick'
                  ? 'text-[#963B65] font-semibold underline decoration-[#C76A91] decoration-2 underline-offset-4'
                  : 'text-[#642B48]/75 hover:text-[#963B65]'
              }`}
            >
              Pick a Card
            </button>

            <button
              type="button"
              onClick={() => {
                migelAudio.playPop();
                setScreen('collection');
              }}
              className={`min-h-[40px] cursor-pointer whitespace-nowrap shrink-0 font-editorial text-sm tracking-[0.12em] uppercase transition-colors ${
                screen === 'collection'
                  ? 'text-[#963B65] font-semibold underline decoration-[#C76A91] decoration-2 underline-offset-4'
                  : 'text-[#642B48]/75 hover:text-[#963B65]'
              }`}
            >
              Your Collection
            </button>
          </nav>

          {/* Zone 3: Discovery Progress & Sound Control */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => {
                migelAudio.playPop();
                setScreen('collection');
              }}
              className="min-h-[40px] cursor-pointer whitespace-nowrap font-mono-num text-xs sm:text-sm tracking-wider text-[#963B65] hover:text-[#642B48] transition-colors"
              title="Open Migel's 20-card collection"
            >
              CARDS DISCOVERED: {discoveredIds.length}/20
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                migelAudio.setEnabled(next);
                if (next) migelAudio.playSparkle();
              }}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#C76A91]/35 bg-[#FFF5F8] text-[#963B65] transition-colors hover:border-[#963B65]"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4 opacity-60" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Secondary Quick Nav */}
        <div className="flex md:hidden items-center justify-center gap-6 border-t border-[#C76A91]/15 px-4 py-1.5 text-xs">
          <button
            type="button"
            onClick={() => setScreen('deck')}
            className={`min-h-[36px] cursor-pointer whitespace-nowrap font-editorial uppercase tracking-widest ${
              screen === 'deck' ? 'text-[#963B65] font-semibold' : 'text-[#642B48]/70'
            }`}
          >
            Deck
          </button>
          <button
            type="button"
            onClick={() => {
              if (!boxOpened) handleOpenGift();
              else setScreen('pick');
            }}
            className={`min-h-[36px] cursor-pointer whitespace-nowrap font-editorial uppercase tracking-widest ${
              screen === 'pick' ? 'text-[#963B65] font-semibold' : 'text-[#642B48]/70'
            }`}
          >
            Pick Card
          </button>
          <button
            type="button"
            onClick={() => {
              migelAudio.playPop();
              setScreen('collection');
            }}
            className={`min-h-[36px] cursor-pointer whitespace-nowrap font-editorial uppercase tracking-widest ${
              screen === 'collection'
                ? 'text-[#963B65] font-semibold'
                : 'text-[#642B48]/70'
            }`}
          >
            Collection
          </button>
        </div>
      </header>

      {/* ================= MAIN STAGE ================= */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {(screen === 'deck' || screen === 'pick') && (
          <CardBoxStage
            mode={screen}
            boxOpened={screen === 'pick' ? true : boxOpened}
            allCards={MIGEL_CARDS}
            discoveredIds={discoveredIds}
            onOpenGift={handleOpenGift}
            onBoxClick={handleBoxClick}
            onShakeBox={handleShakeBox}
            onSelectCard={(card) => handleSelectCard(card, false)}
            onHoverCard={() => {
              if (soundEnabled) migelAudio.playSparkle();
            }}
            onDragStart={() => {
              if (soundEnabled) migelAudio.playSlide();
            }}
          />
        )}

        {screen === 'reminder' && (
          <ReminderRevealScreen
            card={selectedCard}
            isFlipped={isCardFlipped}
            justDiscoveredSecret={justDiscoveredSecret}
            justDiscoveredRare={justDiscoveredRare}
            onFlipToggle={handleFlipToggle}
            onPrevCard={handlePrevCard}
            onNextCard={handleNextCard}
            onBackToDeck={() => {
              migelAudio.playSlide();
              setBoxOpened(true);
              setScreen('pick');
            }}
            onOpenCollection={() => {
              migelAudio.playPop();
              setScreen('collection');
            }}
          />
        )}

        {screen === 'collection' && (
          <CollectionGalleryScreen
            allCards={MIGEL_CARDS}
            discoveredIds={discoveredIds}
            onSelectCard={(card) => {
              const alreadyOpened = discoveredIds.includes(card.id);
              handleSelectCard(card, alreadyOpened);
            }}
            onBackToDeck={() => {
              migelAudio.playSlide();
              setBoxOpened(true);
              setScreen('pick');
            }}
          />
        )}
      </main>

      {/* ================= DELICATE FOOTER WITH RESET OPTION ================= */}
      <footer className="relative z-20 border-t border-[#C76A91]/20 bg-[#FFF5F8]/55 px-4 py-4 text-center backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#963B65]/85">
          <p className="font-serif-body italic">
            Made with warmth & little reminders, especially for Migel ♡
          </p>

          <div className="flex items-center gap-3">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[36px] inline-flex cursor-pointer items-center gap-1.5 font-editorial uppercase tracking-widest text-[11px] text-[#963B65]/75 hover:text-[#642B48] transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Deck
              </button>
            ) : (
              <div className="flex items-center gap-2 font-editorial text-xs">
                <span className="text-[#642B48]">Close box & reset?</span>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="cursor-pointer font-semibold text-[#963B65] underline underline-offset-2"
                >
                  Yes, reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="cursor-pointer text-[#642B48]/75 hover:text-[#642B48]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
