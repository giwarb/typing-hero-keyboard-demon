import Phaser from 'phaser';
import type { GameSnapshot } from '../../game/simulation/state';

export class BattleScene extends Phaser.Scene {
  private hero!: Phaser.GameObjects.Image;
  private enemy!: Phaser.GameObjects.Image;
  private slash!: Phaser.GameObjects.Arc;
  private snapshot: GameSnapshot | null = null;
  private attackT = 0;
  private hurtT = 0;

  constructor() {
    super('BattleScene');
  }

  preload(): void {
    this.load.image('bg-battlefield', '/assets/generated/battlefield.png');
    this.load.image('hero-idle', '/assets/generated/hero-idle.png');
    this.load.image('hero-attack', '/assets/generated/hero-attack.png');
    this.load.image('hero-hurt', '/assets/generated/hero-hurt.png');
    this.load.image('hero-victory', '/assets/generated/hero-victory.png');
    this.load.image('enemy-slime', '/assets/generated/enemy-slime.png');
    this.load.image('enemy-mushroom', '/assets/generated/enemy-mushroom.png');
    this.load.image('enemy-mimic', '/assets/generated/enemy-mimic.png');
    this.load.image('enemy-boss', '/assets/generated/enemy-boss.png');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#1278ca');
    this.createBackdrop();
    this.hero = this.add.image(185, 350, 'hero-idle').setOrigin(0.5, 1).setScale(0.46);
    this.enemy = this.add.image(1080, 376, 'enemy-slime').setOrigin(0.5, 1).setScale(0.46);
    this.slash = this.add.arc(850, 312, 110, 245, 25, false, 0xffd447, 0.95);
    this.slash.setStrokeStyle(12, 0xfff2a6, 1);
    this.slash.setVisible(false);
    this.events.on('snapshot', (snapshot: GameSnapshot) => this.applySnapshot(snapshot));
  }

  update(_: number, delta: number): void {
    const time = this.time.now / 1000;
    this.hero.y = 382 + Math.sin(time * 4) * 5;
    this.enemy.y = 376 + Math.sin(time * 3.2) * 6;
    if (this.attackT > 0) {
      this.attackT -= delta;
      this.hero.setTexture('hero-attack');
      this.hero.x = 185 + Math.sin(time * 35) * 12 + 44;
      this.slash.setVisible(true);
      this.slash.rotation += delta * 0.018;
      this.enemy.setAlpha(Math.sin(time * 48) > 0 ? 0.55 : 1);
    } else {
      this.hero.setTexture(this.snapshot?.ended ? 'hero-victory' : 'hero-idle');
      this.hero.x = 185;
      this.slash.setVisible(false);
      this.enemy.setAlpha(1);
    }
    if (this.hurtT > 0) {
      this.hurtT -= delta;
      this.hero.setTexture('hero-hurt');
      this.cameras.main.shake(70, 0.0035);
      this.hero.x = 185 - Math.abs(Math.sin(time * 42)) * 14;
    }
  }

  private applySnapshot(snapshot: GameSnapshot): void {
    const wasBoss = this.snapshot?.enemy.kind === 'boss';
    this.snapshot = snapshot;
    if ((snapshot.enemy.kind === 'boss') !== wasBoss) {
      this.enemy.destroy();
      this.enemy = this.createEnemyImage(snapshot);
    } else {
      this.enemy.setTexture(this.enemyTexture(snapshot));
      this.enemy.setScale(snapshot.enemy.kind === 'boss' ? 0.42 : 0.48);
    }
    if (snapshot.attackFlash > 0) this.attackT = snapshot.attackFlash;
    if (snapshot.hurtFlash > 0) this.hurtT = snapshot.hurtFlash;
  }

  private createBackdrop(): void {
    this.add.image(640, 360, 'bg-battlefield').setDisplaySize(1280, 720);
    this.add.rectangle(640, 644, 1280, 152, 0x062b38, 0.82);
  }

  private createEnemyImage(snapshot: GameSnapshot): Phaser.GameObjects.Image {
    return this.add.image(1080, 376, this.enemyTexture(snapshot))
      .setOrigin(0.5, 1)
      .setScale(snapshot.enemy.kind === 'boss' ? 0.42 : 0.48);
  }

  private enemyTexture(snapshot: GameSnapshot): string {
    if (snapshot.enemy.kind === 'boss') return 'enemy-boss';
    return ['enemy-slime', 'enemy-mushroom', 'enemy-mimic'][snapshot.wave % 3];
  }
}
