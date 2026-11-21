import { create } from 'zustand';

export type CakeThemeId = 'strawberry' | 'chocolate' | 'lavender' | 'mango' | 'royal';
export type CompanionId = 'robo' | 'teddy' | 'penguin' | 'kitty' | 'astro';

export interface CakeThemeInfo {
  id: CakeThemeId;
  name: string;
  emoji: string;
  frostingColor: string;
  spongeColor: string;
  accentColor: string;
  plateColor: string;
  description: string;
}

export const CAKE_THEMES: Record<CakeThemeId, CakeThemeInfo> = {
  strawberry: {
    id: 'strawberry',
    name: 'Royal Strawberry Velvet',
    emoji: '🍓',
    frostingColor: '#ffe4e6',
    spongeColor: '#e11d48',
    accentColor: '#f43f5e',
    plateColor: '#881337',
    description: 'Blush strawberry cream, rich ruby glaze & golden sugar pearls',
  },
  chocolate: {
    id: 'chocolate',
    name: 'Belgian Chocolate Truffle',
    emoji: '🍫',
    frostingColor: '#3e2723',
    spongeColor: '#271711',
    accentColor: '#d97706',
    plateColor: '#1c1917',
    description: 'Deep dark Belgian chocolate ganache with edible gold leaf dust',
  },
  lavender: {
    id: 'lavender',
    name: 'Pastel Lavender Dream',
    emoji: '🌸',
    frostingColor: '#f3e8ff',
    spongeColor: '#9333ea',
    accentColor: '#c084fc',
    plateColor: '#581c87',
    description: 'Soft lavender buttercream adorned with delicate sugar blossoms',
  },
  mango: {
    id: 'mango',
    name: 'Tropical Mango Sunset',
    emoji: '🥭',
    frostingColor: '#fef3c7',
    spongeColor: '#d97706',
    accentColor: '#f59e0b',
    plateColor: '#78350f',
    description: 'Sun-kissed mango mirror glaze with passionfruit cream swirls',
  },
  royal: {
    id: 'royal',
    name: 'Princess Golden Shimmer',
    emoji: '👑',
    frostingColor: '#e0f2fe',
    spongeColor: '#0284c7',
    accentColor: '#fbbf24',
    plateColor: '#0f172a',
    description: 'Celestial cyan frosting with golden tiara sparkle & multi-tier confetti',
  },
};

export interface CompanionInfo {
  id: CompanionId;
  name: string;
  emoji: string;
  title: string;
  color: string;
  intro: string;
}

export const COMPANIONS: Record<CompanionId, CompanionInfo> = {
  robo: {
    id: 'robo',
    name: 'Robo-Bunny',
    emoji: '🤖',
    title: 'Cute Cyber Bunny',
    color: '#ff8fb3',
    intro: 'BEEP BOOP! Special celebration robot for Sameeksha!',
  },
  teddy: {
    id: 'teddy',
    name: 'Teddy Bear',
    emoji: '🧸',
    title: 'Fluffy Honey Bear',
    color: '#d97706',
    intro: 'Hugs & cuddles! I brought sweet surprises for you, Sameeksha!',
  },
  penguin: {
    id: 'penguin',
    name: 'Mr. Waddles',
    emoji: '🐧',
    title: 'Chibi Chef Penguin',
    color: '#06b6d4',
    intro: 'Waddle waddle! Five-star gourmet cake for Sameeksha!',
  },
  kitty: {
    id: 'kitty',
    name: 'Miu Miu',
    emoji: '🐱',
    title: 'Adorable Calico Kitty',
    color: '#f43f5e',
    intro: 'Meow! The sweetest birthday wishes for Sameeksha!',
  },
  astro: {
    id: 'astro',
    name: 'Cosmo Astro',
    emoji: '🚀',
    title: 'Starry Chibi Astronaut',
    color: '#8b5cf6',
    intro: 'Mission: Galaxy surprise delivery for Sameeksha!',
  },
};

export interface ExperienceState {
  currentScene: number;
  visitedScenes: Set<number>;
  collectedHearts: Set<number>;
  audioEnabled: boolean;
  reducedMotion: boolean;
  isTransitioning: boolean;
  secretUnlocked: boolean;
  showSecretMessage: boolean;
  companionDialogueIndex: number;
  giftOpened: boolean;
  candlesBlown: boolean;
  letterOpened: boolean;
  letterSkipped: boolean;
  galleryIndex: number;
  galleryOpen: boolean;
  webglAvailable: boolean;
  loading: boolean;
  loadingProgress: number;

  // New Interactive Customizations
  selectedCakeTheme: CakeThemeId;
  selectedCompanion: CompanionId;
  companionCakesDropped: number;
  isCakeDelivered: boolean;
  isCakeShopOpen: boolean;
  isPlaylistOpen: boolean;
  isCompanionCuttingCake: boolean;
  cakeCutDone: boolean;
  frontKissPopped: boolean;

  setScene: (scene: number) => void;
  nextScene: () => void;
  prevScene: () => void;
  visitScene: (scene: number) => void;
  collectHeart: (heartId: number) => void;
  toggleAudio: () => void;
  setReducedMotion: (val: boolean) => void;
  setTransitioning: (val: boolean) => void;
  setGiftOpened: () => void;
  setCandlesBlown: () => void;
  setLetterOpened: () => void;
  setLetterSkipped: () => void;
  nextCompanionDialogue: () => void;
  setGalleryIndex: (idx: number) => void;
  setGalleryOpen: (open: boolean) => void;
  setWebglAvailable: (val: boolean) => void;
  setLoading: (val: boolean) => void;
  setLoadingProgress: (val: number) => void;
  setShowSecretMessage: (val: boolean) => void;

  setCakeTheme: (theme: CakeThemeId) => void;
  setCompanion: (comp: CompanionId) => void;
  dropCompanionCake: () => void;
  setCakeDelivered: (val: boolean) => void;
  setCakeShopOpen: (open: boolean) => void;
  setPlaylistOpen: (open: boolean) => void;
  triggerCompanionCakeCut: () => void;
  finishCompanionCakeCut: () => void;
  setFrontKissPopped: (val: boolean) => void;
}

const TOTAL_SCENES = 7;
const TOTAL_HEARTS = 5;

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  currentScene: 0,
  visitedScenes: new Set<number>([0]),
  collectedHearts: new Set<number>(),
  audioEnabled: true,
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
  isTransitioning: false,
  secretUnlocked: false,
  showSecretMessage: false,
  companionDialogueIndex: 0,
  giftOpened: false,
  candlesBlown: false,
  letterOpened: false,
  letterSkipped: false,
  galleryIndex: 0,
  galleryOpen: false,
  webglAvailable: true,
  loading: true,
  loadingProgress: 0,

  selectedCakeTheme: 'strawberry',
  selectedCompanion: 'teddy', // Default is Teddy Bear as requested!
  companionCakesDropped: 0,
  isCakeDelivered: false,
  isCakeShopOpen: false,
  isPlaylistOpen: false,
  isCompanionCuttingCake: false,
  cakeCutDone: false,
  frontKissPopped: true,

  setScene: (scene) => {
    if (scene >= 0 && scene < TOTAL_SCENES) {
      const visited = new Set(get().visitedScenes);
      visited.add(scene);
      set({ currentScene: scene, visitedScenes: visited, isTransitioning: false });
    }
  },

  nextScene: () => {
    const { currentScene } = get();
    if (currentScene < TOTAL_SCENES - 1) {
      get().setScene(currentScene + 1);
    }
  },

  prevScene: () => {
    const { currentScene } = get();
    if (currentScene > 0) {
      get().setScene(currentScene - 1);
    }
  },

  visitScene: (scene) => {
    const visited = new Set(get().visitedScenes);
    visited.add(scene);
    set({ visitedScenes: visited });
  },

  collectHeart: (heartId) => {
    const hearts = new Set(get().collectedHearts);
    hearts.add(heartId);
    const secretUnlocked = hearts.size >= TOTAL_HEARTS;
    set({ collectedHearts: hearts, secretUnlocked });
    if (secretUnlocked) {
      setTimeout(() => set({ showSecretMessage: true }), 500);
    }
  },

  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setReducedMotion: (val) => set({ reducedMotion: val }),
  setTransitioning: (val) => set({ isTransitioning: val }),
  setGiftOpened: () => set({ giftOpened: true }),
  setCandlesBlown: () => set({ candlesBlown: true }),
  setLetterOpened: () => set({ letterOpened: true }),
  setLetterSkipped: () => set({ letterSkipped: true }),
  nextCompanionDialogue: () =>
    set((s) => ({ companionDialogueIndex: s.companionDialogueIndex + 1 })),
  setGalleryIndex: (idx) => set({ galleryIndex: idx }),
  setGalleryOpen: (open) => set({ galleryOpen: open }),
  setWebglAvailable: (val) => set({ webglAvailable: val }),
  setLoading: (val) => set({ loading: val }),
  setLoadingProgress: (val) => set({ loadingProgress: val }),
  setShowSecretMessage: (val) => set({ showSecretMessage: val }),

  setCakeTheme: (theme) => set({ selectedCakeTheme: theme }),
  setCompanion: (comp) => set({ selectedCompanion: comp }),
  dropCompanionCake: () => set((s) => ({ companionCakesDropped: s.companionCakesDropped + 1 })),
  setCakeDelivered: (val) => set({ isCakeDelivered: val }),
  setCakeShopOpen: (open) => set({ isCakeShopOpen: open }),
  setPlaylistOpen: (open) => set({ isPlaylistOpen: open }),
  triggerCompanionCakeCut: () => set({ isCompanionCuttingCake: true }),
  finishCompanionCakeCut: () => set({ isCompanionCuttingCake: false, cakeCutDone: true }),
  setFrontKissPopped: (val) => set({ frontKissPopped: val }),
}));
