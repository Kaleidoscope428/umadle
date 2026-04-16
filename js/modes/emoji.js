import { gameState } from '../game.js';

export function updateEmojiMode() {
  const headerInfo = document.getElementById('game-header-info');
  const container = document.getElementById('guesses-container');
  const target = gameState.targets['emoji'];
  const guesses = gameState.guesses['emoji'];

  // Logic: 1 emoji initially, unlock 1 more for each wrong guess, max 4.
  const unlockedCount = Math.min(1 + guesses.length, 4);

  let emojisHtml = '';
  for (let i = 0; i < 4; i++) {
    if (i < unlockedCount) {
      emojisHtml += `<div class="emoji-slot anim-pop" style="animation-delay: ${i*0.1}s">${target.emojis[i]}</div>`;
    } else {
      emojisHtml += `<div class="emoji-slot">❓</div>`;
    }
  }

  headerInfo.innerHTML = `
    <div class="emoji-container">
      ${emojisHtml}
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
