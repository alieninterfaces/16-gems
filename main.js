import { initGame } from './gameInit.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { handleResetGame } from './gameLogic.js';
import { initializeScore } from './gameBoard.js';


function startGame() {
  initGame();
  initializeScore();
  initDragAndDrop();
  


  const app = document.getElementById('app');
  let scale =1;
  if (window.innerWidth < window.innerHeight) {
    scale = window.innerWidth / 500; // 1vw
  } else {
    scale = window.innerHeight / 600; // 1vh
  }
  app.style.transform = `scale(${scale})`;

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', handleResetGame);
}

//resize handler
window.addEventListener('resize', () => {
  const app = document.getElementById('app');
let scale =1;
  if (window.innerWidth < window.innerHeight) {
    scale = window.innerWidth / 500; // 1vw
  } else {
    scale = window.innerHeight / 600; // 1vh
  }
  app.style.transform = `scale(${scale})`;
});

document.addEventListener('DOMContentLoaded', startGame);
