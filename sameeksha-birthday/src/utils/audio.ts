// Advanced Audio Manager with Multi-Genre Playlist (Hindi, Punjabi, Theme/BGM), Audio Ducking, and Sound Effects
import { getAssetUrl } from './assets';

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  category: 'hindi' | 'punjabi' | 'theme' | 'birthday' | 'party';
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
    category: 'hindi',
    type: 'file',
    src: '/audio/bollywood-birthday.mp3',
    duration: '4:48',
    description: 'Classic iconic Bollywood birthday anthem for Sameeksha baby',
  },
  {
    id: 'hindi-romance',
    title: 'Tum Se Hi & Kesariya (Acoustic)',
    artist: 'Soulful Bollywood Romance',
    category: 'hindi',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Soulful acoustic guitar, emotive strings, and warm romantic piano chords',
  },
  {
    id: 'punjabi-bhangra',
    title: 'Lover & Brown Munde (Dhol Mix)',
    artist: 'Diljit & AP Dhillon Style Beats',
    category: 'punjabi',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Energetic Punjabi Dhol chaal, catchy tumbi hook, and punchy 808 bass',
  },
  {
    id: 'punjabi-soft',
    title: 'Kinna Chir & Tera Ban Jaunga',
    artist: 'Punjabi Romantic Strings',
    category: 'punjabi',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Heartfelt Punjabi romantic melody with soft flute and warm acoustic guitar',
  },
  {
    id: 'theme-starlight',
    title: 'Enchanted Starlight Symphony BGM',
    artist: 'Cinematic Romance Ensemble',
    category: 'theme',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Dreamy cinematic orchestral strings and gentle fairy-tale celeste',
  },
  {
    id: 'theme-lofi',
    title: 'Midnight Lo-Fi Love Chords',
    artist: 'Chillout Romance BGM',
    category: 'theme',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Cozy Rhodes electric piano chords, vinyl warmth, and relaxing ambient beats',
  },
  {
    id: 'birthday-acoustic',
    title: 'Acoustic Birthday Music Box BGM',
    artist: 'Fairy Tale Ensemble',
    category: 'birthday',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Sweet music box chimes playing the birthday theme',
  },
  {
    id: 'party-celebration',
    title: 'Celebration Confetti Groove',
    artist: 'Birthday Club DJ',
    category: 'party',
    type: 'synth',
    duration: '∞ Loop',
    description: 'Upbeat funky bass, electronic dance drop, and joyful celebration vibes',
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
        console.warn('Audio file playback failed. Falling back to procedural audio engine.');
        if (this.isAudioPlaying) {
          this.startSynthPlayback();
        }
      });
    }
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  public getCurrentTrack(): PlaylistTrack {
    return PLAYLIST_TRACKS[this.currentTrackIndex];
  }

  public getVolume(): number {
    return this.baseVolume;
  }

  public setVolume(vol: number) {
    this.baseVolume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isDucked ? Math.min(0.12, this.baseVolume * 0.2) : this.baseVolume;
    }
    this.notify();
  }

  // Audio ducking for speech
  public duckAudio(duckLevel: number = 0.12) {
    this.isDucked = true;
    if (this.audioElement) {
      this.audioElement.volume = Math.min(duckLevel, this.baseVolume * 0.2);
    }
    this.notify();
  }

  public unduckAudio() {
    this.isDucked = false;
    if (this.audioElement) {
      this.audioElement.volume = this.baseVolume;
    }
    this.notify();
  }

  public playTrack(trackId: string) {
    const idx = PLAYLIST_TRACKS.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      this.currentTrackIndex = idx;
      this.switchTrack();
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    this.switchTrack();
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    this.switchTrack();
  }

  private switchTrack() {
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];
    this.stopSynthPlayback();

    if (track.type === 'file' && track.src) {
      if (this.audioElement) {
        this.audioElement.src = getAssetUrl(track.src);
        this.audioElement.currentTime = 0;
        if (this.isAudioPlaying) {
          this.audioElement.play().catch(() => {
            this.startSynthPlayback();
          });
        }
      }
    } else {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      if (this.isAudioPlaying) {
        this.startSynthPlayback();
      }
    }
    this.notify();
  }

  public startAmbient() {
    this.isAudioPlaying = true;
    this.initCtx();
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];

    if (track.type === 'file' && track.src) {
      this.initAudioElement();
      if (this.audioElement) {
        this.audioElement.volume = this.isDucked ? 0.12 : this.baseVolume;
        this.audioElement.play().catch(() => {
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

    if (track.id === 'punjabi-bhangra') {
      // 104 BPM Punjabi Bhangra & Dhol Groove
      const interval = 60000 / 104 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPunjabiBhangraStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'punjabi-soft') {
      // Gentle Punjabi Romantic Flute & Guitar
      const interval = 60000 / 84 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPunjabiRomanticStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'hindi-romance') {
      // Soulful Bollywood Romantic Guitar & Piano
      const interval = 1500;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playHindiRomanceStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playHindiRomanceStep(0);
    } else if (track.id === 'theme-starlight') {
      // Dreamy Cinematic Orchestral Strings & Celeste BGM
      const interval = 1800;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playStarlightThemeStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playStarlightThemeStep(0);
    } else if (track.id === 'party-celebration') {
      // Upbeat Party Dance Synthesizer
      const interval = 60000 / 126 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPartyStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'birthday-acoustic') {
      // Gentle Happy Birthday Chimes
      const interval = 420;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playBirthdayChimeStep(this.synthStep % 24);
        this.synthStep++;
      }, interval);
    } else {
      // Midnight Lo-Fi Love Chords
      const interval = 1600;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playLofiLoveStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playLofiLoveStep(0);
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

  // 1. Punjabi Bhangra Step (Dhol Chaal + Tumbi Riffs)
  private playPunjabiBhangraStep(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Authentic Dhol Downbeat & Bass Thud on 0, 4, 8, 12
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.16); // Dhol pitch bend
      gain.gain.setValueAtTime(this.isDucked ? 0.04 : this.baseVolume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    // Dhol rim slap on beat 2, 6, 10, 14
    if (step % 4 === 2) {
      this.playTone(880, 0.06, 'triangle', 0.14, 0.01);
    }

    // High energetic Punjabi Tumbi Melody Riff
    const tumbiNotes = [587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 493.88];
    const note = tumbiNotes[step % tumbiNotes.length];
    this.playTone(note, 0.15, 'sawtooth', 0.12, 0.02);
  }

  // 2. Punjabi Romantic Step (Kinna Chir / Flute Romance)
  private playPunjabiRomanticStep(step: number) {
    // E minor romantic progression chords & acoustic flute
    const chords = [
      [164.81, 246.94, 329.63, 392.0], // Em
      [146.83, 220.0, 293.66, 369.99],  // D
      [130.81, 196.0, 261.63, 329.63],  // C
      [146.83, 220.0, 293.66, 440.0],   // D
    ];
    const chord = chords[Math.floor(step / 4) % 4];
    if (step % 4 === 0) {
      chord.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 1.8, 'triangle', 0.16, 0.1);
        }, i * 80);
      });
    }

    // Soft flute ornament
    const fluteNotes = [659.25, 739.99, 783.99, 880.0, 987.77];
    if (step % 2 === 1) {
      const note = fluteNotes[(step * 2) % fluteNotes.length];
      this.playTone(note, 0.35, 'sine', 0.1, 0.06);
    }
  }

  // 3. Hindi Romantic Chords (Tum Se Hi / Kesariya style)
  private playHindiRomanceStep(step: number) {
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C maj
      [220.0, 261.63, 329.63, 440.0],  // Am
      [174.61, 220.0, 261.63, 349.23], // F maj
      [196.0, 246.94, 293.66, 392.0],  // G maj
    ];
    const notes = chords[step % 4];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.2, 'triangle', 0.18, 0.1);
        this.playTone(freq * 2, 1.2, 'sine', 0.08, 0.08); // High harmonic shimmer
      }, idx * 130);
    });
  }

  // 4. Starlight Symphony BGM (Ethereal Strings & Celeste)
  private playStarlightThemeStep(step: number) {
    const celestialChords = [
      [329.63, 493.88, 659.25, 987.77], // E maj9
      [293.66, 440.0, 587.33, 880.0],   // D maj9
      [261.63, 392.0, 523.25, 783.99],  // C maj9
      [246.94, 369.99, 493.88, 739.99], // Bm7
    ];
    const notes = celestialChords[step % 4];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 2.5, 'sine', 0.15, 0.2);
        this.playTone(freq * 2, 1.8, 'triangle', 0.06, 0.1);
      }, i * 160);
    });
  }

  // 5. Midnight Lo-Fi Love Chords
  private playLofiLoveStep(step: number) {
    const chords = [
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
    ];
    const notes = chords[step % 4];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.0, 'triangle', 0.16, 0.08);
      }, idx * 100);
    });
  }

  // 6. Upbeat Party Step
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

    const bassScale = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 110];
    const note = bassScale[step % bassScale.length];
    this.playTone(note, 0.2, 'sawtooth', 0.12, 0.02);

    if (step === 2 || step === 6 || step === 10 || step === 14) {
      this.playTone(1046.5, 0.1, 'sine', 0.08, 0.01);
    }
  }

  // 7. Happy Birthday Chimes
  private playBirthdayChimeStep(step: number) {
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

  // Acoustic Sound Effects
  public playPopperCannonSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.25);

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

  public playPopperBurstSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

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

      setTimeout(() => {
        this.playTwinkle();
      }, 70);
    } catch {
      // Ignored
    }
  }

  public playCakeSplatSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignored
    }
  }

  public playCakeDeliverySound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6 Fanfare
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.25, 'triangle', 0.2, 0.02);
        }, i * 90);
      });
    } catch {
      // Ignored
    }
  }

  public playTwinkle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [659.25, 880.0, 1174.66];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.25, 'sine', 0.15, 0.02);
        }, i * 60);
      });
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundManager();
