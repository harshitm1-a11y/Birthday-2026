// Advanced Audio Manager with Multi-Genre Playlist (Hindi, Punjabi, Theme/BGM, Birthday, Party), Audio Ducking, and Sound Effects
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
  // ========== 1. HINDI ROMANTIC VOCAL HITS ==========
  {
    id: 'hindi-tum-hi-ho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh (Aashiqui 2)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tum-hi-ho.mp3',
    duration: '4:22',
    description: 'Iconic heartfelt Bollywood romantic ballad with soulful Arijit Singh vocals',
  },
  {
    id: 'hindi-channa-mereya',
    title: 'Channa Mereya',
    artist: 'Arijit Singh (Ae Dil Hai Mushkil)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-channa-mereya.mp3',
    duration: '4:49',
    description: 'Soul-stirring romantic masterpiece by Arijit Singh',
  },
  {
    id: 'hindi-raataan-lambiyan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal & Asees Kaur (Shershaah)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-raataan-lambiyan.mp3',
    duration: '3:50',
    description: 'Heart-touching romantic melody with magical male-female duet vocals',
  },
  {
    id: 'hindi-dil-diyan-gallan',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-dil-diyan-gallan.mp3',
    duration: '4:20',
    description: 'Soulful romantic waltz celebrating true love and sweet moments',
  },
  {
    id: 'hindi-chahun-main-ya-naa',
    title: 'Chahun Main Ya Naa',
    artist: 'Arijit Singh & Palak Muchhal',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-chahun-main-ya-naa.mp3',
    duration: '5:04',
    description: 'Pure romantic confession with angelic male and female vocals',
  },
  {
    id: 'hindi-tujh-mein-rab',
    title: 'Tujh Mein Rab Dikhta Hai',
    artist: 'Roop Kumar Rathod',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tujh-mein-rab.mp3',
    duration: '4:41',
    description: 'Timeless anthem of unconditional love and devotion',
  },
  {
    id: 'hindi-sunn-raha-hai',
    title: 'Sunn Raha Hai Na Tu',
    artist: 'Ankit Tiwari (Aashiqui 2)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-sunn-raha-hai.mp3',
    duration: '6:30',
    description: 'Emotionally intense romantic rock ballad with soaring vocals',
  },
  {
    id: 'hindi-tera-ban-jaunga',
    title: 'Tera Ban Jaunga',
    artist: 'Akhil Sachdeva & Tulsi Kumar',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tera-ban-jaunga.mp3',
    duration: '3:56',
    description: 'Romantic pledge of eternal love and togetherness',
  },

  // ========== 2. BIRTHDAY CELEBRATION HITS ==========
  {
    id: 'birthday-pop',
    title: 'Happy Birthday Pop Celebration',
    artist: 'Joyful Birthday Pop Anthem',
    category: 'birthday',
    type: 'file',
    src: '/audio/birthday-pop.mp3',
    duration: '3:12',
    description: 'Upbeat, modern, catchy celebration birthday song for cake cutting',
  },
  {
    id: 'bollywood-birthday',
    title: 'Baar Baar Din Ye Aaye',
    artist: 'Mohammed Rafi (Farz)',
    category: 'birthday',
    type: 'file',
    src: '/audio/bollywood-birthday.mp3',
    duration: '4:48',
    description: 'All-time classic Bollywood birthday anthem for Sameeksha baby',
  },
  {
    id: 'birthday-teddy',
    title: 'Teddy Sings Happy Birthday',
    artist: 'Cute Mascot Ensemble',
    category: 'birthday',
    type: 'file',
    src: '/audio/birthday-teddy.mp3',
    duration: '2:35',
    description: 'Adorable mascot song celebrating Sameeksha\'s 23rd birthday',
  },

  // ========== 3. PUNJABI REAL VOCAL HITS ==========
  {
    id: 'punjabi-bhangra',
    title: 'Mundian To Bach Ke',
    artist: 'Panjabi MC & Labh Janjua',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-bhangra.mp3',
    duration: '3:55',
    description: 'Iconic worldwide Punjabi anthem with heavy dhol, tumbi and energetic vocals',
  },
  {
    id: 'party-angreji-beat',
    title: 'Angreji Beat Te',
    artist: 'Gippy Grewal & Yo Yo Honey Singh',
    category: 'punjabi',
    type: 'file',
    src: '/audio/party-angreji-beat.mp3',
    duration: '3:30',
    description: 'Massive Punjabi party banger with energetic dhol and party rhythm',
  },
  {
    id: 'punjabi-blue-eyes',
    title: 'Blue Eyes',
    artist: 'Yo Yo Honey Singh',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-blue-eyes.mp3',
    duration: '3:40',
    description: 'Chart-topping Punjabi dance pop hit for Sameeksha',
  },
  {
    id: 'punjabi-laung-gawacha',
    title: 'Mera Laung Gawacha',
    artist: 'Bhangra Club Legends',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-laung-gawacha.mp3',
    duration: '7:26',
    description: 'All-time Punjabi folk-pop classic with soulful vocals and thumping beats',
  },
  {
    id: 'punjabi-gidda-bhangra',
    title: 'Gidda Pao Haan Deo',
    artist: 'Bhangra Dhol Beats',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-gidda-bhangra.mp3',
    duration: '3:38',
    description: 'High voltage Punjabi Gidda dance celebration track',
  },

  // ========== 4. PARTY DANCE BUSTERS ==========
  {
    id: 'party-brown-rang',
    title: 'Brown Rang',
    artist: 'Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-brown-rang.mp3',
    duration: '2:58',
    description: 'Iconic dance party anthem that gets everyone moving',
  },
  {
    id: 'party-dope-shope',
    title: 'Dope Shope',
    artist: 'Deep Money & Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-dope-shope.mp3',
    duration: '3:10',
    description: 'Super-hit party electronic club groove',
  },
  {
    id: 'party-love-dose',
    title: 'Love Dose',
    artist: 'Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-love-dose.mp3',
    duration: '3:48',
    description: 'Flirty, joyful party romance dance hit',
  },
];

export interface PhotoReelTrack {
  trackId: string;
  songTitle: string;
  artist: string;
  chorusStartTime: number; // In seconds, starting right at the iconic hook/chorus
}

// Reel-style vocal soundtracks mapped uniquely to each memory photo!
export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [
  { trackId: 'hindi-channa-mereya', songTitle: 'Channa Mereya', artist: 'Arijit Singh', chorusStartTime: 58 },
  { trackId: 'hindi-tum-hi-ho', songTitle: 'Tum Hi Ho', artist: 'Arijit Singh', chorusStartTime: 48 },
  { trackId: 'hindi-raataan-lambiyan', songTitle: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees Kaur', chorusStartTime: 56 },
  { trackId: 'hindi-chahun-main-ya-naa', songTitle: 'Chahun Main Ya Naa', artist: 'Arijit Singh & Palak Muchhal', chorusStartTime: 50 },
  { trackId: 'hindi-dil-diyan-gallan', songTitle: 'Dil Diyan Gallan', artist: 'Atif Aslam', chorusStartTime: 52 },
  { trackId: 'hindi-tujh-mein-rab', songTitle: 'Tujh Mein Rab Dikhta Hai', artist: 'Roop Kumar Rathod', chorusStartTime: 42 },
  { trackId: 'hindi-sunn-raha-hai', songTitle: 'Sunn Raha Hai Na Tu', artist: 'Ankit Tiwari', chorusStartTime: 64 },
  { trackId: 'punjabi-blue-eyes', songTitle: 'Blue Eyes', artist: 'Yo Yo Honey Singh', chorusStartTime: 44 },
  { trackId: 'party-brown-rang', songTitle: 'Brown Rang', artist: 'Yo Yo Honey Singh', chorusStartTime: 38 },
  { trackId: 'party-love-dose', songTitle: 'Love Dose', artist: 'Yo Yo Honey Singh', chorusStartTime: 50 },
  { trackId: 'party-angreji-beat', songTitle: 'Angreji Beat', artist: 'Gippy Grewal & Honey Singh', chorusStartTime: 34 },
  { trackId: 'party-dope-shope', songTitle: 'Dope Shope', artist: 'Deep Money & Honey Singh', chorusStartTime: 42 },
  { trackId: 'punjabi-bhangra', songTitle: 'Mundian To Bach Ke', artist: 'Panjabi MC & Labh Janjua', chorusStartTime: 32 },
  { trackId: 'punjabi-laung-gawacha', songTitle: 'Mera Laung Gawacha', artist: 'Bhangra Club Legends', chorusStartTime: 40 },
  { trackId: 'punjabi-gidda-bhangra', songTitle: 'Gidda Pao Haan Deo', artist: 'Bhangra Dhol Beats', chorusStartTime: 30 },
  { trackId: 'hindi-tera-ban-jaunga', songTitle: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva & Tulsi Kumar', chorusStartTime: 35 },
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

      this.audioElement.addEventListener('timeupdate', () => {
        this.notify();
      });

      this.audioElement.addEventListener('loadedmetadata', () => {
        this.notify();
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

  public getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  public getDuration(): number {
    return this.audioElement && !isNaN(this.audioElement.duration)
      ? this.audioElement.duration
      : 0;
  }

  public seekTo(seconds: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration || 0));
      this.notify();
    }
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

  // Play a dedicated 30-second vocal reel audio for memory photo modals
  public playReelAudio(src: string, streamUrl?: string) {
    this.initCtx();
    const assetUrl = getAssetUrl(src);
    if (!this.audioElement) {
      this.initAudioElement();
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = assetUrl;
      this.audioElement.currentTime = 0;
      this.audioElement.loop = true;
      this.audioElement.volume = this.baseVolume;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Reel local audio play failed, falling back to stream:', err);
          if (streamUrl && this.audioElement) {
            this.audioElement.src = streamUrl;
            this.audioElement.play().catch(() => {});
          }
        });
      }
      this.isAudioPlaying = true;
      this.notify();
    }
  }

  public restoreTrack(trackId: string) {
    const idx = PLAYLIST_TRACKS.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      this.currentTrackIndex = idx;
    }
    this.switchTrack();
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

  public playRandomTrack() {
    if (PLAYLIST_TRACKS.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * PLAYLIST_TRACKS.length);
    if (nextIdx === this.currentTrackIndex) {
      nextIdx = (nextIdx + 1) % PLAYLIST_TRACKS.length;
    }
    this.currentTrackIndex = nextIdx;
    this.switchTrack();
  }

  private switchTrack() {
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];
    this.stopSynthPlayback();
    this.initAudioElement();

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
      const interval = 60000 / 104 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPunjabiBhangraStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'punjabi-soft' || track.id === 'punjabi-laung-laachi') {
      const interval = 60000 / 84 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPunjabiRomanticStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'punjabi-ikk-kudi') {
      const interval = 60000 / 78 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPunjabiSoulStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'hindi-romance-synth' || track.id === 'hindi-channa-mereya') {
      const interval = 1500;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playHindiRomanceStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playHindiRomanceStep(0);
    } else if (track.id === 'hindi-tum-hi-ho') {
      const interval = 1400;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playTumHiHoStep(this.synthStep % 8);
        this.synthStep++;
      }, interval);
      this.playTumHiHoStep(0);
    } else if (track.id === 'hindi-kal-ho-naa-ho') {
      const interval = 1600;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playKalHoNaaHoStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playKalHoNaaHoStep(0);
    } else if (track.id === 'hindi-raabta') {
      const interval = 1300;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playRaabtaStep(this.synthStep % 8);
        this.synthStep++;
      }, interval);
      this.playRaabtaStep(0);
    } else if (track.id === 'theme-starlight' || track.id === 'theme-fairy-garden') {
      const interval = 1800;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playStarlightThemeStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playStarlightThemeStep(0);
    } else if (track.id === 'theme-ocean-waves') {
      const interval = 2200;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playOceanAmbientStep(this.synthStep % 4);
        this.synthStep++;
      }, interval);
      this.playOceanAmbientStep(0);
    } else if (track.id === 'party-celebration' || track.id === 'party-desi-beats') {
      const interval = 60000 / 126 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playPartyStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'party-retro-disco') {
      const interval = 60000 / 118 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playRetroDiscoStep(this.synthStep % 16);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'party-edm-drop') {
      const interval = 60000 / 140 / 2;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playEDMStep(this.synthStep % 32);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'birthday-acoustic') {
      const interval = 420;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playBirthdayChimeStep(this.synthStep % 24);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'birthday-piano') {
      const interval = 480;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playBirthdayPianoStep(this.synthStep % 24);
        this.synthStep++;
      }, interval);
    } else if (track.id === 'birthday-orchestra') {
      const interval = 500;
      this.synthIntervalId = setInterval(() => {
        if (!this.isAudioPlaying) return;
        this.playBirthdayOrchestraStep(this.synthStep % 24);
        this.synthStep++;
      }, interval);
    } else {
      // Default: Midnight Lo-Fi Love Chords
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

    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.16);
      gain.gain.setValueAtTime(this.isDucked ? 0.04 : this.baseVolume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    if (step % 4 === 2) {
      this.playTone(880, 0.06, 'triangle', 0.14, 0.01);
    }

    const tumbiNotes = [587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 493.88];
    const note = tumbiNotes[step % tumbiNotes.length];
    this.playTone(note, 0.15, 'sawtooth', 0.12, 0.02);
  }

  // 2. Punjabi Romantic Step (Kinna Chir / Flute Romance)
  private playPunjabiRomanticStep(step: number) {
    const chords = [
      [164.81, 246.94, 329.63, 392.0],
      [146.83, 220.0, 293.66, 369.99],
      [130.81, 196.0, 261.63, 329.63],
      [146.83, 220.0, 293.66, 440.0],
    ];
    const chord = chords[Math.floor(step / 4) % 4];
    if (step % 4 === 0) {
      chord.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 1.8, 'triangle', 0.16, 0.1);
        }, i * 80);
      });
    }

    const fluteNotes = [659.25, 739.99, 783.99, 880.0, 987.77];
    if (step % 2 === 1) {
      const note = fluteNotes[(step * 2) % fluteNotes.length];
      this.playTone(note, 0.35, 'sine', 0.1, 0.06);
    }
  }

  // Punjabi Soul Step (Ikk Kudi style)
  private playPunjabiSoulStep(step: number) {
    const chords = [
      [196.0, 293.66, 392.0, 493.88],  // G
      [174.61, 261.63, 349.23, 440.0],  // F
      [164.81, 246.94, 329.63, 392.0],  // Em
      [146.83, 220.0, 293.66, 369.99],  // D
    ];
    const chord = chords[Math.floor(step / 4) % 4];
    if (step % 4 === 0) {
      chord.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 2.0, 'triangle', 0.14, 0.12);
        }, i * 100);
      });
    }
    // Harmonica-like melody
    const melodyNotes = [493.88, 587.33, 659.25, 587.33, 493.88, 440.0, 392.0, 440.0];
    if (step % 2 === 1) {
      this.playTone(melodyNotes[step % melodyNotes.length], 0.4, 'sine', 0.08, 0.04);
    }
  }

  // 3. Hindi Romantic Chords (Tum Se Hi / Kesariya style)
  private playHindiRomanceStep(step: number) {
    const chords = [
      [261.63, 329.63, 392.0, 523.25],
      [220.0, 261.63, 329.63, 440.0],
      [174.61, 220.0, 261.63, 349.23],
      [196.0, 246.94, 293.66, 392.0],
    ];
    const notes = chords[step % 4];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.2, 'triangle', 0.18, 0.1);
        this.playTone(freq * 2, 1.2, 'sine', 0.08, 0.08);
      }, idx * 130);
    });
  }

  // Tum Hi Ho Piano Step
  private playTumHiHoStep(step: number) {
    // Am - F - C - G progression with arpeggio
    const chords = [
      [220.0, 261.63, 329.63],  // Am
      [174.61, 220.0, 261.63],  // F
      [261.63, 329.63, 392.0],  // C
      [196.0, 246.94, 293.66],  // G
    ];
    const chord = chords[Math.floor(step / 2) % 4];
    if (step % 2 === 0) {
      chord.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 1.8, 'sine', 0.2, 0.08);
          this.playTone(freq * 2, 1.0, 'triangle', 0.06, 0.1);
        }, i * 150);
      });
    }
    // Melody line
    const melody = [659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 783.99];
    if (step % 2 === 1) {
      this.playTone(melody[step % melody.length], 0.8, 'sine', 0.12, 0.05);
    }
  }

  // Kal Ho Naa Ho Strings Step
  private playKalHoNaaHoStep(step: number) {
    const chords = [
      [293.66, 369.99, 440.0, 587.33],  // Dm
      [261.63, 329.63, 392.0, 523.25],  // C
      [233.08, 293.66, 349.23, 466.16],  // Bb
      [220.0, 277.18, 329.63, 440.0],   // A
    ];
    const notes = chords[step % 4];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.4, 'triangle', 0.16, 0.15);
        this.playTone(freq * 1.5, 1.6, 'sine', 0.05, 0.1);
      }, idx * 140);
    });
  }

  // Raabta / Pehla Nasha Fusion Step
  private playRaabtaStep(step: number) {
    const chords = [
      [329.63, 415.30, 493.88, 659.25],  // E
      [293.66, 369.99, 440.0, 587.33],   // D
      [261.63, 329.63, 392.0, 523.25],   // C
      [220.0, 277.18, 329.63, 440.0],    // A
    ];
    const chord = chords[Math.floor(step / 2) % 4];
    if (step % 2 === 0) {
      chord.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 1.6, 'triangle', 0.15, 0.08);
        }, i * 120);
      });
    }
    // Flute ornament
    const flute = [659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25, 587.33];
    if (step % 2 === 1) {
      this.playTone(flute[step % flute.length], 0.3, 'sine', 0.09, 0.04);
    }
  }

  // 4. Starlight Symphony BGM
  private playStarlightThemeStep(step: number) {
    const celestialChords = [
      [329.63, 493.88, 659.25, 987.77],
      [293.66, 440.0, 587.33, 880.0],
      [261.63, 392.0, 523.25, 783.99],
      [246.94, 369.99, 493.88, 739.99],
    ];
    const notes = celestialChords[step % 4];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 2.5, 'sine', 0.15, 0.2);
        this.playTone(freq * 2, 1.8, 'triangle', 0.06, 0.1);
      }, i * 160);
    });
  }

  // Ocean Ambient Step
  private playOceanAmbientStep(step: number) {
    const pads = [
      [174.61, 261.63, 349.23],  // F
      [164.81, 246.94, 329.63],  // Em
      [146.83, 220.0, 293.66],  // D
      [130.81, 196.0, 261.63],  // C
    ];
    const pad = pads[step % 4];
    pad.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 3.0, 'sine', 0.1, 0.4);
      }, i * 200);
    });
  }

  // 5. Midnight Lo-Fi Love Chords
  private playLofiLoveStep(step: number) {
    const chords = [
      [293.66, 349.23, 440.0, 523.25],
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0],
      [174.61, 220.0, 261.63, 329.63],
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

  // Retro Disco Step
  private playRetroDiscoStep(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Kick on every beat
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(this.isDucked ? 0.03 : this.baseVolume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    // Funky bass line
    const discoLine = [130.81, 146.83, 164.81, 146.83, 130.81, 110, 98, 110];
    this.playTone(discoLine[step % discoLine.length], 0.18, 'sawtooth', 0.1, 0.02);

    // Hi-hat on offbeats
    if (step % 2 === 1) {
      this.playTone(5000, 0.04, 'square', 0.04, 0.005);
    }

    // String stab
    if (step === 0 || step === 8) {
      this.playTone(392.0, 0.3, 'triangle', 0.12, 0.02);
      this.playTone(493.88, 0.3, 'triangle', 0.1, 0.02);
    }
  }

  // EDM Step
  private playEDMStep(step: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Heavy kick
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);
      gain.gain.setValueAtTime(this.isDucked ? 0.04 : this.baseVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    // Synth lead
    const edmLead = [329.63, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0];
    if (step % 2 === 0) {
      this.playTone(edmLead[(step / 2) % edmLead.length], 0.12, 'sawtooth', 0.08, 0.01);
    }

    // Sub bass
    if (step % 8 === 0) {
      this.playTone(55, 0.5, 'sine', 0.2, 0.02);
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

  // Birthday Piano Waltz
  private playBirthdayPianoStep(step: number) {
    const melody = [
      392.0, 392.0, 440.0, 392.0, 523.25, 493.88, 0,
      392.0, 392.0, 440.0, 392.0, 587.33, 523.25, 0,
      392.0, 392.0, 783.99, 659.25, 523.25, 493.88, 440.0, 0,
      698.46, 698.46, 659.25, 523.25, 587.33, 523.25,
    ];
    const note = melody[step % melody.length];
    if (note > 0) {
      // Piano-like with quick attack
      this.playTone(note, 0.5, 'triangle', 0.2, 0.01);
      // Add jazz harmony
      if (step % 3 === 0) {
        this.playTone(note * 1.25, 0.4, 'sine', 0.08, 0.02);
      }
    }
  }

  // Birthday Orchestra
  private playBirthdayOrchestraStep(step: number) {
    const melody = [
      392.0, 392.0, 440.0, 392.0, 523.25, 493.88, 0,
      392.0, 392.0, 440.0, 392.0, 587.33, 523.25, 0,
      392.0, 392.0, 783.99, 659.25, 523.25, 493.88, 440.0, 0,
      698.46, 698.46, 659.25, 523.25, 587.33, 523.25,
    ];
    const note = melody[step % melody.length];
    if (note > 0) {
      // Orchestral: multiple layers
      this.playTone(note, 0.7, 'sine', 0.18, 0.03);
      this.playTone(note, 0.6, 'triangle', 0.12, 0.05);
      this.playTone(note * 0.5, 0.5, 'sine', 0.08, 0.1); // Bass octave
      // Brass-like high harmonic
      if (step % 4 === 0) {
        this.playTone(note * 2, 0.3, 'sawtooth', 0.06, 0.02);
      }
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

  public playCakeSliceSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3200, now);
      bandpass.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.15);

      const sliceChords = [523.25, 659.25, 783.99, 1046.5];
      sliceChords.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, 'triangle', 0.22, 0.02);
        }, 120 + idx * 70);
      });
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
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
