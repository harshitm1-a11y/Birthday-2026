import { create } from 'zustand';

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
}

const TOTAL_SCENES = 7;
const TOTAL_HEARTS = 5;

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  currentScene: 0,
  visitedScenes: new Set<number>(),
  collectedHearts: new Set<number>(),
  audioEnabled: false,
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
}));
