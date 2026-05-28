import { describe, expect, it } from 'vitest';
import { getSyllableVariants, isSyllableInputCandidate, isSyllableInputComplete, minionPrompts } from '../src/game/content/words';
import { getAccuracy, getWeakestFinger, getWeakestKey, TypingRpgSession } from '../src/game/simulation/state';

describe('TypingRpgSession', () => {
  it('advances typed index on correct input and records accuracy', () => {
    const session = new TypingRpgSession();
    session.start();

    session.input('a');
    session.input('s');

    const snapshot = session.getSnapshot();
    expect(snapshot.typedIndex).toBe(2);
    expect(snapshot.stats.correct).toBe(2);
    expect(getAccuracy(snapshot.stats)).toBe(100);
  });

  it('records weak key and finger without ending the game on mistakes', () => {
    const session = new TypingRpgSession();
    session.start();

    const result = session.input('x');
    const snapshot = result.snapshot;

    expect(result.event).toBe('mistake');
    expect(snapshot.ended).toBe(false);
    expect(snapshot.stats.mistakes).toBe(1);
    expect(getWeakestKey(snapshot.stats)).toBe('A');
    expect(getWeakestFinger(snapshot.stats)).toBe('left-pinky');
  });

  it('follows minion, minion, minion, boss wave cadence', () => {
    const session = new TypingRpgSession();
    session.start();

    while (session.getSnapshot().stats.defeated < 3) {
      const prompt = session.getSnapshot().prompt.romaji;
      for (const char of prompt) session.input(char);
    }

    const snapshot = session.getSnapshot();
    expect(snapshot.stats.defeated).toBe(3);
    expect(snapshot.enemy.kind).toBe('boss');
  });

  it('ends when the one minute timer reaches zero', () => {
    const session = new TypingRpgSession();
    session.start();
    const snapshot = session.tick(60_000);

    expect(snapshot.timeLeft).toBe(0);
    expect(snapshot.ended).toBe(true);
  });

  it('has a large prompt pool using school-style romaji spellings', () => {
    expect(minionPrompts.length).toBeGreaterThan(700);
    const joined = minionPrompts.map((prompt) => prompt.romaji).join(' ');
    expect(joined).not.toContain('TSU');
    expect(joined).not.toContain('SHI');
    expect(joined).not.toContain('CHI');
    expect(joined).not.toContain('FU');
  });

  it('accepts common alternate romaji input patterns', () => {
    expect(getSyllableVariants('ZI')).toContain('JI');
    expect(getSyllableVariants('SI')).toContain('SHI');
    expect(getSyllableVariants('SI')).toContain('CI');
    expect(getSyllableVariants('TI')).toContain('CHI');
    expect(getSyllableVariants('TU')).toContain('TSU');
    expect(getSyllableVariants('SYU')).toContain('SHU');
    expect(getSyllableVariants('ZYO')).toContain('JO');
    expect(isSyllableInputCandidate('ZI', 'J')).toBe(true);
    expect(isSyllableInputComplete('ZI', 'JI')).toBe(true);
    expect(isSyllableInputComplete('TU', 'TSU')).toBe(true);
  });
});
