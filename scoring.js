import { SPECIAL_CLEAR_SCORE, SINGLE_CLEAR_SCORE } from './constants.js';

export let score = 0;

// Function to update the score
export function updateScore(clearedRows, clearedColumns) {
  let pointsEarned = 0;
  
  if (clearedRows > 0 && clearedColumns > 0) {
    // Special case: both row(s) and column(s) cleared
    pointsEarned = SPECIAL_CLEAR_SCORE;
  } else {
    // Regular case: award points per cleared line
    pointsEarned = (clearedRows + clearedColumns) * SINGLE_CLEAR_SCORE;
  }
  
  score += pointsEarned;
  
  updateScoreDisplay();
}

// Function to update the score display
function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`;
  } else {
    console.error('Score element not found');
  }
}

// Function to reset the score
export function resetScore() {
  score = 0;
  updateScoreDisplay();
}

// Function to get the current score
export function getScore() {
  return score;
}