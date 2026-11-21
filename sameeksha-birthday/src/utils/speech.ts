// Natural Speech Synthesis Utility with Soft Sweet Female Voice and Auto Audio-Ducking
import { soundManager } from './audio';

export interface SpeechSettings {
  pitch: number;
  rate: number;
  isMuted: boolean;
}

class RobotSpeaker {
  private isMuted = false;
  private onSpeakingChange: ((isSpeaking: boolean) => void) | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private pitch = 1.14; // Sweet, melodic feminine pitch as requested
  private rate = 0.92;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();

    // Priority 1: Soft Sweet Female Indian / Hindi / English voices (Heera, Aditi, Zira, Google Female, Samantha)
    const femaleIndianVoice = this.voices.find(
      (v) =>
        (v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india') || v.lang.toLowerCase().startsWith('hi')) &&
        (v.name.toLowerCase().includes('heera') ||
          v.name.toLowerCase().includes('aditi') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('kavya') ||
          v.name.toLowerCase().includes('priya') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('google'))
    );

    const femaleEngVoice = this.voices.find(
      (v) =>
        (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('hi')) &&
        (v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('girl'))
    );

    const genericFemaleVoice = this.voices.find((v) =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('heera')
    );

    if (femaleIndianVoice) {
      this.selectedVoice = femaleIndianVoice;
    } else if (femaleEngVoice) {
      this.selectedVoice = femaleEngVoice;
    } else if (genericFemaleVoice) {
      this.selectedVoice = genericFemaleVoice;
    } else {
      this.selectedVoice = this.voices[0] || null;
    }
  }

  public setSpeakingCallback(cb: (isSpeaking: boolean) => void) {
    this.onSpeakingChange = cb;
  }

  // Convert Hinglish or letters into clear spoken phonetics so TTS never spells out letters
  private sanitizeForSpeech(text: string): string {
    return text
      // Replace English acronyms and symbols
      .replace(/\bHBD\b/gi, 'Happy Birthday')
      .replace(/\b3D\b/gi, 'Three D')
      .replace(/&/g, 'aur')
      .replace(/\+/g, 'aur')
      // Remove punctuation that causes letter-by-letter pause
      .replace(/[•\-_~#*\/\\|[\]{}()<>]/g, ' ')
      .replace(/\.{2,}/g, ', ')
      // Strip emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(textToDisplay: string, spokenHindiAlternative?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.isMuted) return;

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    this.stop();

    // Prefer native Hindi spoken text if available
    const textToSpeak = spokenHindiAlternative
      ? this.sanitizeForSpeech(spokenHindiAlternative)
      : this.sanitizeForSpeech(textToDisplay);

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Default to natural English pronunciation unless Devanagari Hindi is explicitly present
    const hasDevanagari = /[\u0900-\u097F]/.test(textToSpeak);
    if (hasDevanagari) {
      utterance.lang = 'hi-IN';
    } else if (this.selectedVoice) {
      utterance.lang = this.selectedVoice.lang || 'en-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.pitch = this.pitch; // 1.14: soft sweet girl voice
    utterance.rate = this.rate; // 0.92: perfectly paced and clear
    utterance.volume = 0.9; // Clear and sweet tone

    utterance.onstart = () => {
      // DUCK BACKGROUND AUDIO SMOOTHLY WHILE SPEAKING!
      soundManager.duckAudio(0.12);
      if (this.onSpeakingChange) {
        this.onSpeakingChange(true);
      }
    };

    const cleanup = () => {
      // RESTORE BACKGROUND AUDIO
      soundManager.unduckAudio();
      if (this.onSpeakingChange) {
        this.onSpeakingChange(false);
      }
    };

    utterance.onend = cleanup;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      cleanup();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak call failed:', err);
      cleanup();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      soundManager.unduckAudio();
      if (this.onSpeakingChange) {
        this.onSpeakingChange(false);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const robotSpeaker = new RobotSpeaker();
