// Web Speech API utility for the Companion robot voice
class RobotSpeaker {
  private isMuted = false;
  private onSpeakingChange: ((isSpeaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded handler
      };
    }
  }

  public setSpeakingCallback(cb: (isSpeaking: boolean) => void) {
    this.onSpeakingChange = cb;
  }

  public speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (this.isMuted) return;

    window.speechSynthesis.cancel();

    // Clean text: strip emojis and special symbols
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[^\w\s\d,?!.'"-]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Cute, warm, cheerful pitch and rate
    utterance.pitch = 1.35;
    utterance.rate = 0.95;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Indian English / Hindi voice if available
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) ||
      voices.find((v) => v.lang.includes('IN') || v.name.toLowerCase().includes('india')) ||
      voices.find((v) => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      this.onSpeakingChange?.(false);
    };

    utterance.onerror = () => {
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
}

export const robotSpeaker = new RobotSpeaker();
