import type { MigelSaveState } from '../types/migel';

const STORAGE_KEY = 'migel_little_deck_v1';

const DEFAULT_STATE: MigelSaveState = {
  discoveredIds: [],
  boxOpened: false,
  soundEnabled: true,
  lastSelectedCardId: null,
};

export function loadMigelState(): MigelSaveState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<MigelSaveState>;
    return {
      discoveredIds: Array.isArray(parsed.discoveredIds)
        ? parsed.discoveredIds.filter((id) => typeof id === 'number' && id >= 1 && id <= 20)
        : [],
      boxOpened: Boolean(parsed.boxOpened),
      soundEnabled: parsed.soundEnabled !== undefined ? Boolean(parsed.soundEnabled) : true,
      lastSelectedCardId:
        typeof parsed.lastSelectedCardId === 'number' ? parsed.lastSelectedCardId : null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveMigelState(state: MigelSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function clearMigelState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors cleanly
  }
}
