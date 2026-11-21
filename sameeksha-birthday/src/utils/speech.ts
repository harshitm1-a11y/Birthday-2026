// Advanced Speech Synthesis Utility for the Companion Robot Mascot
// Tuned for natural, clear Hinglish pronunciation and authentic Indian Hindi/English voices

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
  private pitch = 1.0;
  private rate = 0.88;

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

    // Priority 1: Indian Hindi voice (Google हिन्दी, Microsoft Kalpana/Hemant/Heera, etc.)
    const hindiVoice = this.voices.find(
      (v) =>
        v.lang.toLowerCase().includes('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('hemant')
    );

    // Priority 2: Indian English voice (en-IN, Neerja, Ravi, Google Indian English)
    const indianEngVoice = this.voices.find(
      (v) =>
        v.lang.toLowerCase().includes('en-in') ||
        v.lang.toLowerCase().includes('en_in') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('ravi')
    );

    // Priority 3: Soft natural voice
    const naturalVoice = this.voices.find(
      (v) =>
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('samantha')
    );

    this.selectedVoice = hindiVoice || indianEngVoice || naturalVoice || this.voices[0] || null;
  }

  public setSpeakingCallback(cb: (isSpeaking: boolean) => void) {
    this.onSpeakingChange = cb;
  }

  // Pre-process Hinglish text for natural phonetics in TTS engines
  private prepareHinglishText(text: string): string {
    return text
      // Replace awkward internet abbreviations with spoken phrases
      .replace(/Psst\.\.\./gi, 'Hey, ')
      .replace(/Psst/gi, 'Hey, ')
      .replace(/chhoti-chhoti/gi, 'chhoti chhoti')
      .replace(/\.\.\./g, ', ')
      // Strip emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/['"`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(rawText: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.isMuted) return;

    // Refresh voices if not yet cached
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    window.speechSynthesis.cancel();

    const cleanText = this.prepareHinglishText(rawText);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Natural sweet friendly speech parameters
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;
    utterance.volume = 1.0;

    // Use Indian Hindi or English lang code
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
      utterance.lang = this.selectedVoice.lang || 'hi-IN';
    } else {
      utterance.lang = 'hi-IN';
    }

    utterance.onstart = () => {
      this.onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      this.onSpeakingChange?.(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.onSpeakingChange?.(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.onSpeakingChange?.(false);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setRate(rate: number) {
    this.rate = rate;
  }

  public setPitch(pitch: number) {
    this.pitch = pitch;
  }

  public getVoiceName(): string {
    return this.selectedVoice ? this.selectedVoice.name : 'System Default';
  }
}

export const robotSpeaker = new RobotSpeaker();
