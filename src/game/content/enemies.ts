import type { EnemyKind } from '../simulation/state';

export type EnemyDefinition = {
  kind: EnemyKind;
  name: string;
  hp: number;
  sprite: string;
  scale: number;
  attackFx: 'counter' | 'magic';
};

export const minionEnemies: EnemyDefinition[] = [
  { kind: 'minion', name: 'グリーンスライム', hp: 82, sprite: 'enemy-slime', scale: 0.82, attackFx: 'magic' },
  { kind: 'minion', name: 'きのこマーチ', hp: 92, sprite: 'enemy-mushroom', scale: 0.86, attackFx: 'counter' },
  { kind: 'minion', name: 'たからばこミミック', hp: 112, sprite: 'enemy-mimic', scale: 0.82, attackFx: 'counter' },
  { kind: 'minion', name: 'ぷるぷるジェリー', hp: 88, sprite: 'enemy-jelly', scale: 0.82, attackFx: 'magic' },
  { kind: 'minion', name: 'ねむりの本ミミック', hp: 118, sprite: 'enemy-book', scale: 0.8, attackFx: 'counter' },
  { kind: 'minion', name: 'にんじんナイト', hp: 104, sprite: 'enemy-carrot', scale: 0.82, attackFx: 'counter' },
  { kind: 'minion', name: 'ゼンマイロボ', hp: 108, sprite: 'enemy-robot', scale: 0.82, attackFx: 'magic' },
];

export const bossEnemies: EnemyDefinition[] = [
  { kind: 'boss', name: 'キーボードの魔王', hp: 250, sprite: 'enemy-boss', scale: 0.74, attackFx: 'magic' },
  { kind: 'boss', name: '巨大スライム先生', hp: 230, sprite: 'enemy-slime', scale: 1.15, attackFx: 'magic' },
  { kind: 'boss', name: 'ロボットまじん', hp: 260, sprite: 'enemy-robot', scale: 1.08, attackFx: 'counter' },
  { kind: 'boss', name: 'ほんだなドラゴン', hp: 270, sprite: 'enemy-book', scale: 1.02, attackFx: 'magic' },
];

export const getEnemyForWave = (wave: number): EnemyDefinition => {
  const boss = wave % 4 === 3;
  if (boss) return bossEnemies[Math.floor(wave / 4) % bossEnemies.length];
  return minionEnemies[(wave + Math.floor(wave / 4)) % minionEnemies.length];
};
