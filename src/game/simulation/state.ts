import { pickPrompt, type Prompt } from '../content/words';
import { getFingerForKey, type FingerId } from '../input/keyboard';

export type EnemyKind = 'minion' | 'boss';
export type EnemyState = {
  kind: EnemyKind;
  name: string;
  hp: number;
  maxHp: number;
  sprite: string;
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

const minionNames = ['グリーンスライム', 'きのこマーチ', 'まんまるバット', 'たからばこミミック'];
const bossNames = ['キーボードの魔王', 'ドラゴン先生', 'ロボットまじん'];

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
  const boss = wave % 4 === 3;
  if (boss) {
    return {
      kind: 'boss',
      name: bossNames[Math.floor(wave / 4) % bossNames.length],
      hp: 210,
      maxHp: 210,
      sprite: 'boss',
    };
  }
  return {
    kind: 'minion',
    name: minionNames[wave % minionNames.length],
    hp: 90,
    maxHp: 90,
    sprite: 'slime',
  };
};

const damageFor = (prompt: Prompt, boss: boolean) => Math.max(boss ? 70 : 95, prompt.romaji.length * 9);

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
      prompt: pickPrompt(nextWave, nextEnemy.kind === 'boss'),
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
