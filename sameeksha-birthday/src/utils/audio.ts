// Audio manager for Bollywood theme song and Web Audio interactive effects
import { getAssetUrl } from './assets';

class SoundManager {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private synthIntervalId: any = null;
  private isUsingSynth = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    try {
      if (!this.audioElement) {
        const audioPath = getAssetUrl('/audio/bollywood-birthday.mp3');
        this.audioElement = new Audio(audioPath);
        this.audioElement.loop = true;
        this.audioElement.volume = 0.5;
        this.audioElement.preload = 'auto';

        this.audioElement.addEventListener('error', (e) => {
          console.warn('Bollywood audio file failed, falling back to ambient synth:', e);
          this.isUsingSynth = true;
        });

        this.audioElement.addEventListener('ended', () => {
          if (this.isAudioPlaying && this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(() => {});
          }
        });
      }
    } catch (e) {
      console.warn('Could not initialize audio element:', e);
      this.isUsingSynth = true;
    }
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Play/Pause the Bollywood Theme Song
  public startAmbient() {
    this.isAudioPlaying = true;
    this.initAudioElement();

    if (this.audioElement && !this.isUsingSynth) {
      this.audioElement.play().catch((err) => {
        console.warn('Audio play restricted or failed, using synth fallback:', err);
        this.startSynthAmbient();
      });
    } else {
      this.startSynthAmbient();
    }
  }

  public stopAmbient() {
    this.isAudioPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthAmbient();
  }

  public toggleAmbient(): boolean {
    if (this.isAudioPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  public setVolume(volume: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  // Soft sparkle sound effect on button clicks / photo opens
  public playTwinkle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {
      // Audio fallback
    }
  }

  // Celebration chime when candles are blown
  public playCelebrationTune() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const notes = [
        { f: 261.63, d: 0.3 }, // C4
        { f: 261.63, d: 0.3 }, // C4
        { f: 293.66, d: 0.6 }, // D4
        { f: 261.63, d: 0.6 }, // C4
        { f: 349.23, d: 0.6 }, // F4
        { f: 329.63, d: 1.0 }, // E4
      ];

      let t = this.ctx.currentTime;
      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + note.d);
        t += note.d + 0.05;
      });
    } catch {
      // Audio fallback
    }
  }

  // Fallback dreamy synth chords
  private startSynthAmbient() {
    if (this.synthIntervalId) return;
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C maj
      [220.0, 261.63, 329.63, 440.0],  // A min
      [174.61, 220.0, 261.63, 349.23], // F maj
      [196.0, 246.94, 293.66, 392.0],  // G maj
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isAudioPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    this.synthIntervalId = setInterval(playChord, 3500);
  }

  private stopSynthAmbient() {
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }
}

export const soundManager = new SoundManager();
