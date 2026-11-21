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

  // Snappy Party Popper Burst Sound Effect
  public playPopperSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // 1. Acoustic thump: resonant low sine dropping fast
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);

      // 2. High snap noise transient (balloon/cork pop)
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.09);

      // 3. Celebratory sparkle fanfare
      const chimeNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.06);

        chimeGain.gain.setValueAtTime(0.08, now + 0.08 + idx * 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.06);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chimeOsc.start(now + 0.08 + idx * 0.06);
        chimeOsc.stop(now + 0.45 + idx * 0.06);
      });
    } catch {
      // Audio fallback
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
