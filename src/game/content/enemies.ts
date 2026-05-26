export type EnemyKind = 'minion' | 'boss' | 'ultimate';

export type EnemyDefinition = {
  kind: EnemyKind;
  name: string;
  baseHp: number;
  sprite: string;
  scale: number;
  attackFx: 'counter' | 'magic';
  tint?: number;
};

const minionRoster: Array<Omit<EnemyDefinition, 'kind' | 'baseHp'>> = [
  { name: 'グリーンスライム', sprite: 'enemy-slime', scale: 0.82, attackFx: 'magic' },
  { name: 'あおぷるジェリー', sprite: 'enemy-jelly', scale: 0.82, attackFx: 'magic' },
  { name: 'きのこマーチ', sprite: 'enemy-mushroom', scale: 0.86, attackFx: 'counter' },
  { name: 'たからばこミミック', sprite: 'enemy-mimic', scale: 0.82, attackFx: 'counter' },
  { name: 'ねむりの本ミミック', sprite: 'enemy-book', scale: 0.8, attackFx: 'counter' },
  { name: 'にんじんナイト', sprite: 'enemy-carrot', scale: 0.82, attackFx: 'counter' },
  { name: 'ゼンマイロボ', sprite: 'enemy-robot', scale: 0.82, attackFx: 'magic' },
  { name: 'レモンスライム', sprite: 'enemy-slime', scale: 0.82, attackFx: 'magic', tint: 0xfff36a },
  { name: 'さくらジェリー', sprite: 'enemy-jelly', scale: 0.82, attackFx: 'magic', tint: 0xff9fc7 },
  { name: 'よるのきのこ', sprite: 'enemy-mushroom', scale: 0.86, attackFx: 'counter', tint: 0x9fb3ff },
  { name: 'ぎんのミミック', sprite: 'enemy-mimic', scale: 0.82, attackFx: 'counter', tint: 0xd9f0ff },
  { name: 'じしょミミック', sprite: 'enemy-book', scale: 0.8, attackFx: 'counter', tint: 0xffd891 },
  { name: 'だいこんナイト', sprite: 'enemy-carrot', scale: 0.82, attackFx: 'counter', tint: 0xd7f8ff },
  { name: 'ブリキロボ', sprite: 'enemy-robot', scale: 0.82, attackFx: 'magic', tint: 0xffd2a0 },
  { name: 'エメラルドスライム', sprite: 'enemy-slime', scale: 0.86, attackFx: 'magic', tint: 0x5cffb1 },
  { name: 'こおりジェリー', sprite: 'enemy-jelly', scale: 0.86, attackFx: 'magic', tint: 0xbef5ff },
  { name: 'まほうきのこ', sprite: 'enemy-mushroom', scale: 0.9, attackFx: 'magic', tint: 0xe2b7ff },
  { name: 'おうごんミミック', sprite: 'enemy-mimic', scale: 0.86, attackFx: 'counter', tint: 0xffdf62 },
  { name: 'としょかんミミック', sprite: 'enemy-book', scale: 0.84, attackFx: 'magic', tint: 0xc9ffce },
  { name: 'キャロット隊長', sprite: 'enemy-carrot', scale: 0.9, attackFx: 'counter', tint: 0xffbf75 },
  { name: 'クロックロボ', sprite: 'enemy-robot', scale: 0.9, attackFx: 'magic', tint: 0x9fd3ff },
  { name: 'にじいろスライム', sprite: 'enemy-slime', scale: 0.94, attackFx: 'magic', tint: 0xffb6f3 },
  { name: 'ほしぞらジェリー', sprite: 'enemy-jelly', scale: 0.94, attackFx: 'magic', tint: 0x8fb0ff },
  { name: 'もりのきのこ王', sprite: 'enemy-mushroom', scale: 0.98, attackFx: 'counter', tint: 0xb6ff8a },
];

const bossRoster: Array<Omit<EnemyDefinition, 'kind' | 'baseHp'>> = [
  { name: 'キーボードの魔王', sprite: 'enemy-boss', scale: 0.74, attackFx: 'magic' },
  { name: '巨大スライム先生', sprite: 'enemy-slime', scale: 1.15, attackFx: 'magic', tint: 0xa4ff4f },
  { name: 'ロボットまじん', sprite: 'enemy-robot', scale: 1.08, attackFx: 'counter', tint: 0xffe09b },
  { name: 'ほんだなドラゴン', sprite: 'enemy-book', scale: 1.02, attackFx: 'magic', tint: 0xffd59b },
  { name: 'きのこ大王', sprite: 'enemy-mushroom', scale: 1.08, attackFx: 'counter', tint: 0xffb4b4 },
  { name: 'ゴールドミミック', sprite: 'enemy-mimic', scale: 1.02, attackFx: 'counter', tint: 0xffdc5f },
];

export const ultimateDragon: EnemyDefinition = {
  kind: 'ultimate',
  name: '究極キーボードドラゴン',
  baseHp: 920,
  sprite: 'enemy-ultimate-dragon',
  scale: 0.44,
  attackFx: 'magic',
};

export const getEnemyForWave = (wave: number, ultimate = false): EnemyDefinition => {
  if (ultimate) return ultimateDragon;
  const boss = wave % 4 === 3;
  if (boss) {
    const template = bossRoster[Math.floor(wave / 4) % bossRoster.length];
    const cycle = Math.floor(wave / 4);
    return { ...template, kind: 'boss', baseHp: 260 + cycle * 92 };
  }
  const template = minionRoster[wave % minionRoster.length];
  const cycle = Math.floor(wave / minionRoster.length);
  return { ...template, kind: 'minion', baseHp: 78 + wave * 18 + cycle * 36 };
};
