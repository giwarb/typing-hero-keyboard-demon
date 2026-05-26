import { getEnemyForWave } from '../content/enemies';
import { pickPrompt, type Prompt } from '../content/words';
import { getFingerForKey, type FingerId } from '../input/keyboard';

export type EnemyKind = 'minion' | 'boss';

export type EnemyState = {
  kind: EnemyKind;
  name: string;
  hp: number;
  maxHp: number;
  sprite: string;
  scale: number;
  attackFx: 'counter' | 'magic';
};

export type GameStats = {
  typed: number;
  correct: number;
  mistakes: number;
  defeated: number;
  bosses: number;
  streak: number;
  weakKeys: Record<string, number>;
  weakFingers: Record<FingerId, number>;
};

export type GameSnapshot = {
  started: boolean;
  ended: boolean;
  timeLeft: number;
  wave: number;
  prompt: Prompt;
  typedIndex: number;
  enemy: EnemyState;
  stats: GameStats;
  lastMistake: string | null;
  attackFlash: number;
  hurtFlash: number;
};

const createStats = (): GameStats => ({
  typed: 0,
  correct: 0,
  mistakes: 0,
  defeated: 0,
  bosses: 0,
  streak: 0,
  weakKeys: {},
  weakFingers: {
    'left-pinky': 0,
    'left-ring': 0,
    'left-middle': 0,
    'left-index': 0,
    'right-index': 0,
    'right-middle': 0,
    'right-ring': 0,
    'right-pinky': 0,
    thumb: 0,
  },
});

const createEnemy = (wave: number): EnemyState => {
  const definition = getEnemyForWave(wave);
  return {
    kind: definition.kind,
    name: definition.name,
    hp: definition.hp,
    maxHp: definition.hp,
    sprite: definition.sprite,
    scale: definition.scale,
    attackFx: definition.attackFx,
  };
};

const damageFor = (prompt: Prompt, boss: boolean): number => (
  Math.max(boss ? 74 : 96, prompt.romaji.length * 8)
);

export class TypingRpgSession {
  private snapshot: GameSnapshot;
  private readonly durationMs: number;

  constructor(durationMs = 60_000) {
    this.durationMs = durationMs;
    this.snapshot = this.createInitialSnapshot(false);
  }

  start(): GameSnapshot {
    this.snapshot = this.createInitialSnapshot(true);
    return this.getSnapshot();
  }

  tick(deltaMs: number): GameSnapshot {
    if (!this.snapshot.started || this.snapshot.ended) return this.getSnapshot();
    const nextTime = Math.max(0, this.snapshot.timeLeft - deltaMs);
    this.snapshot = {
      ...this.snapshot,
      timeLeft: nextTime,
      attackFlash: Math.max(0, this.snapshot.attackFlash - deltaMs),
      hurtFlash: Math.max(0, this.snapshot.hurtFlash - deltaMs),
      ended: nextTime <= 0,
    };
    return this.getSnapshot();
  }

  input(rawKey: string): { snapshot: GameSnapshot; event: 'correct' | 'mistake' | 'complete' | 'none' } {
    if (!this.snapshot.started || this.snapshot.ended || rawKey.length !== 1) {
      return { snapshot: this.getSnapshot(), event: 'none' };
    }

    const key = rawKey.toUpperCase();
    const expected = this.nextKey();
    const stats = { ...this.snapshot.stats };
    stats.typed += 1;

    if (key !== expected) {
      const weakFingers = { ...stats.weakFingers };
      const weakKeys = { ...stats.weakKeys };
      const finger = getFingerForKey(expected);
      weakKeys[expected] = (weakKeys[expected] ?? 0) + 1;
      weakFingers[finger] += 1;
      this.snapshot = {
        ...this.snapshot,
        stats: { ...stats, mistakes: stats.mistakes + 1, streak: 0, weakKeys, weakFingers },
        lastMistake: key,
        hurtFlash: 260,
      };
      return { snapshot: this.getSnapshot(), event: 'mistake' };
    }

    stats.correct += 1;
    stats.streak += 1;
    const typedIndex = this.snapshot.typedIndex + 1;
    if (typedIndex < this.snapshot.prompt.romaji.length) {
      this.snapshot = { ...this.snapshot, typedIndex, stats, lastMistake: null };
      return { snapshot: this.getSnapshot(), event: 'correct' };
    }

    const enemy = { ...this.snapshot.enemy };
    enemy.hp = Math.max(0, enemy.hp - damageFor(this.snapshot.prompt, enemy.kind === 'boss'));
    if (enemy.hp > 0) {
      this.snapshot = {
        ...this.snapshot,
        typedIndex: 0,
        prompt: pickPrompt(this.snapshot.wave + stats.correct, enemy.kind === 'boss'),
        enemy,
        stats,
        attackFlash: 360,
        lastMistake: null,
      };
      return { snapshot: this.getSnapshot(), event: 'complete' };
    }

    const nextWave = this.snapshot.wave + 1;
    const nextEnemy = createEnemy(nextWave);
    const nextStats = {
      ...stats,
      defeated: stats.defeated + 1,
      bosses: stats.bosses + (this.snapshot.enemy.kind === 'boss' ? 1 : 0),
    };
    this.snapshot = {
      ...this.snapshot,
      wave: nextWave,
      typedIndex: 0,
      prompt: pickPrompt(nextWave + stats.correct, nextEnemy.kind === 'boss'),
      enemy: nextEnemy,
      stats: nextStats,
      attackFlash: 420,
      lastMistake: null,
    };
    return { snapshot: this.getSnapshot(), event: 'complete' };
  }

  nextKey(): string {
    return this.snapshot.prompt.romaji[this.snapshot.typedIndex] ?? '';
  }

  getSnapshot(): GameSnapshot {
    return structuredClone(this.snapshot);
  }

  private createInitialSnapshot(started: boolean): GameSnapshot {
    const enemy = createEnemy(0);
    return {
      started,
      ended: false,
      timeLeft: this.durationMs,
      wave: 0,
      prompt: pickPrompt(0, false),
      typedIndex: 0,
      enemy,
      stats: createStats(),
      lastMistake: null,
      attackFlash: 0,
      hurtFlash: 0,
    };
  }
}

export const getAccuracy = (stats: GameStats): number => (
  stats.typed === 0 ? 100 : Math.round((stats.correct / stats.typed) * 100)
);

export const getWeakestKey = (stats: GameStats): string => {
  const entries = Object.entries(stats.weakKeys).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? 'なし';
};

export const getWeakestFinger = (stats: GameStats): FingerId | 'none' => {
  const entries = Object.entries(stats.weakFingers).sort((a, b) => b[1] - a[1]);
  return entries[0] && entries[0][1] > 0 ? (entries[0][0] as FingerId) : 'none';
};

export type Rank = {
  label: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  title: string;
  description: string;
  nextTarget: number | null;
};

const rankTable: Array<Omit<Rank, 'nextTarget'>> = [
  { label: 'D', title: 'ホームポジション見習い', description: 'まずは正しい指を見ながら、ゆっくり正確に打てています。' },
  { label: 'C', title: 'ことばの旅人', description: 'キーの場所を少しずつ覚えています。毎日1分でかなり伸びます。' },
  { label: 'B', title: 'タイピング剣士', description: '小学生の練習としてかなり良い速さです。ミスを減らすと一段上がります。' },
  { label: 'A', title: 'キーボード勇者', description: '学校の課題入力ならかなり頼れる速さです。指使いも意識できています。' },
  { label: 'S', title: '高速の魔法使い', description: '一般的な大人の実用速度に近いレベルです。正確さを保てば強いです。' },
  { label: 'SS', title: '達人タイピスト', description: '熟練者レベルです。1分計測でもかなり高い集中力が必要です。' },
  { label: 'SSS', title: '伝説の入力勇者', description: '人間の高速タイピング領域に迫る速さです。正確率も含めて別格です。' },
];

const rankThresholds = [0, 35, 70, 110, 160, 220, 300];

export const getRank = (stats: GameStats): Rank => {
  const accuracy = getAccuracy(stats);
  const effectiveCpm = Math.round(stats.correct * Math.max(0.25, accuracy / 100));
  let index = 0;
  for (let i = 0; i < rankThresholds.length; i += 1) {
    if (effectiveCpm >= rankThresholds[i] && accuracy >= (i >= 4 ? 88 : 0)) index = i;
  }
  return { ...rankTable[index], nextTarget: rankThresholds[index + 1] ?? null };
};
