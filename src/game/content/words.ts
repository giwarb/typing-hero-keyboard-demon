export type Prompt = {
  kana: string;
  romaji: string;
  syllables: string[];
};

export const minionPrompts: Prompt[] = [
  { kana: 'ねこ', romaji: 'NEKO', syllables: ['NE', 'KO'] },
  { kana: 'いぬ', romaji: 'INU', syllables: ['I', 'NU'] },
  { kana: 'くるま', romaji: 'KURUMA', syllables: ['KU', 'RU', 'MA'] },
  { kana: 'りんご', romaji: 'RINGO', syllables: ['RI', 'N', 'GO'] },
  { kana: 'ひこうき', romaji: 'HIKOUKI', syllables: ['HI', 'KO', 'U', 'KI'] },
  { kana: 'たからばこ', romaji: 'TAKARABAKO', syllables: ['TA', 'KA', 'RA', 'BA', 'KO'] },
  { kana: 'まほう', romaji: 'MAHOU', syllables: ['MA', 'HO', 'U'] },
  { kana: 'ゆうしゃ', romaji: 'YUUSHA', syllables: ['YU', 'U', 'SHA'] },
];

export const bossPrompts: Prompt[] = [
  { kana: 'ゆうしゃはけんをぬいた', romaji: 'YUUSHAHAKENWONUITA', syllables: ['YU', 'U', 'SHA', 'HA', 'KE', 'N', 'WO', 'NU', 'I', 'TA'] },
  { kana: 'まほうでてきをこうげき', romaji: 'MAHOUDETEKIWOKOUGEKI', syllables: ['MA', 'HO', 'U', 'DE', 'TE', 'KI', 'WO', 'KO', 'U', 'GE', 'KI'] },
  { kana: 'きょうもげんきにれんしゅう', romaji: 'KYOUMOGENKINIRENSHUU', syllables: ['KYO', 'U', 'MO', 'GE', 'N', 'KI', 'NI', 'RE', 'N', 'SHU', 'U'] },
  { kana: 'ただしいゆびでうとう', romaji: 'TADASHIIYUBIDEUTOU', syllables: ['TA', 'DA', 'SHI', 'I', 'YU', 'BI', 'DE', 'U', 'TO', 'U'] },
];

export const pickPrompt = (stageIndex: number, boss: boolean): Prompt => {
  const list = boss ? bossPrompts : minionPrompts;
  return list[stageIndex % list.length];
};
