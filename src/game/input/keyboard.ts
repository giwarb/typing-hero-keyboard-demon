export type HandSide = 'left' | 'right';
export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export type KeyInfo = {
  code: string;
  label: string;
  kana: string;
  finger: FingerId;
  home?: boolean;
  x: number;
  y: number;
  wide?: number;
};

export type KeyRow = KeyInfo[];

const fingerFor = (letter: string): FingerId => {
  if ('1QAZ'.includes(letter)) return 'left-pinky';
  if ('2WSX'.includes(letter)) return 'left-ring';
  if ('3EDC'.includes(letter)) return 'left-middle';
  if ('4RFV5TGB'.includes(letter)) return 'left-index';
  if ('6YHN7UJM'.includes(letter)) return 'right-index';
  if ('8IK,'.includes(letter)) return 'right-middle';
  if ('9OL.'.includes(letter)) return 'right-ring';
  if ('0P;:/-^@[\\]'.includes(letter)) return 'right-pinky';
  return 'thumb';
};

export const fingerNames: Record<FingerId, string> = {
  'left-pinky': '左手 小指',
  'left-ring': '左手 薬指',
  'left-middle': '左手 中指',
  'left-index': '左手 人差し指',
  'right-index': '右手 人差し指',
  'right-middle': '右手 中指',
  'right-ring': '右手 薬指',
  'right-pinky': '右手 小指',
  thumb: '親指',
};

export const fingerTone: Record<FingerId, string> = {
  'left-pinky': 'pink',
  'left-ring': 'orange',
  'left-middle': 'amber',
  'left-index': 'green',
  'right-index': 'blue',
  'right-middle': 'cyan',
  'right-ring': 'violet',
  'right-pinky': 'rose',
  thumb: 'neutral',
};

const key = (label: string, kana: string, x: number, y: number, wide = 1): KeyInfo => ({
  code: label.toUpperCase(),
  label,
  kana,
  finger: fingerFor(label.toUpperCase()),
  home: 'ASDFJKL;'.includes(label.toUpperCase()),
  x,
  y,
  wide,
});

export const jisKeyboard: KeyRow[] = [
  [key('1', 'ぬ', 0, 0), key('2', 'ふ', 1, 0), key('3', 'あ', 2, 0), key('4', 'う', 3, 0), key('5', 'え', 4, 0), key('6', 'お', 5, 0), key('7', 'や', 6, 0), key('8', 'ゆ', 7, 0), key('9', 'よ', 8, 0), key('0', 'わ', 9, 0), key('-', 'ほ', 10, 0), key('^', 'へ', 11, 0), key('¥', 'ー', 12, 0)],
  [key('Q', 'た', 0.58, 1), key('W', 'て', 1.58, 1), key('E', 'い', 2.58, 1), key('R', 'す', 3.58, 1), key('T', 'か', 4.58, 1), key('Y', 'ん', 5.58, 1), key('U', 'な', 6.58, 1), key('I', 'に', 7.58, 1), key('O', 'ら', 8.58, 1), key('P', 'せ', 9.58, 1), key('@', '゛', 10.58, 1), key('[', '゜', 11.58, 1)],
  [key('A', 'ち', 0.92, 2), key('S', 'と', 1.92, 2), key('D', 'し', 2.92, 2), key('F', 'は', 3.92, 2), key('G', 'き', 4.92, 2), key('H', 'く', 5.92, 2), key('J', 'ま', 6.92, 2), key('K', 'の', 7.92, 2), key('L', 'り', 8.92, 2), key(';', 'れ', 9.92, 2), key(':', 'け', 10.92, 2), key(']', 'む', 11.92, 2)],
  [key('Z', 'つ', 1.42, 3), key('X', 'さ', 2.42, 3), key('C', 'そ', 3.42, 3), key('V', 'ひ', 4.42, 3), key('B', 'こ', 5.42, 3), key('N', 'み', 6.42, 3), key('M', 'も', 7.42, 3), key(',', 'ね', 8.42, 3), key('.', 'る', 9.42, 3), key('/', 'め', 10.42, 3), key('\\', 'ろ', 11.42, 3)],
];

export const keyLookup = new Map<string, KeyInfo>(
  jisKeyboard.flat().map((entry) => [entry.label.toUpperCase(), entry]),
);

export const normalizeTypedKey = (keyValue: string): string => {
  if (keyValue.length === 1) return keyValue.toUpperCase();
  return keyValue;
};

export const getFingerForKey = (keyValue: string): FingerId => {
  const normalized = normalizeTypedKey(keyValue);
  return keyLookup.get(normalized)?.finger ?? fingerFor(normalized);
};
