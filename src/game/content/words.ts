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

type Entry = readonly [string, readonly string[], PromptCategory?];

const kanaMap: Record<string, string> = {
  A: '\u3042', I: '\u3044', U: '\u3046', E: '\u3048', O: '\u304a',
  KA: '\u304b', KI: '\u304d', KU: '\u304f', KE: '\u3051', KO: '\u3053',
  SA: '\u3055', SI: '\u3057', SU: '\u3059', SE: '\u305b', SO: '\u305d',
  TA: '\u305f', TI: '\u3061', TU: '\u3064', TE: '\u3066', TO: '\u3068',
  NA: '\u306a', NI: '\u306b', NU: '\u306c', NE: '\u306d', NO: '\u306e',
  HA: '\u306f', HI: '\u3072', HU: '\u3075', HE: '\u3078', HO: '\u307b',
  MA: '\u307e', MI: '\u307f', MU: '\u3080', ME: '\u3081', MO: '\u3082',
  YA: '\u3084', YU: '\u3086', YO: '\u3088',
  RA: '\u3089', RI: '\u308a', RU: '\u308b', RE: '\u308c', RO: '\u308d',
  WA: '\u308f', WO: '\u3092', N: '\u3093',
  GA: '\u304c', GI: '\u304e', GU: '\u3050', GE: '\u3052', GO: '\u3054',
  ZA: '\u3056', ZI: '\u3058', ZU: '\u305a', ZE: '\u305c', ZO: '\u305e',
  DA: '\u3060', DE: '\u3067', DO: '\u3069',
  BA: '\u3070', BI: '\u3073', BU: '\u3076', BE: '\u3079', BO: '\u307c',
  PA: '\u3071', PI: '\u3074', PU: '\u3077', PE: '\u307a', PO: '\u307d',
  KYA: '\u304d\u3083', KYU: '\u304d\u3085', KYO: '\u304d\u3087',
  SYA: '\u3057\u3083', SYU: '\u3057\u3085', SYO: '\u3057\u3087',
  TYA: '\u3061\u3083', TYU: '\u3061\u3085', TYO: '\u3061\u3087',
  RYA: '\u308a\u3083', RYU: '\u308a\u3085', RYO: '\u308a\u3087',
  ZYA: '\u3058\u3083', ZYU: '\u3058\u3085', ZYO: '\u3058\u3087',
  KKU: '\u3063\u304f', PPA: '\u3063\u3071', TTO: '\u3063\u3068',
};

const kanaFrom = (syllables: readonly string[]): string => syllables.map((syllable) => kanaMap[syllable] ?? '').join('');

const make = (_kana: string, syllables: readonly string[], category: PromptCategory = 'daily'): Prompt => ({
  kana: kanaFrom(syllables),
  syllables: [...syllables],
  category,
  romaji: syllables.join('').toUpperCase(),
});

// ???????????PC??????????????????????
// ?=SI??=TI??=TU??=HU???=SYA ??IME??SHI/CHI/TSU/FU?????????????????????
const baseEntries: Entry[] = [
  ['??', ['A', 'SA'], 'starter'], ['??', ['I', 'SU'], 'starter'], ['??', ['U', 'TA'], 'starter'], ['??', ['E', 'KI'], 'starter'], ['??', ['O', 'TO'], 'starter'],
  ['??', ['NE', 'KO'], 'starter'], ['??', ['I', 'NU'], 'starter'], ['???', ['SA', 'KA', 'NA'], 'starter'], ['??', ['TO', 'RI'], 'starter'], ['??', ['KU', 'MA'], 'starter'],
  ['??', ['TU', 'KI'], 'daily'], ['???', ['TU', 'KU', 'E'], 'school'], ['???', ['TU', 'MI', 'KI'], 'daily'], ['???', ['TU', 'BA', 'SA'], 'adventure'], ['???', ['TU', 'YO', 'I'], 'adventure'],
  ['??', ['SI', 'RO'], 'daily'], ['??', ['SI', 'MA'], 'daily'], ['??', ['SI', 'O'], 'daily'], ['???', ['SI', 'ZU', 'KU'], 'daily'], ['????', ['SI', 'PPA', 'I'], 'school'],
  ['??', ['TI', 'ZU'], 'adventure'], ['???', ['TI', 'KA', 'RA'], 'adventure'], ['????', ['TI', 'I', 'SA', 'I'], 'daily'], ['????', ['TI', 'KYU', 'U'], 'school'],
  ['??', ['HU', 'NE'], 'daily'], ['??', ['HU', 'KU'], 'daily'], ['???', ['HU', 'SI', 'GI'], 'adventure'], ['????', ['HU', 'DE', 'BA', 'KO'], 'school'],
  ['????', ['SYA', 'SI', 'N'], 'daily'], ['?????', ['SYU', 'KU', 'DA', 'I'], 'school'], ['????', ['SYO', 'U', 'RI'], 'adventure'], ['?????', ['ZYU', 'GI', 'YO', 'U'], 'school'],
  ['???', ['KYA', 'KU'], 'daily'], ['??????', ['KYU', 'U', 'SYO', 'KU'], 'school'], ['?????', ['KYO', 'U', 'SI', 'TU'], 'school'],
  ['???', ['RYA', 'KU'], 'school'], ['???', ['RYU', 'U'], 'adventure'], ['????', ['RYO', 'U', 'RI'], 'daily'],
  ['???', ['TO', 'KE', 'I'], 'daily'], ['???', ['KA', 'BA', 'N'], 'school'], ['????', ['E', 'N', 'PI', 'TU'], 'school'], ['???', ['NO', 'O', 'TO'], 'school'],
  ['????', ['KE', 'SI', 'GO', 'MU'], 'school'], ['???', ['KU', 'RA', 'SU'], 'school'], ['???', ['KO', 'KU', 'GO'], 'school'], ['????', ['SA', 'N', 'SU', 'U'], 'school'],
  ['??', ['RI', 'KA'], 'school'], ['???', ['ZU', 'KO', 'U'], 'school'], ['?????', ['RE', 'N', 'SYU', 'U'], 'school'], ['????', ['SE', 'I', 'KA', 'I'], 'school'],
  ['??', ['YU', 'BI'], 'school'], ['??', ['KI', 'I'], 'school'], ['??', ['KA', 'NA'], 'school'], ['????', ['RO', 'O', 'MA', 'ZI'], 'school'], ['???', ['HO', 'O', 'MU'], 'school'], ['?????', ['PO', 'ZI', 'SYO', 'N'], 'school'],
  ['???', ['RI', 'N', 'GO'], 'daily'], ['???', ['MI', 'KA', 'N'], 'daily'], ['???', ['BA', 'NA', 'NA'], 'daily'], ['????', ['O', 'NI', 'GI', 'RI'], 'daily'], ['???', ['KA', 'RE', 'E'], 'daily'],
  ['????', ['SU', 'I', 'TO', 'U'], 'school'], ['????', ['HI', 'KO', 'U', 'KI'], 'daily'], ['???', ['KU', 'RU', 'MA'], 'daily'], ['????', ['DE', 'N', 'SYA'], 'daily'], ['?????', ['ZI', 'TE', 'N', 'SYA'], 'daily'],
  ['????', ['KO', 'U', 'E', 'N'], 'daily'], ['????', ['TO', 'MO', 'DA', 'TI'], 'daily'], ['?????', ['A', 'RI', 'GA', 'TO', 'U'], 'daily'], ['????', ['O', 'HA', 'YO', 'U'], 'daily'], ['????', ['TA', 'DA', 'I', 'MA'], 'daily'],
  ['????', ['YU', 'U', 'SYA'], 'adventure'], ['???', ['MA', 'HO', 'U'], 'adventure'], ['??', ['KE', 'N'], 'adventure'], ['??', ['TA', 'TE'], 'adventure'], ['??', ['KA', 'GI'], 'adventure'],
  ['???', ['TA', 'KA', 'RA'], 'adventure'], ['???', ['TO', 'BI', 'RA'], 'adventure'], ['???', ['HI', 'KA', 'RI'], 'adventure'], ['??', ['HO', 'SI'], 'adventure'], ['????', ['BO', 'U', 'KE', 'N'], 'adventure'],
  ['????', ['DO', 'RA', 'GO', 'N'], 'adventure'], ['????', ['SU', 'RA', 'I', 'MU'], 'adventure'], ['????', ['RO', 'BO', 'TTO'], 'adventure'], ['????', ['MI', 'MI', 'KKU'], 'adventure'], ['???', ['KI', 'NO', 'KO'], 'adventure'],
  ['????', ['KO', 'U', 'GE', 'KI'], 'adventure'], ['????', ['KA', 'I', 'HU', 'KU'], 'adventure'], ['???', ['MA', 'O', 'U'], 'adventure'], ['?????', ['DA', 'N', 'ZYO', 'N'], 'adventure'], ['???', ['O', 'SI', 'RO'], 'adventure'],
];

const prefixes: Entry[] = [
  ['???', ['A', 'KA', 'I']], ['???', ['A', 'O', 'I']], ['????', ['KI', 'I', 'RO', 'I']], ['???', ['HI', 'KA', 'RU']], ['????', ['TI', 'I', 'SA', 'NA']],
  ['????', ['O', 'O', 'KI', 'NA']], ['????', ['GE', 'N', 'KI', 'NA']], ['????', ['SU', 'BA', 'YA', 'I']], ['????', ['HU', 'SI', 'GI', 'NA']], ['????', ['YU', 'KA', 'I', 'NA']],
];

const actions: Entry[] = [
  ['?????', ['WO', 'MI', 'TU', 'KE', 'TA']], ['?????', ['WO', 'MA', 'MO', 'TTA']], ['?????', ['HE', 'SU', 'SU', 'N', 'DA']], ['??????', ['DE', 'RE', 'N', 'SYU', 'U']], ['??????', ['WO', 'TE', 'NI', 'I', 'RE', 'TA']],
  ['?????', ['TO', 'TA', 'TA', 'KA', 'U']], ['??????', ['GA', 'A', 'RA', 'WA', 'RE', 'TA']], ['??????', ['WO', 'O', 'I', 'KA', 'KE', 'RU']], ['??????', ['NI', 'TYO', 'U', 'SE', 'N']], ['??????', ['WO', 'KU', 'RI', 'A', 'SI', 'TA']],
];

const combine = (left: Entry, right: Entry, category: PromptCategory): Prompt => (
  make(`${left[0]}${right[0]}`, [...left[1], ...right[1]], category)
);

const unique = (items: Prompt[]): Prompt[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.kana}:${item.romaji}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const basePrompts = baseEntries.map(([kana, syllables, category]) => make(kana, syllables, category ?? 'daily'));
const prefixPrompts = prefixes.flatMap((prefix) => baseEntries.slice(5).map((entry) => combine(prefix, entry, entry[2] ?? 'daily')));
const actionPrompts = baseEntries.slice(20).flatMap((entry) => actions.map((action) => combine(entry, action, entry[2] ?? 'daily')));

export const minionPrompts: Prompt[] = unique([...basePrompts, ...prefixPrompts, ...actionPrompts]);

export const bossPrompts: Prompt[] = [
  make('???????????', ['YU', 'U', 'SYA', 'HA', 'KE', 'N', 'WO', 'NU', 'I', 'TA'], 'boss'),
  make('???????????', ['MA', 'HO', 'U', 'DE', 'TE', 'KI', 'WO', 'KO', 'U', 'GE', 'KI'], 'boss'),
  make('?????????????', ['KYO', 'U', 'MO', 'GE', 'N', 'KI', 'NI', 'RE', 'N', 'SYU', 'U'], 'boss'),
  make('??????????', ['TA', 'DA', 'SI', 'I', 'YU', 'BI', 'DE', 'U', 'TO', 'U'], 'boss'),
  make('?????????????', ['HO', 'O', 'MU', 'PO', 'ZI', 'SYO', 'N', 'NI', 'MO', 'DO', 'RO', 'U'], 'boss'),
  make('???????????', ['TU', 'GI', 'NO', 'KI', 'I', 'WO', 'YO', 'KU', 'MI', 'YO', 'U'], 'boss'),
  make('???????????', ['MI', 'SU', 'SI', 'TE', 'MO', 'A', 'KI', 'RA', 'ME', 'NA', 'I'], 'boss'),
  make('???????????', ['SU', 'BA', 'YA', 'KU', 'TE', 'I', 'NE', 'I', 'NI', 'U', 'TU'], 'boss'),
  make('???????????', ['YU', 'BI', 'WO', 'I', 'E', 'NI', 'MO', 'DO', 'SI', 'TE', 'NE'], 'boss'),
  make('???????????', ['KO', 'TO', 'BA', 'NO', 'TI', 'KA', 'RA', 'DE', 'KA', 'TO', 'U'], 'boss'),
  make('???????????', ['SU', 'RA', 'I', 'MU', 'NO', 'MU', 'RE', 'WO', 'KO', 'E', 'RO'], 'boss'),
  make('?????????????', ['KI', 'I', 'BO', 'O', 'DO', 'NO', 'MA', 'O', 'U', 'NI', 'I', 'DO', 'ME'], 'boss'),
  make('??????????????', ['KYU', 'U', 'KYO', 'KU', 'DO', 'RA', 'GO', 'N', 'WO', 'TA', 'O', 'SE'], 'boss'),
];

export const pickPrompt = (stageIndex: number, boss: boolean): Prompt => {
  const list = boss ? bossPrompts : minionPrompts;
  const offset = boss ? Math.floor(stageIndex / 4) * 3 : Math.floor(stageIndex / 4) * 17;
  return list[(stageIndex + offset) % list.length];
};
