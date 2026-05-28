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

type Spec = readonly [kana: string, syllables: string, category?: PromptCategory];
type Part = readonly [kana: string, syllables: string];

const kanaMap: Record<string, string> = {
  A: 'あ', I: 'い', U: 'う', E: 'え', O: 'お',
  KA: 'か', KI: 'き', KU: 'く', KE: 'け', KO: 'こ',
  SA: 'さ', SI: 'し', SU: 'す', SE: 'せ', SO: 'そ',
  TA: 'た', TI: 'ち', TU: 'つ', TE: 'て', TO: 'と',
  NA: 'な', NI: 'に', NU: 'ぬ', NE: 'ね', NO: 'の',
  HA: 'は', HI: 'ひ', HU: 'ふ', HE: 'へ', HO: 'ほ',
  MA: 'ま', MI: 'み', MU: 'む', ME: 'め', MO: 'も',
  YA: 'や', YU: 'ゆ', YO: 'よ',
  RA: 'ら', RI: 'り', RU: 'る', RE: 'れ', RO: 'ろ',
  WA: 'わ', WO: 'を', N: 'ん',
  GA: 'が', GI: 'ぎ', GU: 'ぐ', GE: 'げ', GO: 'ご',
  ZA: 'ざ', ZI: 'じ', ZU: 'ず', ZE: 'ぜ', ZO: 'ぞ',
  DA: 'だ', DI: 'ぢ', DU: 'づ', DE: 'で', DO: 'ど',
  BA: 'ば', BI: 'び', BU: 'ぶ', BE: 'べ', BO: 'ぼ',
  PA: 'ぱ', PI: 'ぴ', PU: 'ぷ', PE: 'ぺ', PO: 'ぽ',
  KYA: 'きゃ', KYU: 'きゅ', KYO: 'きょ',
  SYA: 'しゃ', SYU: 'しゅ', SYO: 'しょ',
  TYA: 'ちゃ', TYU: 'ちゅ', TYO: 'ちょ',
  NYA: 'にゃ', NYU: 'にゅ', NYO: 'にょ',
  HYA: 'ひゃ', HYU: 'ひゅ', HYO: 'ひょ',
  MYA: 'みゃ', MYU: 'みゅ', MYO: 'みょ',
  RYA: 'りゃ', RYU: 'りゅ', RYO: 'りょ',
  GYA: 'ぎゃ', GYU: 'ぎゅ', GYO: 'ぎょ',
  ZYA: 'じゃ', ZYU: 'じゅ', ZYO: 'じょ',
  BYA: 'びゃ', BYU: 'びゅ', BYO: 'びょ',
  PYA: 'ぴゃ', PYU: 'ぴゅ', PYO: 'ぴょ',
  KKU: 'っく', TTA: 'った', TTI: 'っち', TTU: 'っつ', TTE: 'って', TTO: 'っと',
  SSA: 'っさ', SSI: 'っし', SSU: 'っす', SSE: 'っせ', SSO: 'っそ',
  PPA: 'っぱ', PPI: 'っぴ', PPU: 'っぷ', PPE: 'っぺ', PPO: 'っぽ',
};

const variants: Record<string, string[]> = {
  SI: ['SI', 'SHI', 'CI'],
  TI: ['TI', 'CHI'],
  TU: ['TU', 'TSU'],
  HU: ['HU', 'FU'],
  ZI: ['ZI', 'JI'],
  SYA: ['SYA', 'SHA'],
  SYU: ['SYU', 'SHU'],
  SYO: ['SYO', 'SHO'],
  TYA: ['TYA', 'CHA', 'CYA'],
  TYU: ['TYU', 'CHU', 'CYU'],
  TYO: ['TYO', 'CHO', 'CYO'],
  ZYA: ['ZYA', 'JA', 'JYA'],
  ZYU: ['ZYU', 'JU', 'JYU'],
  ZYO: ['ZYO', 'JO', 'JYO'],
  DI: ['DI'],
  DU: ['DU'],
  N: ['N', 'NN'],
  SSI: ['SSI', 'SSHI'],
  TTI: ['TTI', 'CCHI'],
  TTU: ['TTU', 'TTSU'],
};

export const getSyllableVariants = (syllable: string): string[] => (
  variants[syllable] ?? [syllable]
);

export const isSyllableInputCandidate = (syllable: string, input: string): boolean => (
  getSyllableVariants(syllable).some((candidate) => candidate.startsWith(input.toUpperCase()))
);

export const isSyllableInputComplete = (syllable: string, input: string): boolean => (
  getSyllableVariants(syllable).includes(input.toUpperCase())
);

export const kanaFromSyllables = (syllables: readonly string[]): string => (
  syllables.map((syllable) => kanaMap[syllable] ?? '').join('')
);

const split = (syllables: string): string[] => syllables.trim().split(/\s+/);

const prompt = ([kana, syllables, category = 'daily']: Spec): Prompt => {
  const parts = split(syllables);
  return {
    kana,
    syllables: parts,
    category,
    romaji: parts.join('').toUpperCase(),
  };
};

const joinParts = (parts: readonly Part[], category: PromptCategory): Prompt => prompt([
  parts.map((part) => part[0]).join(''),
  parts.map((part) => part[1]).join(' '),
  category,
]);

const p = (kana: string, syllables: string): Part => [kana, syllables];

const starters: Spec[] = [
  ['あさ', 'A SA', 'starter'], ['いす', 'I SU', 'starter'], ['うた', 'U TA', 'starter'], ['えき', 'E KI', 'starter'], ['おと', 'O TO', 'starter'],
  ['ねこ', 'NE KO', 'starter'], ['いぬ', 'I NU', 'starter'], ['さかな', 'SA KA NA', 'starter'], ['とり', 'TO RI', 'starter'], ['くま', 'KU MA', 'starter'],
  ['つき', 'TU KI', 'starter'], ['しろ', 'SI RO', 'starter'], ['ちず', 'TI ZU', 'starter'], ['ふね', 'HU NE', 'starter'], ['ゆび', 'YU BI', 'starter'],
  ['かぎ', 'KA GI', 'starter'], ['けん', 'KE N', 'starter'], ['たて', 'TA TE', 'starter'], ['ほし', 'HO SI', 'starter'], ['まほう', 'MA HO U', 'starter'],
];

const dailyThings: Part[] = [
  p('りんご', 'RI N GO'), p('みかん', 'MI KA N'), p('ばなな', 'BA NA NA'), p('おにぎり', 'O NI GI RI'), p('カレー', 'KA RE E'),
  p('パン', 'PA N'), p('たまご', 'TA MA GO'), p('おちゃ', 'O TYA'), p('すいとう', 'SU I TO U'), p('おべんとう', 'O BE N TO U'),
  p('くつ', 'KU TU'), p('ぼうし', 'BO U SI'), p('かさ', 'KA SA'), p('とけい', 'TO KE I'), p('かばん', 'KA BA N'),
  p('しゃしん', 'SYA SI N'), p('てがみ', 'TE GA MI'), p('えほん', 'E HO N'), p('つみき', 'TU MI KI'), p('ボール', 'BO O RU'),
];

const schoolThings: Part[] = [
  p('えんぴつ', 'E N PI TU'), p('ノート', 'NO O TO'), p('けしゴム', 'KE SI GO MU'), p('じょうぎ', 'ZYO U GI'), p('ふでばこ', 'HU DE BA KO'),
  p('きょうかしょ', 'KYO U KA SYO'), p('しゅくだい', 'SYU KU DA I'), p('こくご', 'KO KU GO'), p('さんすう', 'SA N SU U'), p('りか', 'RI KA'),
  p('ずこう', 'ZU KO U'), p('きょうしつ', 'KYO U SI TU'), p('こくばん', 'KO KU BA N'), p('チョーク', 'TYO O KU'), p('ランドセル', 'RA N DO SE RU'),
  p('プリント', 'PU RI N TO'), p('ろうか', 'RO U KA'), p('としょしつ', 'TO SYO SI TU'), p('きゅうしょく', 'KYU U SYO KU'), p('うわばき', 'U WA BA KI'),
];

const adventureThings: Part[] = [
  p('ゆうしゃ', 'YU U SYA'), p('まほう', 'MA HO U'), p('けん', 'KE N'), p('たて', 'TA TE'), p('かぎ', 'KA GI'),
  p('たから', 'TA KA RA'), p('とびら', 'TO BI RA'), p('ひかり', 'HI KA RI'), p('ほし', 'HO SI'), p('ぼうけん', 'BO U KE N'),
  p('ドラゴン', 'DO RA GO N'), p('スライム', 'SU RA I MU'), p('ロボット', 'RO BO TTO'), p('ミミック', 'MI MI KKU'), p('きのこ', 'KI NO KO'),
  p('こうげき', 'KO U GE KI'), p('かいふく', 'KA I HU KU'), p('まおう', 'MA O U'), p('ダンジョン', 'DA N ZYO N'), p('おしろ', 'O SI RO'),
  p('ちから', 'TI KA RA'), p('しょうり', 'SYO U RI'), p('じゅもん', 'ZYU MO N'), p('りゅう', 'RYU U'), p('ふしぎ', 'HU SI GI'),
];

const people: Part[] = [
  p('ともだち', 'TO MO DA TI'), p('せんせい', 'SE N SE I'), p('みんな', 'MI N NA'), p('かぞく', 'KA ZO KU'), p('おとうと', 'O TO U TO'),
  p('いもうと', 'I MO U TO'), p('おかあさん', 'O KA A SA N'), p('おとうさん', 'O TO U SA N'), p('ゆうしゃ', 'YU U SYA'), p('けんし', 'KE N SI'),
];

const places: Part[] = [
  p('こうえん', 'KO U E N'), p('がっこう', 'GA KKO U'), p('いえ', 'I E'), p('みち', 'MI TI'), p('もり', 'MO RI'),
  p('かわ', 'KA WA'), p('やま', 'YA MA'), p('ひろば', 'HI RO BA'), p('おしろ', 'O SI RO'), p('ダンジョン', 'DA N ZYO N'),
  p('きょうしつ', 'KYO U SI TU'), p('としょしつ', 'TO SYO SI TU'), p('うんどうば', 'U N DO U BA'), p('はし', 'HA SI'), p('まち', 'MA TI'),
];

const foodActions: Part[] = [
  p('をたべる', 'WO TA BE RU'), p('をわける', 'WO WA KE RU'), p('をつくる', 'WO TU KU RU'), p('をえらぶ', 'WO E RA BU'), p('をならべる', 'WO NA RA BE RU'),
  p('をもっていく', 'WO MO TTE I KU'), p('をおいしくたべる', 'WO O I SI KU TA BE RU'), p('をおさらへおく', 'WO O SA RA HE O KU'),
];

const schoolActions: Part[] = [
  p('をひらく', 'WO HI RA KU'), p('をしまう', 'WO SI MA U'), p('をつかう', 'WO TU KA U'), p('をよむ', 'WO YO MU'), p('をかく', 'WO KA KU'),
  p('をそろえる', 'WO SO RO E RU'), p('をつくえにおく', 'WO TU KU E NI O KU'), p('をていねいにつかう', 'WO TE I NE I NI TU KA U'),
];

const adventureActions: Part[] = [
  p('をみつける', 'WO MI TU KE RU'), p('をまもる', 'WO MA MO RU'), p('をさがす', 'WO SA GA SU'), p('へすすむ', 'HE SU SU MU'), p('にちょうせん', 'NI TYO U SE N'),
  p('をおいかける', 'WO O I KA KE RU'), p('とたたかう', 'TO TA TA KA U'), p('をてにいれる', 'WO TE NI I RE RU'), p('をクリアする', 'WO KU RI A SU RU'),
];

const peopleActions: Part[] = [
  p('とあそぶ', 'TO A SO BU'), p('とわらう', 'TO WA RA U'), p('にあいさつ', 'NI A I SA TU'), p('をおうえん', 'WO O U E N'), p('とはなす', 'TO HA NA SU'),
  p('とれんしゅう', 'TO RE N SYU U'), p('にありがとう', 'NI A RI GA TO U'), p('といっしょにいく', 'TO I SSI YO NI I KU'),
];

const placeActions: Part[] = [
  p('へいく', 'HE I KU'), p('をあるく', 'WO A RU KU'), p('ではしる', 'DE HA SI RU'), p('であそぶ', 'DE A SO BU'), p('でれんしゅう', 'DE RE N SYU U'),
  p('でひとやすみ', 'DE HI TO YA SU MI'), p('へむかう', 'HE MU KA U'), p('をたんけん', 'WO TA N KE N'),
];

const practiceSentences: Spec[] = [
  ['ホームポジションにもどる', 'HO O MU PO ZI SYO N NI MO DO RU', 'school'],
  ['つぎのキーをよくみる', 'TU GI NO KI I WO YO KU MI RU', 'school'],
  ['ただしいゆびでうとう', 'TA DA SI I YU BI DE U TO U', 'school'],
  ['みすしてもあきらめない', 'MI SU SI TE MO A KI RA ME NA I', 'school'],
  ['ゆっくりただしくうつ', 'YU KKU RI TA DA SI KU U TU', 'school'],
  ['すばやくていねいにうつ', 'SU BA YA KU TE I NE I NI U TU', 'school'],
  ['ひだりてをよくみる', 'HI DA RI TE WO YO KU MI RU', 'school'],
  ['みぎてをよくみる', 'MI GI TE WO YO KU MI RU', 'school'],
  ['こゆびもじょうずにつかう', 'KO YU BI MO ZYO U ZU NI TU KA U', 'school'],
  ['まいにちすこしれんしゅう', 'MA I NI TI SU KO SI RE N SYU U', 'school'],
  ['せなかをのばしてすわる', 'SE NA KA WO NO BA SI TE SU WA RU', 'school'],
  ['がめんをよくみてうつ', 'GA ME N WO YO KU MI TE U TU', 'school'],
];

const explicitShort: Spec[] = [
  ['おはよう', 'O HA YO U', 'daily'], ['ただいま', 'TA DA I MA', 'daily'], ['ありがとう', 'A RI GA TO U', 'daily'], ['いただきます', 'I TA DA KI MA SU', 'daily'], ['ごちそうさま', 'GO TI SO U SA MA', 'daily'],
  ['しゅくだいをだす', 'SYU KU DA I WO DA SU', 'school'], ['ノートにかく', 'NO O TO NI KA KU', 'school'], ['えんぴつをけずる', 'E N PI TU WO KE ZU RU', 'school'], ['こくごをよむ', 'KO KU GO WO YO MU', 'school'], ['さんすうをとく', 'SA N SU U WO TO KU', 'school'],
  ['けんをかまえる', 'KE N WO KA MA E RU', 'adventure'], ['まほうをとなえる', 'MA HO U WO TO NA E RU', 'adventure'], ['たからばこをあける', 'TA KA RA BA KO WO A KE RU', 'adventure'], ['とびらをひらく', 'TO BI RA WO HI RA KU', 'adventure'], ['ドラゴンをみあげる', 'DO RA GO N WO MI A GE RU', 'adventure'],
];

const combineEvery = (subjects: readonly Part[], actions: readonly Part[], category: PromptCategory): Prompt[] => (
  subjects.flatMap((subject) => actions.map((action) => joinParts([subject, action], category)))
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

const allMinionPrompts = unique([
  ...starters.map(prompt),
  ...dailyThings.map((part) => joinParts([part], 'daily')),
  ...schoolThings.map((part) => joinParts([part], 'school')),
  ...adventureThings.map((part) => joinParts([part], 'adventure')),
  ...explicitShort.map(prompt),
  ...practiceSentences.map(prompt),
  ...combineEvery(dailyThings.slice(0, 10), foodActions, 'daily'),
  ...combineEvery(schoolThings, schoolActions, 'school'),
  ...combineEvery(adventureThings, adventureActions, 'adventure'),
  ...combineEvery(people, peopleActions, 'daily'),
  ...combineEvery(places, placeActions, 'daily'),
  ...combineEvery([...schoolThings.slice(0, 10), ...dailyThings.slice(10, 20)], [p('をたいせつにする', 'WO TA I SE TU NI SU RU'), p('をきれいにしまう', 'WO KI RE I NI SI MA U'), p('をすぐにみつける', 'WO SU GU NI MI TU KE RU')], 'school'),
  ...combineEvery([...adventureThings.slice(0, 15), ...places.slice(4, 10)], [p('がひかる', 'GA HI KA RU'), p('があらわれる', 'GA A RA WA RE RU'), p('をのりこえる', 'WO NO RI KO E RU'), p('までかけぬける', 'MA DE KA KE NU KE RU')], 'adventure'),
]);

export const minionPrompts: Prompt[] = allMinionPrompts.length > 700
  ? allMinionPrompts
  : unique([
    ...allMinionPrompts,
    ...combineEvery(people, placeActions, 'daily'),
    ...combineEvery(places, adventureActions.slice(0, 6), 'adventure'),
    ...combineEvery(schoolThings, peopleActions.slice(0, 5), 'school'),
  ]);

export const bossPrompts: Prompt[] = [
  prompt(['ゆうしゃはけんをぬいた', 'YU U SYA HA KE N WO NU I TA', 'boss']),
  prompt(['まほうでてきをこうげき', 'MA HO U DE TE KI WO KO U GE KI', 'boss']),
  prompt(['きょうもげんきにれんしゅう', 'KYO U MO GE N KI NI RE N SYU U', 'boss']),
  prompt(['ただしいゆびでうとう', 'TA DA SI I YU BI DE U TO U', 'boss']),
  prompt(['ホームポジションにもどろう', 'HO O MU PO ZI SYO N NI MO DO RO U', 'boss']),
  prompt(['つぎのキーをよくみよう', 'TU GI NO KI I WO YO KU MI YO U', 'boss']),
  prompt(['みすしてもあきらめない', 'MI SU SI TE MO A KI RA ME NA I', 'boss']),
  prompt(['すばやくていねいにうつ', 'SU BA YA KU TE I NE I NI U TU', 'boss']),
  prompt(['ゆびをいえにもどしてね', 'YU BI WO I E NI MO DO SI TE NE', 'boss']),
  prompt(['ことばのちからでかとう', 'KO TO BA NO TI KA RA DE KA TO U', 'boss']),
  prompt(['スライムのむれをこえろ', 'SU RA I MU NO MU RE WO KO E RO', 'boss']),
  prompt(['キーボードのまおうにいどめ', 'KI I BO O DO NO MA O U NI I DO ME', 'boss']),
  prompt(['きゅうきょくドラゴンをたおせ', 'KYU U KYO KU DO RA GO N WO TA O SE', 'boss']),
  prompt(['さいごまでしゅうちゅうする', 'SA I GO MA DE SYU U TYU U SU RU', 'boss']),
  prompt(['こころをおちつけてすすめ', 'KO KO RO WO O TI TU KE TE SU SU ME', 'boss']),
  prompt(['つよいてきにもむかっていく', 'TU YO I TE KI NI MO MU KA TTE I KU', 'boss']),
];

export const pickPrompt = (stageIndex: number, boss: boolean): Prompt => {
  const list = boss ? bossPrompts : minionPrompts;
  const offset = boss ? Math.floor(stageIndex / 4) * 3 : Math.floor(stageIndex / 4) * 17;
  return list[(stageIndex + offset) % list.length];
};
