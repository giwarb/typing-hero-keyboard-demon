import { fingerNames, fingerTone, getFingerForKey, jisKeyboard, type FingerId } from '../game/input/keyboard';
import { getAccuracy, getWeakestFinger, getWeakestKey, type GameSnapshot, type GameStats } from '../game/simulation/state';

export type UiHandles = {
  root: HTMLElement;
  timer: HTMLElement;
  wave: HTMLElement;
  enemyName: HTMLElement;
  enemyHpFill: HTMLElement;
  enemyHpText: HTMLElement;
  promptKana: HTMLElement;
  promptRomaji: HTMLElement;
  keyboard: HTMLElement;
  hands: HTMLElement;
  accuracy: HTMLElement;
  combo: HTMLElement;
  nextGuide: HTMLElement;
  startOverlay: HTMLElement;
  resultOverlay: HTMLElement;
  resultBody: HTMLElement;
};

const fingerOrder: FingerId[] = [
  'left-pinky',
  'left-ring',
  'left-middle',
  'left-index',
  'right-index',
  'right-middle',
  'right-ring',
  'right-pinky',
];

export const buildUi = (mount: HTMLElement): UiHandles => {
  mount.insertAdjacentHTML('beforeend', `
    <div class="ui-layer">
      <header class="top-hud">
        <div class="brand">
          <div class="brand-title">タイピングゆうしゃ</div>
          <div class="brand-sub">ことばでたたかうRPG</div>
        </div>
        <div class="hud-panel timer"><span class="clock">◷</span><b data-role="timer">01:00</b></div>
        <div class="hud-panel wave"><span class="mini-slime"></span>ざこ <b data-role="wave">1 / 3</b></div>
        <div class="enemy-panel">
          <strong data-role="enemyName">グリーンスライム</strong>
          <div class="hp-row"><span>HP</span><div class="hp-shell"><div data-role="enemyHpFill" class="hp-fill"></div></div><b data-role="enemyHpText">90 / 90</b></div>
        </div>
      </header>
      <main class="lesson-card">
        <div data-role="promptKana" class="prompt-kana"></div>
        <div data-role="promptRomaji" class="prompt-romaji"></div>
      </main>
      <aside class="side-stats">
        <div class="stat-box"><span>せいかくりつ</span><b data-role="accuracy">100%</b></div>
        <div class="stat-box"><span>コンボ</span><b data-role="combo">0</b></div>
      </aside>
      <section class="keyboard-dock">
        <div data-role="keyboard" class="keyboard"></div>
        <div class="guide-line"><span data-role="nextGuide">ホームポジションに指をおいて、スタート！</span></div>
        <div data-role="hands" class="hands"></div>
      </section>
      <div data-role="startOverlay" class="modal is-open">
        <div class="modal-panel">
          <h1>タイピング勇者とキーボードの魔王</h1>
          <p>次に光るキーと指を見ながら、ローマ字を入力しよう。</p>
          <button class="primary-button" data-action="start">はじめる</button>
        </div>
      </div>
      <div data-role="resultOverlay" class="modal">
        <div class="modal-panel result">
          <h1>けっか</h1>
          <div data-role="resultBody" class="result-body"></div>
          <button class="primary-button" data-action="restart">もういちど</button>
        </div>
      </div>
    </div>
  `);

  const handles = {
    root: mount.querySelector('.ui-layer') as HTMLElement,
    timer: mount.querySelector('[data-role="timer"]') as HTMLElement,
    wave: mount.querySelector('[data-role="wave"]') as HTMLElement,
    enemyName: mount.querySelector('[data-role="enemyName"]') as HTMLElement,
    enemyHpFill: mount.querySelector('[data-role="enemyHpFill"]') as HTMLElement,
    enemyHpText: mount.querySelector('[data-role="enemyHpText"]') as HTMLElement,
    promptKana: mount.querySelector('[data-role="promptKana"]') as HTMLElement,
    promptRomaji: mount.querySelector('[data-role="promptRomaji"]') as HTMLElement,
    keyboard: mount.querySelector('[data-role="keyboard"]') as HTMLElement,
    hands: mount.querySelector('[data-role="hands"]') as HTMLElement,
    accuracy: mount.querySelector('[data-role="accuracy"]') as HTMLElement,
    combo: mount.querySelector('[data-role="combo"]') as HTMLElement,
    nextGuide: mount.querySelector('[data-role="nextGuide"]') as HTMLElement,
    startOverlay: mount.querySelector('[data-role="startOverlay"]') as HTMLElement,
    resultOverlay: mount.querySelector('[data-role="resultOverlay"]') as HTMLElement,
    resultBody: mount.querySelector('[data-role="resultBody"]') as HTMLElement,
  };
  renderKeyboard(handles.keyboard);
  renderHands(handles.hands);
  return handles;
};

export const renderSnapshot = (ui: UiHandles, snapshot: GameSnapshot): void => {
  ui.timer.textContent = formatTime(snapshot.timeLeft);
  ui.wave.textContent = snapshot.enemy.kind === 'boss' ? `${snapshot.stats.bosses + 1}戦目` : `${(snapshot.wave % 4) + 1} / 3`;
  ui.enemyName.textContent = snapshot.enemy.name;
  ui.enemyHpFill.style.width = `${Math.round((snapshot.enemy.hp / snapshot.enemy.maxHp) * 100)}%`;
  ui.enemyHpText.textContent = `${snapshot.enemy.hp} / ${snapshot.enemy.maxHp}`;
  ui.promptKana.textContent = snapshot.prompt.kana;
  ui.accuracy.textContent = `${getAccuracy(snapshot.stats)}%`;
  ui.combo.textContent = `${snapshot.stats.streak}`;

  const nextKey = snapshot.prompt.romaji[snapshot.typedIndex] ?? '';
  ui.promptRomaji.replaceChildren(...snapshot.prompt.romaji.split('').map((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.className = index < snapshot.typedIndex ? 'done' : index === snapshot.typedIndex ? 'next' : '';
    return span;
  }));

  const finger = nextKey ? getFingerForKey(nextKey) : 'thumb';
  ui.nextGuide.textContent = nextKey
    ? `つぎは ${nextKey} キー：${fingerNames[finger]}で押して、ホームポジションへ`
    : 'よくできました！';
  ui.root.dataset.nextTone = fingerTone[finger];
  markActiveKey(ui.keyboard, nextKey, snapshot.lastMistake);
  markActiveFinger(ui.hands, finger, snapshot.lastMistake !== null);

  if (snapshot.ended) {
    renderResult(ui, snapshot.stats);
  }
};

const renderKeyboard = (keyboard: HTMLElement): void => {
  const keys = jisKeyboard.flat();
  keyboard.replaceChildren(...keys.map((entry) => {
      const keyEl = document.createElement('div');
      keyEl.className = `key key-${fingerTone[entry.finger]}${entry.home ? ' is-home' : ''}`;
      keyEl.dataset.key = entry.label.toUpperCase();
      keyEl.style.setProperty('--x', `${entry.x}`);
      keyEl.style.setProperty('--y', `${entry.y}`);
      keyEl.style.setProperty('--wide', `${entry.wide ?? 1}`);
      keyEl.innerHTML = `<b>${entry.label}</b><small>${entry.kana}</small>`;
      return keyEl;
  }));
};

const renderHands = (hands: HTMLElement): void => {
  hands.replaceChildren(...['left', 'right'].map((side) => {
    const hand = document.createElement('div');
    hand.className = `hand ${side}`;
    const fingers = side === 'left' ? fingerOrder.slice(0, 4) : fingerOrder.slice(4);
    fingers.forEach((finger) => {
      const el = document.createElement('div');
      el.className = `finger finger-${fingerTone[finger]}`;
      el.dataset.finger = finger;
      el.innerHTML = `<span></span><small>${fingerNames[finger].replace(`${side === 'left' ? '左手' : '右手'} `, '')}</small>`;
      hand.append(el);
    });
    const palm = document.createElement('div');
    palm.className = 'palm';
    hand.append(palm);
    return hand;
  }));
};

const markActiveKey = (keyboard: HTMLElement, nextKey: string, mistake: string | null): void => {
  keyboard.querySelectorAll('.key').forEach((node) => {
    node.classList.toggle('is-next', (node as HTMLElement).dataset.key === nextKey);
    node.classList.toggle('is-mistake', mistake !== null && (node as HTMLElement).dataset.key === mistake);
  });
};

const markActiveFinger = (hands: HTMLElement, finger: FingerId, mistake: boolean): void => {
  hands.querySelectorAll('.finger').forEach((node) => {
    const el = node as HTMLElement;
    el.classList.toggle('is-next', el.dataset.finger === finger);
    el.classList.toggle('is-warning', mistake && el.dataset.finger === finger);
  });
};

const renderResult = (ui: UiHandles, stats: GameStats): void => {
  const weakFinger = getWeakestFinger(stats);
  const weakFingerText = weakFinger === 'none' ? 'なし' : fingerNames[weakFinger];
  const speed = Math.round(stats.correct);
  ui.resultBody.innerHTML = `
    <p class="result-comment">すごい！ ${stats.defeated}体のモンスターをたおした！</p>
    <dl>
      <dt>ボス討伐</dt><dd>${stats.bosses}体</dd>
      <dt>入力文字数</dt><dd>${stats.typed}</dd>
      <dt>正しく入力</dt><dd>${stats.correct}</dd>
      <dt>ミス</dt><dd>${stats.mistakes}</dd>
      <dt>正解率</dt><dd>${getAccuracy(stats)}%</dd>
      <dt>1分間の入力速度</dt><dd>${speed} 文字/分</dd>
      <dt>苦手キー</dt><dd>${getWeakestKey(stats)}</dd>
      <dt>苦手な指</dt><dd>${weakFingerText}</dd>
    </dl>
  `;
  ui.resultOverlay.classList.add('is-open');
};

const formatTime = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};
