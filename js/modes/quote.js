import { gameState } from '../game.js';

export function updateQuoteMode() {
  const headerInfo = document.getElementById('game-header-info');
  const container = document.getElementById('guesses-container');
  const target = gameState.targets['quote'];
  const guesses = gameState.guesses['quote'];

  // Render quote
  headerInfo.innerHTML = `
    <div class="quote-container anim-pop">
      <p>${target.quote}</p>
    </div>
  `;

  // Render previous guesses
  container.innerHTML = '';
  guesses.forEach((guessChar) => {
    const isCorrect = guessChar.id === target.id;
    
    const row = document.createElement('div');
    row.className = 'guess-row quote-guess-row';
    // Use 1 column for quote mode guesses for simplicity
    row.style.gridTemplateColumns = '1fr';
    
    const cell = document.createElement('div');
    cell.className = `guess-cell quote-guess-cell anim-flip ${isCorrect ? 'correct' : 'wrong'}`;
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
