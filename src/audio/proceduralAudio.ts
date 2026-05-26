const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export class ProceduralAudio {
  private music: HTMLAudioElement | null = null;
  private correctSound = new Audio(assetUrl('assets/audio/type-correct.wav'));
  private attackSound = new Audio(assetUrl('assets/audio/attack.wav'));
  private mistakeSound = new Audio(assetUrl('assets/audio/mistake.wav'));
  private dragonSound = new Audio(assetUrl('assets/audio/dragon.wav'));

  async start(): Promise<void> {
    if (!this.music) {
      this.music = new Audio(assetUrl('assets/audio/adventure-theme.wav'));
      this.music.loop = true;
      this.music.volume = 0.42;
    }
    await this.music.play();
  }

  correct(): void {
    this.play(this.correctSound, 0.32);
  }

  attack(): void {
    this.play(this.attackSound, 0.44);
  }

  mistake(): void {
    this.play(this.mistakeSound, 0.36);
  }

  dragon(): void {
    this.play(this.dragonSound, 0.54);
  }

  private play(sound: HTMLAudioElement, volume: number): void {
    const clone = sound.cloneNode(true) as HTMLAudioElement;
    clone.volume = volume;
    void clone.play();
  }
}
