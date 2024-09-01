import { createGameGrid, renderTetrisPieces, updatePiecesOpacity } from './gameBoard.js';
import { resetGame } from './gameLogic.js';

export function initGame() {
    console.log('go')
  createGameGrid();
  renderTetrisPieces();
  
  // Add score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score';
  scoreDisplay.textContent = 'Score: 0';
  document.getElementById('app').insertBefore(scoreDisplay, document.getElementById('game-container'));
}


