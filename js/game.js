import { buildSupportCardImageUrl, characters, getSupportCardsForCharacter } from './data.js';

class GameState {
  constructor() {
    this.currentMode = 'classic';
    this.targets = {
      classic: null,
      quote: null,
      emoji: null,
      splash: null,
      voice: null
    };
    this.guesses = {
      classic: [],
      quote: [],
      emoji: [],
      splash: [],
      voice: []
    };
    this.modeHints = {
      splash: null
    };
    this.initTargets();
  }

  getRandomCharacter(pool = characters) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  createSplashHint(targetCharacter) {
    const cards = getSupportCardsForCharacter(targetCharacter);
    if (!cards.length) return null;

    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    const isTracenAcademy = selectedCard.titleEn === '[Tracen Academy]';

    // 8 regions in a 4x2 grid, each region is approximately 1/8 of the image area.
    const oneEighthRegions = [
      { x: '12.5%', y: '25%' },
      { x: '37.5%', y: '25%' },
      { x: '62.5%', y: '25%' },
      { x: '87.5%', y: '25%' },
      { x: '12.5%', y: '75%' },
      { x: '37.5%', y: '75%' },
      { x: '62.5%', y: '75%' },
      { x: '87.5%', y: '75%' }
    ];

    const region = oneEighthRegions[Math.floor(Math.random() * oneEighthRegions.length)];
    return {
      cardId: selectedCard.id,
      titleEn: selectedCard.titleEn,
      imageUrl: buildSupportCardImageUrl(selectedCard.id),
      isTracenAcademy,
      focusX: isTracenAcademy ? '50%' : region.x,
      focusY: isTracenAcademy ? '50%' : region.y
    };
  }

  resetSplashTargetAndHint() {
    const splashCandidates = characters.filter((char) => getSupportCardsForCharacter(char).length > 0);
    const splashPool = splashCandidates.length > 0 ? splashCandidates : characters;
    const target = this.getRandomCharacter(splashPool);
    this.targets.splash = target;
    this.modeHints.splash = this.createSplashHint(target);
  }

  getSplashHint() {
    return this.modeHints.splash;
  }

  initTargets() {
    this.targets.classic = this.getRandomCharacter();
    this.targets.quote = this.getRandomCharacter();
    this.targets.emoji = this.getRandomCharacter();
    this.targets.voice = this.getRandomCharacter();
    this.resetSplashTargetAndHint();
  }

  resetGame() {
    this.guesses = {
      classic: [],
      quote: [],
      emoji: [],
      splash: [],
      voice: []
    };
    this.initTargets();
  }

  resetCurrentMode() {
    const mode = this.currentMode;
    this.guesses[mode] = [];
    if (mode === 'splash') {
      this.resetSplashTargetAndHint();
      return;
    }
    this.targets[mode] = this.getRandomCharacter();
  }

  getTarget() {
    return this.targets[this.currentMode];
  }

  makeGuess(character) {
    if (this.hasWon()) return null;
    
    this.guesses[this.currentMode].push(character);
    return this.evaluateGuess(character);
  }

  hasWon() {
    const modeGuesses = this.guesses[this.currentMode];
    if (modeGuesses.length === 0) return false;
    return modeGuesses[modeGuesses.length - 1].id === this.getTarget().id;
  }

  evaluateGuess(guessChar) {
    const target = this.getTarget();
    
    // Evaluate classic mode attributes
    return {
      character: guessChar,
      isCorrect: guessChar.id === target.id,
      attributes: {
        track: this.compareString(guessChar.track, target.track),
        distance: this.compareString(guessChar.distance, target.distance),
        style: this.compareString(guessChar.style, target.style),
        ear: this.compareString(guessChar.ear, target.ear),
        height: this.compareNumber(guessChar.height, target.height) // returns 'correct', 'higher', 'lower'
      }
    };
  }

  compareString(guessVal, targetVal) {
    // If exactly the same string
    if (guessVal === targetVal) return 'correct';
    
    // Split by comma for arrays
    const guessArr = guessVal.split(',').map(s => s.trim());
    const targetArr = targetVal.split(',').map(s => s.trim());
    
    // Check for intersection
    const intersection = guessArr.filter(v => targetArr.includes(v));
    
    if (intersection.length > 0) {
      // If sets are identical regardless of order
      if (intersection.length === guessArr.length && intersection.length === targetArr.length) {
        return 'correct';
      }
      return 'partial'; // Partial match
    }
    
    return 'wrong';
  }

  compareNumber(guessVal, targetVal) {
    if (guessVal === targetVal) return { status: 'correct', arrow: null };
    return {
      status: 'wrong',
      arrow: guessVal < targetVal ? '↑' : '↓'
    };
  }
}

export const gameState = new GameState();
