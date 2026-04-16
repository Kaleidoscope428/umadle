import { characters } from './data.js';

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
    this.initTargets();
  }

  initTargets() {
    // Select random targets for all modes
    Object.keys(this.targets).forEach(mode => {
      this.targets[mode] = characters[Math.floor(Math.random() * characters.length)];
    });
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
    this.targets[mode] = characters[Math.floor(Math.random() * characters.length)];
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
