import { GRID_SIZE, BUBBLE_IMAGE_URL } from './constants.js';
import { updateScore } from './scoring.js';
import { getHueRotationFromColor, calculateTargetPosition, getGridCell, setGridCellBackground } from './utils.js';
import { renderTetrisPieces, updatePiecesOpacity } from './gameBoard.js';
import { resetScore } from './scoring.js';

export function canPlacePiece(pieceShape, targetIndex) {
  const targetRow = Math.floor(targetIndex / GRID_SIZE);
  const targetCol = targetIndex % GRID_SIZE;

  for (let row = 0; row < pieceShape.length; row++) {
    for (let col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col]) {
        const gridRow = targetRow + row;
        const gridCol = targetCol + col;
        if (gridRow >= GRID_SIZE || gridCol >= GRID_SIZE || gridRow < 0 || gridCol < 0) {
          return false;
        }
        const cellIndex = gridRow * GRID_SIZE + gridCol;
        const cell = getGridCell(cellIndex);
        if (!cell || cell.style.backgroundImage !== '') {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(pieceShape, targetIndex, color) {
  const targetRow = Math.floor(targetIndex / GRID_SIZE);
  const targetCol = targetIndex % GRID_SIZE;

  for (let row = 0; row < pieceShape.length; row++) {
    for (let col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col]) {
        const cellIndex = (targetRow + row) * GRID_SIZE + (targetCol + col);
        setGridCellBackground(cellIndex, BUBBLE_IMAGE_URL, color);
      }
    }
  }

  checkAndClearLines();
}

function checkAndClearLines() {
  let clearedRows = [];
  let clearedColumns = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    if (isRowComplete(i, GRID_SIZE)) {
      clearedRows.push(i);
    }
    if (isColumnComplete(i, GRID_SIZE)) {
      clearedColumns.push(i);
    }
  }

  clearedRows.forEach(row => clearRow(row, GRID_SIZE));
  clearedColumns.forEach(col => clearColumn(col, GRID_SIZE));

  updateScore(clearedRows.length, clearedColumns.length);
}

function isRowComplete(row, gridSize) {
  for (let col = 0; col < gridSize; col++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    if (cell.style.backgroundImage === '') {
      return false;
    }
  }
  return true;
}

function isColumnComplete(col, gridSize) {
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    if (cell.style.backgroundImage === '') {
      return false;
    }
  }
  return true;
}

function clearRow(row, gridSize) {
  for (let col = 0; col < gridSize; col++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundImage = '';
    cell.style.filter = '';
  }
}

function clearColumn(col, gridSize) {
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundImage = '';
    cell.style.filter = '';
  }
}

export function resetGame() {
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.style.backgroundImage = '';
    cell.style.filter = '';
    cell.classList.remove('preview');
  });

  resetScore();
  renderTetrisPieces();
  updatePiecesOpacity();
}

export function handleResetGame(e) {
  e.preventDefault();
  resetGame();
  // Cancel any ongoing drag operation
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'none';
  }
}