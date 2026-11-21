// Advanced Audio Manager with Multi-Track Playlist, Audio Ducking, and Acoustic Sound Effects
import { getAssetUrl } from './assets';

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  category: 'birthday' | 'party' | 'romantic' | 'soft';
  type: 'file' | 'synth';
  src?: string;
  duration: string;
  description: string;
}

export const PLAYLIST_TRACKS: PlaylistTrack[] = [
  {
    id: 'bollywood-birthday',
    title: 'Baar Baar Din Ye Aaye',
    artist: 'Mohammed Rafi',
    category: 'birthday',
    type: 'file',
    src: '/audio/bollywood-birthday.mp3',
    duration: '4:48',
    description: 'Classic iconic Bollywood birthday anthem for Sameeksha baby',
  },
  {
    id: 'romantic-piano',
    title: 'Tum Hi Ho & Kesariya (Romantic Piano)',
    artist: 'Antigravity Studio',
    category: 'romantic',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Soulful acoustic piano romance with gentle strings',
  },
  {
    id: 'party-beats',
    title: 'Celebration EDM & Dhol Party Beats',
    artist: 'Birthday Club Mix',
    category: 'party',
    type: 'synth',
    duration: '∞ Loop',
    description: 'High-energy celebration rhythms with dance bass',
  },
  {
    id: 'soft-lofi',
    title: 'Midnight Lofi Love Chords',
    artist: 'Starlight Romance',
    category: 'soft',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Warm rhodes chords, gentle beats, and dreamy celestial vibes',
  },
  {
    id: 'birthday-acoustic',
    title: 'Acoustic Birthday Music Box',
    artist: 'Fairy Tale Ensemble',
    category: 'birthday',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Sweet music box chimes playing the birthday theme',
  },
  {
    id: 'peppy-dance',
    title: 'Bubbly Funk & Confetti Groove',
    artist: 'Disco Sparks',
    category: 'party',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Upbeat funky bass and retro celebration disco',
  },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private currentTrackIndex = 0;
  private baseVolume = 0.55;
  private isDucked = false;
  private synthIntervalId: any = null;
  private synthStep = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;
    if (!this.audioElement) {
      const track = PLAYLIST_TRACKS[this.currentTrackIndex];
      const audioPath = track.src ? getAssetUrl(track.src) : getAssetUrl('/audio/bollywood-birthday.mp3');
      this.audioElement = new Audio(audioPath);
      this.audioElement.loop = true;
      this.audioElement.volume = this.baseVolume;
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audioElement.addEventListener('error', () => {
        console.warn('Audio element error, falling back to synth');
        if (this.isAudioPlaying) {
          this.startSynthPlayback();
        }
      });
    }
  }

  // --- Track Selection & Playback ---
  public getCurrentTrack(): PlaylistTrack {
    return PLAYLIST_TRACKS[this.currentTrackIndex] || PLAYLIST_TRACKS[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  public getVolume(): number {
    return this.baseVolume;
  }

  public setVolume(vol: number) {
    this.baseVolume = Math.max(0, Math.min(1, vol));
    if (this.audioElement && !this.isDucked) {
      this.audioElement.volume = this.baseVolume;
    }
    this.notify();
  }

  // Audio ducking when voice synthesis speaks
  public duckAudio(targetVol = 0.12) {
    this.isDucked = true;
    if (this.audioElement) {
      this.audioElement.volume = Math.min(targetVol, this.baseVolume);
    }
  }

  public unduckAudio() {
    this.isDucked = false;
    if (this.audioElement) {
      this.audioElement.volume = this.baseVolume;
    }
  }

  public playTrack(trackId: string) {
    const idx = PLAYLIST_TRACKS.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      this.setTrackIndex(idx);
    }
  }

  public setTrackIndex(idx: number) {
    const validIdx = (idx + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    this.currentTrackIndex = validIdx;
    this.stopSynthPlayback();

    const track = PLAYLIST_TRACKS[validIdx];
    if (track.type === 'file' && track.src) {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = getAssetUrl(track.src);
        this.audioElement.currentTime = 0;
        this.audioElement.volume = this.isDucked ? 0.12 : this.baseVolume;
        if (this.isAudioPlaying) {
          this.audioElement.play().catch(() => {});
        }
      }
    } else {
      // Synth track
      if (this.audioElement) {
        this.audioElement.pause();
      }
      if (this.isAudioPlaying) {
        this.startSynthPlayback();
      }
    }
    this.notify();
  }

  public nextTrack() {
    this.setTrackIndex(this.currentTrackIndex + 1);
  }

  public prevTrack() {
    this.setTrackIndex(this.currentTrackIndex - 1);
  }

  public startAmbient() {
    this.isAudioPlaying = true;
    this.initCtx();
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];

    if (track.type === 'file' && track.src) {
      this.initAudioElement();
      if (this.audioElement) {
        this.audioElement.volume = this.isDucked ? 0.12 : this.baseVolume;
        this.audioElement.play().catch((err) => {
          console.warn('Audio file restricted or failed, starting synth fallback:', err);
          this.startSynthPlayback();
        });
      }
    } else {
      this.startSynthPlayback();
    }
    this.notify();
  }

  public stopAmbient() {
    this.isAudioPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthPlayback();
    this.notify();
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

  // --- Web Audio Procedural Generative Synthesizers ---
  private startSynthPlayback() {
    this.stopSynthPlayback();
    this.initCtx();
    if (!this.ctx) return;

    this.synthStep = 0;
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];

    if (track.id === 'party-beats' || track.id === 'peppy-dance') {
      // 124 BPM Upbeat Party Synthesizer
      const beatInterval = 60000 / 124 / 2; // 8th notes
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPartyStep(this.synthStep % 16);
        this.synthStep++;
      }, beatInterval);
    } else if (track.id === 'birthday-acoustic') {
      // Gentle Happy Birthday Chimes
      const chimeInterval = 420;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playBirthdayChimeStep(this.synthStep % 24);
        this.synthStep++;
      }, chimeInterval);
    } else {
      // Romantic / Soft Lofi Chord Progressions
      const chordInterval = 1600;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playRomanticChordStep(this.synthStep % 4);
        this.synthStep++;
      }, chordInterval);
      this.playRomanticChordStep(0);
    }
  }

  private stopSynthPlayback() {
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainMult = 0.15,
    attack = 0.05
  ) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'sawtooth' ? 1200 : 2500, now);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const effVolume = (this.isDucked ? 0.04 : this.baseVolume * 0.4) * gainMult;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, effVolume), now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  private playRomanticChordStep(step: number) {
    // F - C - Dm - Bb (Romantic progression)
    const chords = [
      [349.23, 440.0, 523.25, 698.46], // F maj
      [261.63, 329.63, 392.0, 523.25], // C maj
      [293.66, 349.23, 440.0, 587.33], // D min
      [233.08, 293.66, 349.23, 466.16], // Bb maj
    ];
    const notes = chords[step];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.2, 'triangle', 0.18, 0.12);
        // Soft sparkling overtone
        this.playTone(freq * 2, 1.2, 'sine', 0.06, 0.08);
      }, idx * 120);
    });
  }

  private playPartyStep(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Bass drum on 0, 4, 8, 12
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain.gain.setValueAtTime(this.isDucked ? 0.04 : this.baseVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    // Melodic bass synth note
    const bassScale = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 110];
    const note = bassScale[step % bassScale.length];
    this.playTone(note, 0.2, 'sawtooth', 0.12, 0.02);

    // High sparkling disco chime
    if (step === 2 || step === 6 || step === 10 || step === 14) {
      this.playTone(1046.5, 0.1, 'sine', 0.08, 0.01);
    }
  }

  private playBirthdayChimeStep(step: number) {
    // Happy Birthday melody notes: G4 G4 A4 G4 C5 B4 ...
    const melody = [
      392.0, 392.0, 440.0, 392.0, 523.25, 493.88, 0,
      392.0, 392.0, 440.0, 392.0, 587.33, 523.25, 0,
      392.0, 392.0, 783.99, 659.25, 523.25, 493.88, 440.0, 0,
      698.46, 698.46, 659.25, 523.25, 587.33, 523.25,
    ];
    const note = melody[step % melody.length];
    if (note > 0) {
      this.playTone(note, 0.6, 'sine', 0.22, 0.02);
      this.playTone(note * 2, 0.4, 'triangle', 0.08, 0.02);
    }
  }

  // --- Snappy Acoustic Sound Effects ---

  // 1. Cannon Launch Sound (Deep Pneumatic WHOOSH upward from bottom)
  public playPopperCannonSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.25); // Rising pitch launch!

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio context ignored
    }
  }

  // 2. High-Powered Confetti Apex Pop & Sparkle Burst
  public playPopperBurstSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Noise Burst
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(2500, now + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.18);

      // Acoustic Chime Sparkle
      setTimeout(() => {
        this.playTwinkle();
      }, 70);
    } catch {
      // Ignored
    }
  }

  // Backward compatibility alias
  public playPopperSound() {
    this.playPopperBurstSound();
  }

  // 3. Funny Cartoon Cake Splat / Drop Sound
  public playCakeSplatSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Descending comical boing/squish
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      // Squish white noise click
      setTimeout(() => {
        this.playTone(120, 0.1, 'sawtooth', 0.25, 0.01);
      }, 50);
    } catch {
      // Ignored
    }
  }

  // 4. Magical Cake Delivery Growth Sound
  public playCakeDeliverySound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        setTimeout(() => {
          this.playTone(f, 0.45, 'sine', 0.25, 0.02);
        }, i * 90);
      });
    } catch {
      // Ignored
    }
  }

  // 5. Delicate Sparkle Twinkle
  public playTwinkle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [987.77, 1318.51, 1567.98];
      notes.forEach((f, i) => {
        setTimeout(() => {
          this.playTone(f, 0.35, 'sine', 0.15, 0.02);
        }, i * 75);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundManager();
