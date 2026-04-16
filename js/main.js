import { setupUI, switchMode } from './ui.js';

// Top-level await in data.js causes this module to execute after DOMContentLoaded has already fired.
// Since type="module" is deferred by default, the DOM is guaranteed to be ready anyway.
setupUI();
switchMode('classic');
