import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';

export const createPhaserGame = (parent: HTMLElement): Phaser.Game => new Phaser.Game({
  type: Phaser.AUTO,
  parent,
  width: 1280,
  height: 720,
  backgroundColor: '#0a5dad',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BattleScene],
  render: {
    pixelArt: true,
    antialias: false,
  },
});
