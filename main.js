import { initGame } from './gameInit.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { handleResetGame } from './gameLogic.js';

function startGame() {
  initGame();
  initDragAndDrop();
  
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', handleResetGame);
}

document.addEventListener('DOMContentLoaded', startGame);
