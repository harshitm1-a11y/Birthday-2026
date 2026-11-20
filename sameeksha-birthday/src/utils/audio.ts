// Web Audio API ambient synthesizer for romantic/dreamy birthday music
// Completely zero-dependency, works offline, starts only when opted-in

class SoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playTwinkle() {
    try {
      this.init();
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

  public playCelebrationTune() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      // Happy birthday melody notes in C
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

  public startAmbient() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Pentatonic scale dreamy progression: C4, D4, E4, G4, A4, C5, D5, E5, G5
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C maj
      [220.0, 261.63, 329.63, 440.0],  // A min
      [174.61, 220.0, 261.63, 349.23], // F maj
      [196.0, 246.94, 293.66, 392.0],  // G maj
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft slow fade in and fade out
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 3500);
  }

  public stopAmbient() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const soundManager = new SoundManager();
