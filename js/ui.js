import { characters } from './data.js';
import { gameState } from './game.js';
import { updateClassicMode, renderClassicGuess } from './modes/classic.js';
import { updateQuoteMode } from './modes/quote.js';
import { updateEmojiMode } from './modes/emoji.js';
import { updateSplashMode } from './modes/splash.js';

function setBackgroundForMode(mode) {
  const bgImage = document.querySelector('.bg-image');
  if (!bgImage) return;

  if (mode === 'classic') {
    bgImage.style.backgroundImage = "url('./database/assets/BG/BG.png')";
  } else {
    // Use CSS default background for non-classic modes.
    bgImage.style.backgroundImage = '';
  }
}

export function setupUI() {
  const modal = document.getElementById('victory-modal');
  const closeModalBtn = document.getElementById('close-victory-btn');
  const newQuestionBtn = document.getElementById('new-question-btn');
  const searchInput = document.getElementById('character-search');

  function updateNewQuestionButtonVisibility() {
    if (gameState.hasWon()) {
      newQuestionBtn.classList.remove('hidden');
    } else {
      newQuestionBtn.classList.add('hidden');
    }
  }

  function hideVictoryModal() {
    modal.classList.add('hidden');
    modal.classList.remove('one-shot-mode');
  }

  // Mode selection
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const newMode = btn.dataset.mode;
      switchMode(newMode);
    });
  });

  // Autocomplete search
  const autocompleteList = document.getElementById('autocomplete-list');

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    autocompleteList.innerHTML = '';
    
    if (!val) {
      autocompleteList.classList.add('hidden');
      return;
    }

    const matches = characters.filter(char => 
      char.name.toLowerCase().includes(val.toLowerCase())
    );

    if (matches.length > 0) {
      autocompleteList.classList.remove('hidden');
      matches.forEach((char) => {
        const li = document.createElement('li');
        li.className = 'autocomplete-item';
        li.innerHTML = `
          <img src="${char.icon}" alt="${char.name}">
          <span>${char.name}</span>
        `;
        li.addEventListener('click', () => {
          submitGuess(char);
          searchInput.value = '';
          autocompleteList.classList.add('hidden');
        });
        autocompleteList.appendChild(li);
      });
    } else {
      autocompleteList.classList.add('hidden');
    }
  });

  // Close autocomplete on outside click
  document.addEventListener('click', (e) => {
    if (e.target !== searchInput) {
      autocompleteList.classList.add('hidden');
    }
  });

  // Search submit button / Enter key
  const searchSubmit = document.querySelector('.search-submit');
  
  function handleSearchSubmit() {
    const val = searchInput.value;
    if (!val) return;
    
    // Prevent submitting if already won in this mode
    if (gameState.hasWon()) return;

    const match = characters.find(char => char.name.toLowerCase() === val.toLowerCase()) || 
                  characters.find(char => char.name.toLowerCase().includes(val.toLowerCase()));
    
    if (match) {
      submitGuess(match);
      searchInput.value = '';
      autocompleteList.classList.add('hidden');
    }
  }

  searchSubmit.addEventListener('click', handleSearchSubmit);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  });

  // Play Again logic
  document.getElementById('play-again-btn').addEventListener('click', () => {
    hideVictoryModal();
    gameState.resetGame();
    switchMode('classic');
    updateNewQuestionButtonVisibility();
    searchInput.focus();
  });

  newQuestionBtn.addEventListener('click', () => {
    hideVictoryModal();
    gameState.resetCurrentMode();
    switchMode(gameState.currentMode);
    updateNewQuestionButtonVisibility();
    searchInput.focus();
  });

  // Allow closing result popup without restarting
  closeModalBtn.addEventListener('click', hideVictoryModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideVictoryModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      hideVictoryModal();
    }
  });

  updateNewQuestionButtonVisibility();
}

function submitGuess(character) {
  if (gameState.hasWon()) return;

  const result = gameState.makeGuess(character);
  
  if (gameState.currentMode === 'classic') {
    renderClassicGuess(result, gameState.guesses['classic'].length);
  } else if (gameState.currentMode === 'quote') {
    updateQuoteMode();
  } else if (gameState.currentMode === 'emoji') {
    updateEmojiMode();
  } else if (gameState.currentMode === 'splash') {
    updateSplashMode();
  }

  if (gameState.hasWon()) {
    const newQuestionBtn = document.getElementById('new-question-btn');
    newQuestionBtn.classList.remove('hidden');
    setTimeout(showVictoryModal, 600);
  }
}

function showVictoryModal() {
  const modal = document.getElementById('victory-modal');
  const info = document.getElementById('victory-character-info');
  const msg = document.getElementById('victory-message');
  
  const target = gameState.getTarget();
  const tries = gameState.guesses[gameState.currentMode].length;
  
  if (tries === 1) {
    modal.classList.add('one-shot-mode');
    msg.innerHTML = `<div class="one-shot-badge anim-pulse">🌟 ONE-SHOT! 🌟</div><p>Godlike intuition! You nailed it on your very first try!</p>`;
  } else {
    msg.innerHTML = `You found the answer in <strong>${tries}</strong> tries!`;
  }
  
  info.innerHTML = `
    <img src="${target.icon}" alt="${target.name}">
    <h3>${target.name}</h3>
  `;
  
  modal.classList.remove('hidden');
}

export function switchMode(mode) {
  gameState.currentMode = mode;
  setBackgroundForMode(mode);
  
  // Clear container
  const container = document.getElementById('guesses-container');
  const headerInfo = document.getElementById('game-header-info');
  const classicHeaders = document.getElementById('classic-mode-headers');
  const legendBox = document.getElementById('legend-box');
  
  container.innerHTML = '';
  headerInfo.innerHTML = '';
  
  // Highlight active button correctly
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (mode === 'classic') {
    classicHeaders.classList.remove('hidden');
    legendBox.classList.remove('hidden');
    updateClassicMode();
  } else {
    classicHeaders.classList.add('hidden');
    legendBox.classList.add('hidden');
    if (mode === 'quote') updateQuoteMode();
    else if (mode === 'emoji') updateEmojiMode();
    else if (mode === 'splash') updateSplashMode();
  }

  const newQuestionBtn = document.getElementById('new-question-btn');
  if (gameState.hasWon()) newQuestionBtn.classList.remove('hidden');
  else newQuestionBtn.classList.add('hidden');
}
