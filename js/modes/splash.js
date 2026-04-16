import { gameState } from '../game.js';

export function updateSplashMode() {
  const headerInfo = document.getElementById('game-header-info');
  const container = document.getElementById('guesses-container');
  const target = gameState.targets['splash'];
  const guesses = gameState.guesses['splash'];

  // Logic: start zoomed in (scale 3), and filter blur(10px) 
  // With each guess, zoom out and unblur progressively.
  const blurAmount = Math.max(0, 10 - guesses.length * 2);
  const scaleAmount = Math.max(1, 3 - guesses.length * 0.4);

  headerInfo.innerHTML = `
    <div class="splash-container anim-pop">
      <img src="${target.splash}" class="splash-image" style="transform: scale(${scaleAmount}); filter: blur(${blurAmount}px);">
    </div>
  `;

  // Render guesses
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
