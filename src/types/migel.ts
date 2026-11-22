export type SuitType = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type CardRarity = 'common' | 'rare' | 'secret';

export type ScreenId = 'deck' | 'pick' | 'reminder' | 'collection';

export interface MigelCard {
  id: number; // 1 to 20
  cardNumberLabel: string; // e.g. "01/20"
  rank: string; // A, Q, K, J, 10, 9, 8...
  suit: SuitType;
  suitTheme: string; // e.g. "Love & Happiness"
  rarity: CardRarity;
  title: string;
  artworkMotif:
    | 'rose-heart'
    | 'sunbeam-locket'
    | 'ribbon-teacup'
    | 'velvet-bow'
    | 'swan-feather'
    | 'starlight-crown'
    | 'cloud-pillow'
    | 'crescent-lantern'
    | 'pearl-mirror'
    | 'cherry-blossom'
    | 'butterfly-quill'
    | 'moonlit-mug'
    | 'ruby-ring'
    | 'blooming-compass'
    | 'silk-envelope'
    | 'garden-key'
    | 'celestial-spark'
    | 'morning-tulip'
    | 'laurel-heart'
    | 'secret-treasure';
  message: string;
}

export interface MigelSaveState {
  discoveredIds: number[];
  boxOpened: boolean;
  soundEnabled: boolean;
  lastSelectedCardId: number | null;
}
