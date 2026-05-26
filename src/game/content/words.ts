export type PromptCategory =
  | 'starter'
  | 'daily'
  | 'adventure'
  | 'school'
  | 'boss';

export type Prompt = {
  kana: string;
  romaji: string;
  syllables: string[];
  category: PromptCategory;
};

const kanaMap: Record<string, string> = {
  A: 'あ', I: 'い', U: 'う', E: 'え', O: 'お',
  KA: 'か', KI: 'き', KU: 'く', KE: 'け', KO: 'こ',
  SA: 'さ', SHI: 'し', SU: 'す', SE: 'せ', SO: 'そ',
  TA: 'た', CHI: 'ち', TSU: 'つ', TE: 'て', TO: 'と',
  NA: 'な', NI: 'に', NU: 'ぬ', NE: 'ね', NO: 'の',
  HA: 'は', HI: 'ひ', FU: 'ふ', HE: 'へ', HO: 'ほ',
  MA: 'ま', MI: 'み', MU: 'む', ME: 'め', MO: 'も',
  YA: 'や', YU: 'ゆ', YO: 'よ',
  RA: 'ら', RI: 'り', RU: 'る', RE: 'れ', RO: 'ろ',
  WA: 'わ', WO: 'を', N: 'ん',
  GA: 'が', GI: 'ぎ', GU: 'ぐ', GE: 'げ', GO: 'ご',
  ZA: 'ざ', JI: 'じ', ZU: 'ず', ZE: 'ぜ', ZO: 'ぞ',
  DA: 'だ', DE: 'で', DO: 'ど',
  BA: 'ば', BI: 'び', BU: 'ぶ', BE: 'べ', BO: 'ぼ',
  PA: 'ぱ', PI: 'ぴ', PU: 'ぷ', PE: 'ぺ', PO: 'ぽ',
  KYA: 'きゃ', KYU: 'きゅ', KYO: 'きょ',
  SHA: 'しゃ', SHU: 'しゅ', SHO: 'しょ',
  CHA: 'ちゃ', CHU: 'ちゅ', CHO: 'ちょ',
  NYA: 'にゃ', NYU: 'にゅ', NYO: 'にょ',
  HYA: 'ひゃ', HYU: 'ひゅ', HYO: 'ひょ',
  MYA: 'みゃ', MYU: 'みゅ', MYO: 'みょ',
  RYA: 'りゃ', RYU: 'りゅ', RYO: 'りょ',
  GYA: 'ぎゃ', GYU: 'ぎゅ', GYO: 'ぎょ',
  JA: 'じゃ', JU: 'じゅ', JO: 'じょ',
  BYA: 'びゃ', BYU: 'びゅ', BYO: 'びょ',
  PYA: 'ぴゃ', PYU: 'ぴゅ', PYO: 'ぴょ',
  KKU: 'っく',
  PPA: 'っぱい',
  TTO: 'っと',
};

const make = (kana: string, syllables: string[], category: PromptCategory): Prompt => ({
  kana,
  syllables,
  category,
  romaji: syllables.join(''),
});

const fromRomaji = (syllables: string[], category: PromptCategory): Prompt => (
  make(syllables.map((s) => kanaMap[s] ?? s.toLowerCase()).join(''), syllables, category)
);

export const minionPrompts: Prompt[] = [
  fromRomaji(['A', 'SA'], 'starter'),
  fromRomaji(['I', 'SU'], 'starter'),
  fromRomaji(['U', 'TA'], 'starter'),
  fromRomaji(['E', 'KI'], 'starter'),
  fromRomaji(['O', 'TO'], 'starter'),
  fromRomaji(['NE', 'KO'], 'starter'),
  fromRomaji(['I', 'NU'], 'starter'),
  fromRomaji(['SA', 'KA', 'NA'], 'starter'),
  fromRomaji(['TO', 'KE', 'I'], 'daily'),
  fromRomaji(['KA', 'BA', 'N'], 'daily'),
  fromRomaji(['E', 'N', 'PI', 'TSU'], 'school'),
  fromRomaji(['NO', 'TO'], 'school'),
  fromRomaji(['KE', 'SHI', 'GO', 'MU'], 'school'),
  fromRomaji(['KU', 'RA', 'SU'], 'school'),
  fromRomaji(['RI', 'N', 'GO'], 'daily'),
  fromRomaji(['MI', 'KA', 'N'], 'daily'),
  fromRomaji(['BA', 'NA', 'NA'], 'daily'),
  fromRomaji(['O', 'NI', 'GI', 'RI'], 'daily'),
  fromRomaji(['KA', 'RE', 'E'], 'daily'),
  fromRomaji(['SU', 'I', 'TO', 'U'], 'school'),
  fromRomaji(['KO', 'KU', 'GO'], 'school'),
  fromRomaji(['SA', 'N', 'SU', 'U'], 'school'),
  fromRomaji(['RI', 'KA'], 'school'),
  fromRomaji(['ZU', 'KO', 'U'], 'school'),
  fromRomaji(['YU', 'U', 'SHA'], 'adventure'),
  fromRomaji(['MA', 'HO', 'U'], 'adventure'),
  fromRomaji(['KE', 'N'], 'adventure'),
  fromRomaji(['TA', 'TE'], 'adventure'),
  fromRomaji(['CHI', 'ZU'], 'adventure'),
  fromRomaji(['KA', 'GI'], 'adventure'),
  fromRomaji(['TA', 'KA', 'RA'], 'adventure'),
  fromRomaji(['TO', 'BI', 'RA'], 'adventure'),
  fromRomaji(['HI', 'KA', 'RI'], 'adventure'),
  fromRomaji(['HO', 'SHI'], 'adventure'),
  fromRomaji(['KU', 'MO'], 'daily'),
  fromRomaji(['SO', 'RA'], 'daily'),
  fromRomaji(['YA', 'MA'], 'daily'),
  fromRomaji(['KA', 'WA'], 'daily'),
  fromRomaji(['MO', 'RI'], 'daily'),
  fromRomaji(['HA', 'NA'], 'daily'),
  fromRomaji(['A', 'SA', 'HI'], 'daily'),
  fromRomaji(['YU', 'U', 'HI'], 'daily'),
  fromRomaji(['HI', 'KO', 'U', 'KI'], 'daily'),
  fromRomaji(['KU', 'RU', 'MA'], 'daily'),
  fromRomaji(['DE', 'N', 'SHA'], 'daily'),
  fromRomaji(['JI', 'TE', 'N', 'SHA'], 'daily'),
  fromRomaji(['KO', 'U', 'E', 'N'], 'daily'),
  fromRomaji(['TO', 'MO', 'DA', 'CHI'], 'daily'),
  fromRomaji(['A', 'RI', 'GA', 'TO', 'U'], 'daily'),
  fromRomaji(['O', 'HA', 'YO', 'U'], 'daily'),
  fromRomaji(['TA', 'DA', 'I', 'MA'], 'daily'),
  fromRomaji(['RE', 'N', 'SHU', 'U'], 'school'),
  fromRomaji(['SE', 'I', 'KA', 'I'], 'school'),
  make('しっぱい', ['SHI', 'PPA', 'I'], 'school'),
  fromRomaji(['YU', 'BI'], 'school'),
  fromRomaji(['KI', 'I'], 'school'),
  fromRomaji(['KA', 'NA'], 'school'),
  fromRomaji(['RO', 'O', 'MA', 'JI'], 'school'),
  fromRomaji(['HO', 'O', 'MU'], 'school'),
  fromRomaji(['PO', 'JI', 'SHO', 'N'], 'school'),
  fromRomaji(['A', 'TA', 'KKU'], 'adventure'),
  fromRomaji(['BO', 'U', 'KEN'], 'adventure'),
  fromRomaji(['DO', 'RA', 'GO', 'N'], 'adventure'),
  fromRomaji(['SU', 'RA', 'I', 'MU'], 'adventure'),
  fromRomaji(['RO', 'BO', 'TTO'], 'adventure'),
  fromRomaji(['MI', 'MI', 'KKU'], 'adventure'),
  fromRomaji(['KI', 'NO', 'KO'], 'adventure'),
  fromRomaji(['KO', 'U', 'GE', 'KI'], 'adventure'),
  fromRomaji(['KA', 'I', 'FU', 'KU'], 'adventure'),
  fromRomaji(['SHO', 'U', 'RI'], 'adventure'),
];

export const bossPrompts: Prompt[] = [
  make('ゆうしゃはけんをぬいた', ['YU', 'U', 'SHA', 'HA', 'KE', 'N', 'WO', 'NU', 'I', 'TA'], 'boss'),
  make('まほうでてきをこうげき', ['MA', 'HO', 'U', 'DE', 'TE', 'KI', 'WO', 'KO', 'U', 'GE', 'KI'], 'boss'),
  make('きょうもげんきにれんしゅう', ['KYO', 'U', 'MO', 'GE', 'N', 'KI', 'NI', 'RE', 'N', 'SHU', 'U'], 'boss'),
  make('ただしいゆびでうとう', ['TA', 'DA', 'SHI', 'I', 'YU', 'BI', 'DE', 'U', 'TO', 'U'], 'boss'),
  make('ホームポジションにもどろう', ['HO', 'O', 'MU', 'PO', 'JI', 'SHO', 'N', 'NI', 'MO', 'DO', 'RO', 'U'], 'boss'),
  make('つぎのキーをよくみよう', ['TSU', 'GI', 'NO', 'KI', 'I', 'WO', 'YO', 'KU', 'MI', 'YO', 'U'], 'boss'),
  make('ミスしてもあきらめない', ['MI', 'SU', 'SHI', 'TE', 'MO', 'A', 'KI', 'RA', 'ME', 'NA', 'I'], 'boss'),
  make('すばやくていねいにうつ', ['SU', 'BA', 'YA', 'KU', 'TE', 'I', 'NE', 'I', 'NI', 'U', 'TSU'], 'boss'),
  make('ゆびをいえにもどしてね', ['YU', 'BI', 'WO', 'I', 'E', 'NI', 'MO', 'DO', 'SHI', 'TE', 'NE'], 'boss'),
  make('ことばのちからでかとう', ['KO', 'TO', 'BA', 'NO', 'CHI', 'KA', 'RA', 'DE', 'KA', 'TO', 'U'], 'boss'),
];

export const pickPrompt = (stageIndex: number, boss: boolean): Prompt => {
  const list = boss ? bossPrompts : minionPrompts;
  const offset = boss ? Math.floor(stageIndex / 4) * 3 : Math.floor(stageIndex / 4) * 7;
  return list[(stageIndex + offset) % list.length];
};
