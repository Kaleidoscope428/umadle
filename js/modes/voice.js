import { gameState } from '../game.js';

export function updateVoiceMode() {
  const headerInfo = document.getElementById('game-header-info');
  const container = document.getElementById('guesses-container');
  const target = gameState.targets.voice;
  const guesses = gameState.guesses.voice;

  if (target.voice) {
    headerInfo.innerHTML = `
      <div class="voice-container anim-pop">
        <div class="voice-title">Listen and guess the character</div>
        <audio controls preload="none" src="${target.voice}" class="voice-player">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
  } else {
    headerInfo.innerHTML = `
      <div class="voice-container anim-pop">
        <div class="voice-title">Listen and guess the character</div>
        <p class="voice-fallback-text">Voice clip is unavailable for this character. Press New Question to try another one.</p>
      </div>
    `;
  }

  container.innerHTML = '';
  guesses.forEach((guessChar) => {
    const isCorrect = guessChar.id === target.id;

    const row = document.createElement('div');
    row.className = 'guess-row';
    row.style.gridTemplateColumns = '1fr';

    const cell = document.createElement('div');
    cell.className = `guess-cell anim-flip ${isCorrect ? 'correct' : 'wrong'}`;
    cell.style.flexDirection = 'row';
    cell.style.justifyContent = 'flex-start';
    cell.style.padding = 'var(--sp-sm) var(--sp-lg)';
    cell.style.gap = 'var(--sp-md)';

    cell.innerHTML = `
      <img src="${guessChar.icon}" alt="${guessChar.name}" style="width: 48px; height: 48px; border-radius: var(--br-sm);">
      <span style="font-size: 1.2rem;">${guessChar.name}</span>
    `;

    row.appendChild(cell);
    container.insertBefore(row, container.firstChild);
  });
}

