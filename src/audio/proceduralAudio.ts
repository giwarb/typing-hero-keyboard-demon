type Note = { freq: number; at: number; length: number; gain: number };

const melody: Note[] = [
  { freq: 392, at: 0, length: 0.18, gain: 0.034 },
  { freq: 494, at: 0.2, length: 0.16, gain: 0.03 },
  { freq: 587, at: 0.4, length: 0.18, gain: 0.032 },
  { freq: 784, at: 0.6, length: 0.1, gain: 0.025 },
  { freq: 659, at: 0.8, length: 0.26, gain: 0.033 },
  { freq: 587, at: 1.15, length: 0.14, gain: 0.026 },
  { freq: 523, at: 1.32, length: 0.18, gain: 0.026 },
  { freq: 494, at: 1.55, length: 0.28, gain: 0.03 },
];

const bass = [
  { freq: 98, at: 0 },
  { freq: 147, at: 0.8 },
  { freq: 131, at: 1.2 },
  { freq: 110, at: 1.6 },
];

export class ProceduralAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicTimer = 0;
  private started = false;

  async start(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 18;
      compressor.ratio.value = 3;
      this.master = this.context.createGain();
      this.master.gain.value = 0.78;
      this.master.connect(compressor).connect(this.context.destination);
    }
    await this.context.resume();
    if (!this.started) {
      this.started = true;
      this.loopMusic();
    }
  }

  correct(): void {
    this.playTone(740, 0.045, 'triangle', 0.05);
    this.playTone(1110, 0.04, 'sine', 0.024, undefined, 0.03);
  }

  attack(): void {
    this.playSweep(220, 900, 0.16, 0.08);
    this.noiseHit(0.12, 0.05);
  }

  mistake(): void {
    this.playSweep(170, 90, 0.13, 0.07);
    this.noiseHit(0.08, 0.04);
  }

  private loopMusic(): void {
    if (!this.context) return;
    const baseTime = this.context.currentTime + 0.05;
    melody.forEach((note) => {
      this.playTone(note.freq, note.length, 'square', note.gain, baseTime + note.at);
      this.playTone(note.freq * 2, note.length * 0.72, 'triangle', note.gain * 0.22, baseTime + note.at + 0.012);
    });
    bass.forEach((note) => this.playTone(note.freq, 0.22, 'sawtooth', 0.025, baseTime + note.at));
    for (let i = 0; i < 8; i += 1) {
      this.noiseHit(0.032, i % 4 === 0 ? 0.028 : 0.012, baseTime + i * 0.24);
    }
    window.clearTimeout(this.musicTimer);
    this.musicTimer = window.setTimeout(() => this.loopMusic(), 1920);
  }

  private playTone(freq: number, length: number, type: OscillatorType, gain: number, at?: number, delay = 0): void {
    if (!this.context || !this.master) return;
    const now = (at ?? this.context.currentTime) + delay;
    const osc = this.context.createOscillator();
    const envelope = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'sawtooth' ? 850 : 4200;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(filter).connect(envelope).connect(this.master);
    osc.start(now);
    osc.stop(now + length + 0.02);
  }

  private playSweep(from: number, to: number, length: number, gain: number): void {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const envelope = this.context.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + length);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(envelope).connect(this.master);
    osc.start(now);
    osc.stop(now + length + 0.02);
  }

  private noiseHit(length: number, gain: number, at?: number): void {
    if (!this.context || !this.master) return;
    const now = at ?? this.context.currentTime;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1200;
    envelope.gain.setValueAtTime(gain, now);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
    source.connect(filter).connect(envelope).connect(this.master);
    source.start(now);
    source.stop(now + length);
  }
}
