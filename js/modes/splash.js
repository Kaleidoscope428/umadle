import { gameState } from '../game.js';

export function updateSplashMode() {
  const headerInfo = document.getElementById('game-header-info');
  const container = document.getElementById('guesses-container');
  const target = gameState.targets['splash'];
  const splashHint = gameState.getSplashHint();
  const guesses = gameState.guesses['splash'];

  if (splashHint) {
    const blurAmount = splashHint.isTracenAcademy
      ? Math.max(0, 12 - guesses.length * 2)
      : 0;
    const scaleAmount = splashHint.isTracenAcademy
      ? Math.max(1, 2.5 - guesses.length * 0.28)
      : Math.max(1.1, 2.9 - guesses.length * 0.32);

    headerInfo.innerHTML = '';
    const splashContainer = document.createElement('div');
    splashContainer.className = 'splash-container anim-pop';

    const splashImage = document.createElement('img');
    splashImage.className = 'splash-image';
    splashImage.src = splashHint.imageUrl;
    splashImage.alt = 'Support card clue';
    splashImage.draggable = false;
    splashImage.referrerPolicy = 'no-referrer';
    splashImage.style.transform = `scale(${scaleAmount})`;
    splashImage.style.transformOrigin = `${splashHint.focusX} ${splashHint.focusY}`;
    splashImage.style.filter = `blur(${blurAmount}px)`;

    splashContainer.appendChild(splashImage);
    headerInfo.appendChild(splashContainer);
  } else {
    headerInfo.innerHTML = `
      <div class="splash-container anim-pop splash-fallback">
        <p>No support-card clue available for this character. Press New Question.</p>
      </div>
    `;
  }

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
