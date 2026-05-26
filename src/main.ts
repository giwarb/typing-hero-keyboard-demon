import './styles.css';
import { ProceduralAudio } from './audio/proceduralAudio';
import { TypingRpgSession } from './game/simulation/state';
import { createPhaserGame } from './phaser/createGame';
import { buildUi, renderSnapshot } from './ui/render';

const root = document.querySelector<HTMLDivElement>('#game-root');
if (!root) throw new Error('Missing #game-root');

const phaserMount = document.createElement('div');
phaserMount.id = 'phaser-layer';
root.append(phaserMount);

const game = createPhaserGame(phaserMount);
const ui = buildUi(root);
const audio = new ProceduralAudio();
let session = new TypingRpgSession();
let lastFrame = performance.now();

const emitSnapshot = (): void => {
  const snapshot = session.getSnapshot();
  renderSnapshot(ui, snapshot);
  game.scene.getScene('BattleScene')?.events.emit('snapshot', snapshot);
};

const restart = (): void => {
  session = new TypingRpgSession();
  session.start();
  lastFrame = performance.now();
  ui.startOverlay.classList.remove('is-open');
  ui.resultOverlay.classList.remove('is-open');
  void audio.start();
  emitSnapshot();
};

const loop = (now: number): void => {
  const delta = now - lastFrame;
  lastFrame = now;
  session.tick(delta);
  emitSnapshot();
  requestAnimationFrame(loop);
};

root.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[data-action="start"], [data-action="restart"]')) {
    restart();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const result = session.input(event.key);
  if (result.event === 'correct') audio.correct();
  if (result.event === 'complete') audio.attack();
  if (result.event === 'mistake') audio.mistake();
  emitSnapshot();
});

emitSnapshot();
requestAnimationFrame(loop);
