import { type EnemyKind, getEnemyForWave } from '../content/enemies';
import { getSyllableVariants, isSyllableInputCandidate, isSyllableInputComplete, pickPrompt, type Prompt } from '../content/words';
import { getFingerForKey, type FingerId } from '../input/keyboard';

export type { EnemyKind };

export type EnemyState = {
  kind: EnemyKind;
  name: string;
  hp: number;
  maxHp: number;
  sprite: string;
  scale: number;
  attackFx: 'counter' | 'magic';
  tint?: number;
};

export type GameStats = {
  typed: number;
  correct: number;
  mistakes: number;
  defeated: number;
  bosses: number;
  streak: number;
  score: number;
  timeBonus: number;
  ultimateDefeated: boolean;
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
  typedSyllableIndex: number;
  currentInput: string;
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
  score: 0,
  timeBonus: 0,
  ultimateDefeated: false,
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

const createEnemy = (wave: number, ultimate = false): EnemyState => {
  const definition = getEnemyForWave(wave, ultimate);
  return {
    kind: definition.kind,
    name: definition.name,
    hp: definition.baseHp,
    maxHp: definition.baseHp,
    sprite: definition.sprite,
    scale: definition.scale,
    attackFx: definition.attackFx,
    tint: definition.tint,
  };
};

const shouldSpawnUltimate = (stats: GameStats, timeLeft: number): boolean => (
  !stats.ultimateDefeated && stats.correct >= 160 && getAccuracy(stats) >= 88 && timeLeft >= 10_000
);

const damageFor = (prompt: Prompt, enemy: EnemyState): number => {
  const base = Math.max(enemy.kind === 'minion' ? 78 : 64, prompt.romaji.length * 7);
  if (enemy.kind === 'ultimate') return Math.max(58, Math.round(base * 0.72));
  return base;
};

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
    const current = this.currentSyllable();
    if (!current) return { snapshot: this.getSnapshot(), event: 'none' };
    const nextInput = `${this.snapshot.currentInput}${key}`;
    const stats = { ...this.snapshot.stats };
    stats.typed += 1;

    if (!isSyllableInputCandidate(current, nextInput)) {
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
    stats.score += 1 + Math.floor(stats.streak / 20);
    const syllableComplete = isSyllableInputComplete(current, nextInput);
    const typedSyllableIndex = syllableComplete
      ? this.snapshot.typedSyllableIndex + 1
      : this.snapshot.typedSyllableIndex;
    const currentInput = syllableComplete ? '' : nextInput;
    const typedIndex = this.canonicalTypedIndex(typedSyllableIndex, currentInput);

    if (typedSyllableIndex < this.snapshot.prompt.syllables.length) {
      this.snapshot = {
        ...this.snapshot,
        typedIndex,
        typedSyllableIndex,
        currentInput,
        stats,
        lastMistake: null,
      };
      return { snapshot: this.getSnapshot(), event: 'correct' };
    }

    const enemy = { ...this.snapshot.enemy };
    enemy.hp = Math.max(0, enemy.hp - damageFor(this.snapshot.prompt, enemy));
    if (enemy.hp > 0) {
      this.snapshot = {
        ...this.snapshot,
        typedIndex: 0,
        typedSyllableIndex: 0,
        currentInput: '',
        prompt: pickPrompt(this.snapshot.wave + stats.correct, enemy.kind !== 'minion'),
        enemy,
        stats,
        attackFlash: 360,
        lastMistake: null,
      };
      return { snapshot: this.getSnapshot(), event: 'complete' };
    }

    const defeatedUltimate = this.snapshot.enemy.kind === 'ultimate';
    const timeBonus = defeatedUltimate ? Math.ceil(this.snapshot.timeLeft / 1000) * 120 : 0;
    const nextStats = {
      ...stats,
      defeated: stats.defeated + 1,
      bosses: stats.bosses + (this.snapshot.enemy.kind !== 'minion' ? 1 : 0),
      ultimateDefeated: stats.ultimateDefeated || defeatedUltimate,
      timeBonus: stats.timeBonus + timeBonus,
      score: stats.score + (this.snapshot.enemy.kind === 'minion' ? 60 : this.snapshot.enemy.kind === 'boss' ? 220 : 1200) + timeBonus,
    };

    const nextWave = this.snapshot.wave + 1;
    const spawnUltimate = shouldSpawnUltimate(nextStats, this.snapshot.timeLeft);
    const nextEnemy = createEnemy(nextWave, spawnUltimate);
    this.snapshot = {
      ...this.snapshot,
      wave: nextWave,
      typedIndex: 0,
      typedSyllableIndex: 0,
      currentInput: '',
      prompt: pickPrompt(nextWave + stats.correct, nextEnemy.kind !== 'minion'),
      enemy: nextEnemy,
      stats: nextStats,
      attackFlash: 420,
      lastMistake: null,
    };
    return { snapshot: this.getSnapshot(), event: 'complete' };
  }

  nextKey(): string {
    const syllable = this.currentSyllable();
    if (!syllable) return '';
    const input = this.snapshot.currentInput;
    const active = getSyllableVariants(syllable).find((variant) => variant.startsWith(input))
      ?? getSyllableVariants(syllable)[0]
      ?? syllable;
    return active[input.length] ?? '';
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
      typedSyllableIndex: 0,
      currentInput: '',
      enemy,
      stats: createStats(),
      lastMistake: null,
      attackFlash: 0,
      hurtFlash: 0,
    };
  }

  private currentSyllable(): string {
    return this.snapshot.prompt.syllables[this.snapshot.typedSyllableIndex] ?? '';
  }

  private canonicalTypedIndex(typedSyllableIndex: number, currentInput: string): number {
    const completed = this.snapshot.prompt.syllables
      .slice(0, typedSyllableIndex)
      .join('').length;
    return completed + currentInput.length;
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
  { label: 'D', title: 'ゆっくり見習い', description: 'まずは正しいキーと指を見ながら、あわてず一文字ずつ進もう。' },
  { label: 'C', title: 'れんしゅう勇者', description: 'ホームポジションを思い出しながら、1分の冒険に慣れてきたね。' },
  { label: 'B', title: 'ことばの戦士', description: '短い言葉を安定して打てているよ。ミスを減らすと次へ届く。' },
  { label: 'A', title: 'はやうち騎士', description: '小学生としてかなり速いペース。指の戻りも意識できているね。' },
  { label: 'S', title: 'キーボード勇者', description: '日本語ローマ字入力でかなり上級。正確さを保てているのが強い。' },
  { label: 'SS', title: 'タイピング剣聖', description: '1分でここまで打てるのは本当に速い。学校でも自慢できる力。' },
  { label: 'SSS', title: '伝説の光速勇者', description: '人間の高速タイピングでも上位級。正確さと集中力の両方がすごい。' },
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
