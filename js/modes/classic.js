import { gameState } from '../game.js';

export function updateClassicMode() {
  const container = document.getElementById('guesses-container');
  container.innerHTML = ''; // re-render all guesses
  
  const guesses = gameState.guesses['classic'];
  guesses.forEach((guessChar, idx) => {
    // To recreate the result object quickly:
    const target = gameState.targets['classic'];
    const result = {
      character: guessChar,
      isCorrect: guessChar.id === target.id,
      attributes: {
        track: gameState.compareString(guessChar.track, target.track),
        distance: gameState.compareString(guessChar.distance, target.distance),
        style: gameState.compareString(guessChar.style, target.style),
        ear: gameState.compareString(guessChar.ear, target.ear),
        height: gameState.compareNumber(guessChar.height, target.height),
        birthDay: gameState.compareNumber(guessChar.birthDay, target.birthDay),
        birthMonth: gameState.compareNumber(guessChar.birthMonth, target.birthMonth),
        bust: gameState.compareNumber(guessChar.bust, target.bust),
        waist: gameState.compareNumber(guessChar.waist, target.waist),
        hips: gameState.compareNumber(guessChar.hips, target.hips)
      }
    };
    renderClassicGuess(result, idx + 1);
  });
}

export function renderClassicGuess(result, guessNumber) {
  const container = document.getElementById('guesses-container');
  
  const row = document.createElement('div');
  row.className = 'guess-row';
  
  const attrs = [
    { type: 'image', val: result.character.icon, name: result.character.name },
    { type: 'text', val: result.character.track, status: result.attributes.track },
    { type: 'text', val: result.character.distance, status: result.attributes.distance },
    { type: 'text', val: result.character.style, status: result.attributes.style },
    { type: 'text', val: result.character.ear, status: result.attributes.ear },
    { type: 'number', val: result.character.height, status: result.attributes.height.status, arrow: result.attributes.height.arrow },
    { type: 'number', val: result.character.birthDay, status: result.attributes.birthDay.status, arrow: result.attributes.birthDay.arrow },
    { type: 'number', val: result.character.birthMonth, status: result.attributes.birthMonth.status, arrow: result.attributes.birthMonth.arrow },
    { type: 'number', val: result.character.bust, status: result.attributes.bust.status, arrow: result.attributes.bust.arrow },
    { type: 'number', val: result.character.waist, status: result.attributes.waist.status, arrow: result.attributes.waist.arrow },
    { type: 'number', val: result.character.hips, status: result.attributes.hips.status, arrow: result.attributes.hips.arrow }
  ];

  attrs.forEach((attr, idx) => {
    const cell = document.createElement('div');
    cell.className = 'guess-cell anim-flip';
    cell.style.animationDelay = `${idx * 0.15}s`;

    if (attr.type === 'image') {
      cell.classList.add('has-image');
      cell.innerHTML = `<img class="cell-content" src="${attr.val}" alt="${attr.name}">`;
      // By default image cell status is determined if overall is correct
      if (result.isCorrect) cell.classList.add('correct');
      else cell.classList.add('wrong');
    } else {
      cell.classList.add(attr.status);
      let html = `<span class="cell-content">${attr.val}</span>`;
      if (attr.type === 'number' && attr.arrow) {
        html += `<div class="bg-arrow">${attr.arrow}</div>`;
      }
      cell.innerHTML = html;
    }
    
    row.appendChild(cell);
  });

  // Prepend so the newest guess is at the top
  container.insertBefore(row, container.firstChild);
}
