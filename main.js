import { initGame } from './gameInit.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { handleResetGame } from './gameLogic.js';
import { initializeScore } from './gameBoard.js';


function startGame() {
  initGame();
  initializeScore();
  initDragAndDrop();
  
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', handleResetGame);
}

document.addEventListener('DOMContentLoaded', startGame);
