import { characters } from './data.js';
import { gameState } from './game.js';
import { updateClassicMode, renderClassicGuess } from './modes/classic.js';
import { updateQuoteMode } from './modes/quote.js';
import { updateEmojiMode } from './modes/emoji.js';
import { updateSplashMode } from './modes/splash.js';
import { updateVoiceMode } from './modes/voice.js';

const RACE_MODES = new Set(['quote', 'splash', 'voice']);
const RACE_DURATION_SECONDS = 60;
const RACE_STATS_STORAGE_KEY = 'umadle_race_stats_v1';

const raceState = {
  active: false,
  mode: null,
  timeLeft: RACE_DURATION_SECONDS,
  score: 0,
  timerId: null
};

let raceStats = loadRaceStats();

const ui = {
  modal: null,
  closeModalBtn: null,
  playAgainBtn: null,
  newQuestionBtn: null,
  searchInput: null,
  autocompleteList: null,
  racePanel: null,
  raceStartBtn: null,
  raceStopBtn: null,
  raceTimer: null,
  raceScore: null,
  raceStatus: null,
  raceBest: null,
  raceLast: null
};

function defaultRaceStats() {
  return {
    quote: { best: 0, last: 0 },
    splash: { best: 0, last: 0 },
    voice: { best: 0, last: 0 }
  };
}

function loadRaceStats() {
  try {
    const raw = localStorage.getItem(RACE_STATS_STORAGE_KEY);
    if (!raw) return defaultRaceStats();
    const parsed = JSON.parse(raw);
    const merged = defaultRaceStats();
    ['quote', 'splash', 'voice'].forEach((mode) => {
      merged[mode].best = Number(parsed?.[mode]?.best) || 0;
      merged[mode].last = Number(parsed?.[mode]?.last) || 0;
    });
    return merged;
  } catch (error) {
    console.warn('Failed to load race stats from localStorage.', error);
    return defaultRaceStats();
  }
}

function saveRaceStats() {
  try {
    localStorage.setItem(RACE_STATS_STORAGE_KEY, JSON.stringify(raceStats));
  } catch (error) {
    console.warn('Failed to save race stats to localStorage.', error);
  }
}

function modeLabel(mode) {
  if (mode === 'quote') return 'Quote';
  if (mode === 'splash') return 'Image';
  if (mode === 'voice') return 'Voice';
  if (mode === 'classic') return 'Classic';
  if (mode === 'emoji') return 'Emoji';
  return mode;
}

function setBackgroundForMode(mode) {
  const bgImage = document.querySelector('.bg-image');
  if (!bgImage) return;

  if (mode === 'classic') {
    bgImage.style.backgroundImage = "url('./database/assets/BG/BG.png')";
  } else {
    bgImage.style.backgroundImage = '';
  }
}

function renderCurrentMode() {
  if (gameState.currentMode === 'classic') {
    updateClassicMode();
  } else if (gameState.currentMode === 'quote') {
    updateQuoteMode();
  } else if (gameState.currentMode === 'emoji') {
    updateEmojiMode();
  } else if (gameState.currentMode === 'splash') {
    updateSplashMode();
  } else if (gameState.currentMode === 'voice') {
    updateVoiceMode();
  }
}

function hideVictoryModal() {
  if (!ui.modal) return;
  ui.modal.classList.add('hidden');
  ui.modal.classList.remove('one-shot-mode');
  ui.modal.classList.remove('splash-victory-mode');
}

function updateRaceHud() {
  if (!ui.raceTimer || !ui.raceScore) return;
  ui.raceTimer.textContent = `${raceState.timeLeft}s`;
  ui.raceScore.textContent = String(raceState.score);
}

function updateRaceRecords() {
  if (!ui.raceBest || !ui.raceLast) return;
  const currentMode = gameState.currentMode;
  if (!RACE_MODES.has(currentMode)) {
    ui.raceBest.textContent = '-';
    ui.raceLast.textContent = '-';
    return;
  }

  ui.raceBest.textContent = String(raceStats[currentMode].best);
  ui.raceLast.textContent = String(raceStats[currentMode].last);
}

function setRaceStatus(text = '') {
  if (!ui.raceStatus) return;
  ui.raceStatus.textContent = text;
}

function updateRaceControlsState() {
  if (!ui.racePanel || !ui.raceStartBtn || !ui.raceStopBtn) return;
  const mode = gameState.currentMode;
  const raceSupported = RACE_MODES.has(mode);

  if (!raceSupported) {
    ui.racePanel.classList.add('hidden');
    setRaceStatus('');
    return;
  }

  ui.racePanel.classList.remove('hidden');
  ui.raceStartBtn.disabled = raceState.active;
  ui.raceStopBtn.disabled = !raceState.active;
  updateRaceRecords();
  updateRaceHud();
}

function updateNewQuestionButtonVisibility() {
  if (!ui.newQuestionBtn) return;
  if (raceState.active) {
    ui.newQuestionBtn.classList.add('hidden');
    return;
  }
  if (gameState.hasWon()) ui.newQuestionBtn.classList.remove('hidden');
  else ui.newQuestionBtn.classList.add('hidden');
}

function showRaceResultModal(mode, score, isNewBest) {
  if (!ui.modal || !ui.playAgainBtn) return;
  const title = ui.modal.querySelector('.modal-title');
  const msg = document.getElementById('victory-message');
  const info = document.getElementById('victory-character-info');

  ui.modal.classList.remove('one-shot-mode');
  ui.modal.classList.remove('splash-victory-mode');
  if (title) title.textContent = 'Time Up!';
  msg.innerHTML = `
    Race mode: <strong>${modeLabel(mode)}</strong><br>
    Correct answers in 60s: <strong>${score}</strong>
  `;

  info.classList.remove('splash-victory-layout');
  info.innerHTML = `
    <h3>${isNewBest ? 'New Record!' : 'Result Saved'}</h3>
    <p>Best: <strong>${raceStats[mode].best}</strong></p>
    <p>Last: <strong>${raceStats[mode].last}</strong></p>
  `;

  ui.playAgainBtn.dataset.action = 'race-restart';
  ui.playAgainBtn.textContent = 'Retry 60s';
  ui.modal.classList.remove('hidden');
}

function finalizeRace(showResultModal = true) {
  if (!raceState.active) return;

  const completedMode = raceState.mode;
  const completedScore = raceState.score;

  if (raceState.timerId) clearInterval(raceState.timerId);
  raceState.timerId = null;
  raceState.active = false;
  raceState.mode = null;

  const previousBest = raceStats[completedMode].best;
  raceStats[completedMode].last = completedScore;
  raceStats[completedMode].best = Math.max(previousBest, completedScore);
  saveRaceStats();

  setRaceStatus(showResultModal ? 'Race ended.' : '');
  updateRaceControlsState();
  updateNewQuestionButtonVisibility();

  if (showResultModal) {
    showRaceResultModal(completedMode, completedScore, completedScore > previousBest);
  }
}

function startRace() {
  if (raceState.active || !RACE_MODES.has(gameState.currentMode)) return;

  hideVictoryModal();
  gameState.resetCurrentMode();
  switchMode(gameState.currentMode);

  raceState.active = true;
  raceState.mode = gameState.currentMode;
  raceState.timeLeft = RACE_DURATION_SECONDS;
  raceState.score = 0;
  setRaceStatus(`Running: ${modeLabel(raceState.mode)} (60s)`);
  updateRaceControlsState();
  updateNewQuestionButtonVisibility();

  raceState.timerId = setInterval(() => {
    raceState.timeLeft -= 1;
    updateRaceHud();

    if (raceState.timeLeft <= 0) {
      finalizeRace(true);
    }
  }, 1000);

  if (ui.searchInput) ui.searchInput.focus();
}

function handleCorrectGuessDuringRace() {
  raceState.score += 1;
  updateRaceHud();

  setTimeout(() => {
    if (!raceState.active) return;
    gameState.resetCurrentMode();
    switchMode(gameState.currentMode);
    if (ui.searchInput) ui.searchInput.focus();
  }, 330);
}

function submitGuess(character) {
  if (gameState.hasWon()) return;
  const result = gameState.makeGuess(character);

  if (gameState.currentMode === 'classic') {
    renderClassicGuess(result, gameState.guesses.classic.length);
  } else {
    renderCurrentMode();
  }

  if (!gameState.hasWon()) return;

  if (raceState.active && raceState.mode === gameState.currentMode) {
    handleCorrectGuessDuringRace();
    return;
  }

  updateNewQuestionButtonVisibility();
  setTimeout(showVictoryModal, 600);
}

function showVictoryModal() {
  const info = document.getElementById('victory-character-info');
  const msg = document.getElementById('victory-message');
  const title = ui.modal.querySelector('.modal-title');
  if (!title || !ui.playAgainBtn) return;

  const target = gameState.getTarget();
  const tries = gameState.guesses[gameState.currentMode].length;
  const isSplashMode = gameState.currentMode === 'splash';
  const splashHint = isSplashMode ? gameState.getSplashHint() : null;

  title.textContent = 'Victory!';
  ui.modal.classList.toggle('splash-victory-mode', isSplashMode);

  if (tries === 1) {
    ui.modal.classList.add('one-shot-mode');
    msg.innerHTML = `<div class="one-shot-badge anim-pulse">🌟 ONE-SHOT! 🌟</div><p>Godlike intuition! You nailed it on your very first try!</p>`;
  } else {
    ui.modal.classList.remove('one-shot-mode');
    msg.innerHTML = `You found the answer in <strong>${tries}</strong> tries!`;
  }

  if (isSplashMode && splashHint?.imageUrl) {
    info.classList.add('splash-victory-layout');
    info.innerHTML = `
      <div class="victory-character-side">
        <img src="${target.icon}" alt="${target.name}">
        <h3>${target.name}</h3>
      </div>
      <div class="victory-divider" aria-hidden="true"></div>
      <div class="victory-splash-side">
        <img src="${splashHint.imageUrl}" alt="Full support card" class="victory-splash-full">
      </div>
    `;
  } else {
    info.classList.remove('splash-victory-layout');
    info.innerHTML = `
      <img src="${target.icon}" alt="${target.name}">
      <h3>${target.name}</h3>
    `;
  }

  ui.playAgainBtn.dataset.action = 'new-question';
  ui.playAgainBtn.textContent = 'Play Again';
  ui.modal.classList.remove('hidden');
}

export function setupUI() {
  ui.modal = document.getElementById('victory-modal');
  ui.closeModalBtn = document.getElementById('close-victory-btn');
  ui.playAgainBtn = document.getElementById('play-again-btn');
  ui.newQuestionBtn = document.getElementById('new-question-btn');
  ui.searchInput = document.getElementById('character-search');
  ui.autocompleteList = document.getElementById('autocomplete-list');
  ui.racePanel = document.getElementById('race-panel');
  ui.raceStartBtn = document.getElementById('race-start-btn');
  ui.raceStopBtn = document.getElementById('race-stop-btn');
  ui.raceTimer = document.getElementById('race-timer');
  ui.raceScore = document.getElementById('race-score');
  ui.raceStatus = document.getElementById('race-status');
  ui.raceBest = document.getElementById('race-best');
  ui.raceLast = document.getElementById('race-last');

  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset.mode;
      if (raceState.active && newMode !== raceState.mode) {
        setRaceStatus(`Race is running in ${modeLabel(raceState.mode)}. Stop it first.`);
        return;
      }

      modeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      switchMode(newMode);
    });
  });

  ui.searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    ui.autocompleteList.innerHTML = '';

    if (!val) {
      ui.autocompleteList.classList.add('hidden');
      return;
    }

    const matches = characters.filter((char) => char.name.toLowerCase().includes(val.toLowerCase()));
    if (!matches.length) {
      ui.autocompleteList.classList.add('hidden');
      return;
    }

    ui.autocompleteList.classList.remove('hidden');
    matches.forEach((char) => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.innerHTML = `
        <img src="${char.icon}" alt="${char.name}">
        <span>${char.name}</span>
      `;
      li.addEventListener('click', () => {
        submitGuess(char);
        ui.searchInput.value = '';
        ui.autocompleteList.classList.add('hidden');
      });
      ui.autocompleteList.appendChild(li);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target !== ui.searchInput) {
      ui.autocompleteList.classList.add('hidden');
    }
  });

  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.splash-container')) e.preventDefault();
  });
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.splash-container')) e.preventDefault();
  });

  const searchSubmit = document.querySelector('.search-submit');
  const handleSearchSubmit = () => {
    const val = ui.searchInput.value;
    if (!val || gameState.hasWon()) return;

    const match = characters.find((char) => char.name.toLowerCase() === val.toLowerCase()) ||
      characters.find((char) => char.name.toLowerCase().includes(val.toLowerCase()));
    if (!match) return;

    submitGuess(match);
    ui.searchInput.value = '';
    ui.autocompleteList.classList.add('hidden');
  };

  searchSubmit.addEventListener('click', handleSearchSubmit);
  ui.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  });

  ui.playAgainBtn.addEventListener('click', () => {
    const action = ui.playAgainBtn.dataset.action || 'new-question';
    hideVictoryModal();

    if (action === 'race-restart') {
      startRace();
      return;
    }

    gameState.resetCurrentMode();
    switchMode(gameState.currentMode);
    updateNewQuestionButtonVisibility();
    ui.searchInput.focus();
  });

  ui.newQuestionBtn.addEventListener('click', () => {
    hideVictoryModal();
    gameState.resetCurrentMode();
    switchMode(gameState.currentMode);
    updateNewQuestionButtonVisibility();
    ui.searchInput.focus();
  });

  ui.closeModalBtn.addEventListener('click', hideVictoryModal);
  ui.modal.addEventListener('click', (e) => {
    if (e.target === ui.modal) hideVictoryModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !ui.modal.classList.contains('hidden')) {
      hideVictoryModal();
    }
  });

  if (ui.raceStartBtn) {
    ui.raceStartBtn.addEventListener('click', () => {
      if (!RACE_MODES.has(gameState.currentMode)) return;
      startRace();
    });
  }

  if (ui.raceStopBtn) {
    ui.raceStopBtn.addEventListener('click', () => {
      if (!raceState.active) return;
      finalizeRace(true);
    });
  }

  updateRaceControlsState();
  updateNewQuestionButtonVisibility();
}

export function switchMode(mode) {
  gameState.currentMode = mode;
  setBackgroundForMode(mode);

  const container = document.getElementById('guesses-container');
  const headerInfo = document.getElementById('game-header-info');
  const classicHeaders = document.getElementById('classic-mode-headers');
  const legendBox = document.getElementById('legend-box');

  container.innerHTML = '';
  headerInfo.innerHTML = '';

  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (mode === 'classic') {
    classicHeaders.classList.remove('hidden');
    legendBox.classList.remove('hidden');
    updateClassicMode();
  } else {
    classicHeaders.classList.add('hidden');
    legendBox.classList.add('hidden');
    renderCurrentMode();
  }

  updateRaceControlsState();
  updateNewQuestionButtonVisibility();
}

