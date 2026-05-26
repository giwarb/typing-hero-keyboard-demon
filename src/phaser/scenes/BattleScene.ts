import Phaser from 'phaser';
import type { GameSnapshot } from '../../game/simulation/state';

const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export class BattleScene extends Phaser.Scene {
  private hero!: Phaser.GameObjects.Image;
  private enemy!: Phaser.GameObjects.Image;
  private playerFx!: Phaser.GameObjects.Image;
  private enemyFx!: Phaser.GameObjects.Image;
  private snapshot: GameSnapshot | null = null;
  private attackT = 0;
  private hurtT = 0;

  constructor() {
    super('BattleScene');
  }

  preload(): void {
    this.load.image('bg-battlefield', assetUrl('assets/generated/battlefield.png'));
    this.load.image('hero-idle', assetUrl('assets/generated/hero-idle.png'));
    this.load.image('hero-attack', assetUrl('assets/generated/hero-attack.png'));
    this.load.image('hero-hurt', assetUrl('assets/generated/hero-hurt.png'));
    this.load.image('hero-victory', assetUrl('assets/generated/hero-victory.png'));
    this.load.image('enemy-slime', assetUrl('assets/generated/enemy-slime.png'));
    this.load.image('enemy-mushroom', assetUrl('assets/generated/enemy-mushroom.png'));
    this.load.image('enemy-mimic', assetUrl('assets/generated/enemy-mimic.png'));
    this.load.image('enemy-boss', assetUrl('assets/generated/enemy-boss.png'));
    this.load.image('enemy-jelly', assetUrl('assets/generated/enemy-jelly.png'));
    this.load.image('enemy-book', assetUrl('assets/generated/enemy-book.png'));
    this.load.image('enemy-carrot', assetUrl('assets/generated/enemy-carrot.png'));
    this.load.image('enemy-robot', assetUrl('assets/generated/enemy-robot.png'));
    this.load.image('fx-slash', assetUrl('assets/generated/fx-slash.png'));
    this.load.image('fx-magic', assetUrl('assets/generated/fx-magic.png'));
    this.load.image('fx-hit', assetUrl('assets/generated/fx-hit.png'));
    this.load.image('fx-counter', assetUrl('assets/generated/fx-counter.png'));
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#1278ca');
    this.createBackdrop();
    this.hero = this.add.image(185, 350, 'hero-idle').setOrigin(0.5, 1).setScale(0.46);
    this.enemy = this.add.image(1080, 376, 'enemy-slime').setOrigin(0.5, 1).setScale(0.82);
    this.playerFx = this.add.image(820, 325, 'fx-slash').setVisible(false).setScale(0.74);
    this.enemyFx = this.add.image(360, 330, 'fx-counter').setVisible(false).setScale(0.62);
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
      this.playerFx.setVisible(true);
      this.playerFx.setAlpha(Math.min(1, this.attackT / 120));
      this.playerFx.setScale(0.72 + Math.sin(time * 28) * 0.04);
      this.playerFx.rotation = Math.sin(time * 18) * 0.05;
      this.enemy.setAlpha(Math.sin(time * 48) > 0 ? 0.55 : 1);
    } else {
      this.hero.setTexture(this.snapshot?.ended ? 'hero-victory' : 'hero-idle');
      this.hero.x = 185;
      this.playerFx.setVisible(false);
      this.enemy.setAlpha(1);
    }
    if (this.hurtT > 0) {
      this.hurtT -= delta;
      this.hero.setTexture('hero-hurt');
      this.enemyFx.setVisible(true);
      this.enemyFx.setAlpha(Math.min(1, this.hurtT / 140));
      this.enemyFx.setScale(0.48 + Math.sin(time * 36) * 0.05);
      this.cameras.main.shake(70, 0.0035);
      this.hero.x = 185 - Math.abs(Math.sin(time * 42)) * 14;
    } else {
      this.enemyFx.setVisible(false);
    }
  }

  private applySnapshot(snapshot: GameSnapshot): void {
    const previousSprite = this.snapshot?.enemy.sprite;
    this.snapshot = snapshot;
    if (snapshot.enemy.sprite !== previousSprite) {
      this.enemy.destroy();
      this.enemy = this.createEnemyImage(snapshot);
    } else {
      this.enemy.setTexture(snapshot.enemy.sprite);
      this.enemy.setScale(snapshot.enemy.scale);
    }
    if (snapshot.attackFlash > 0) {
      this.attackT = snapshot.attackFlash;
      this.playerFx.setTexture(snapshot.enemy.kind === 'boss' ? 'fx-magic' : 'fx-slash');
    }
    if (snapshot.hurtFlash > 0) {
      this.hurtT = snapshot.hurtFlash;
      this.enemyFx.setTexture(snapshot.enemy.attackFx === 'magic' ? 'fx-magic' : 'fx-counter');
    }
  }

  private createBackdrop(): void {
    this.add.image(640, 360, 'bg-battlefield').setDisplaySize(1280, 720);
    this.add.rectangle(640, 644, 1280, 152, 0x062b38, 0.82);
  }

  private createEnemyImage(snapshot: GameSnapshot): Phaser.GameObjects.Image {
    return this.add.image(1080, 376, snapshot.enemy.sprite)
      .setOrigin(0.5, 1)
      .setScale(snapshot.enemy.scale);
  }
}
