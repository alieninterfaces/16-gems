import { tetrisPieces, getRandomPiece } from './pieces.js';
import { canPlacePiece } from './gameLogic.js';
import { getHueRotationFromColor, rotateMatrix } from './utils.js';
import { GRID_SIZE, NUM_BANK_PIECES, BUBBLE_IMAGE_URL } from './constants.js';
import { initDragAndDrop } from './dragAndDrop.js';

export function createGameGrid() {
  const gameGrid = document.getElementById('game-grid');

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    gameGrid.appendChild(cell);
  }
}

export function renderTetrisPieces() {
  const tetrisBank = document.getElementById('tetris-bank');
  tetrisBank.innerHTML = ''; // Clear existing pieces
  for (let i = 0; i < NUM_BANK_PIECES; i++) {
    const randomPiece = getRandomPiece();
    renderTetrisPiece(randomPiece.key, randomPiece.piece, tetrisBank);
  }
  updatePiecesOpacity();
  //initDragAndDrop(); // Re-initialize drag and drop after rendering pieces
}

export function renderTetrisPiece(key, piece, container) {
  const pieceElement = document.createElement('div');
  pieceElement.className = 'tetris-piece';
  pieceElement.id = `piece-${key}-${Date.now()}`;

  const grid = document.createElement('div');
  grid.className = 'piece-grid';
  
  let shapeClone = JSON.parse(JSON.stringify(piece.shape));
  const rotations = Math.floor(Math.random() * 4);
  for (let i = 0; i < rotations; i++) {
    shapeClone = rotateMatrix(shapeClone);
  }
  pieceElement.dataset.shape = JSON.stringify(shapeClone);
  pieceElement.dataset.color = piece.color;
  updatePieceGrid(grid, shapeClone, piece.color);

  pieceElement.appendChild(grid);
  container.appendChild(pieceElement);

  pieceElement.setAttribute('draggable', true);
}

export function updatePiecesOpacity() {
  const bankPieces = document.querySelectorAll('.tetris-piece');
  bankPieces.forEach(piece => {
    const shape = JSON.parse(piece.dataset.shape);
    const canBePlaced = canPieceBePlacedAnywhere(shape);
    piece.classList.toggle('unplaceable', !canBePlaced);
    piece.draggable = canBePlaced;
  });
}

function canPieceBePlacedAnywhere(shape) {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const index = row * GRID_SIZE + col;
      if (canPlacePiece(shape, index)) {
        return true;
      }
    }
  }
  return false;
}

function updatePieceGrid(grid, shape, color) {
  grid.innerHTML = '';
  grid.style.display = 'grid';
  grid.style.gridTemplateRows = `repeat(${shape.length}, 10px)`;
  grid.style.gridTemplateColumns = `repeat(${shape[0].length}, 10px)`;

  shape.forEach(row => {
    row.forEach(cell => {
      const cellElement = document.createElement('div');
      cellElement.className = 'piece-cell';
      if (cell) {
        cellElement.style.backgroundImage = `url("${BUBBLE_IMAGE_URL}")`;
        cellElement.style.backgroundSize = 'cover';
        const hueRotation = getHueRotationFromColor(color);
        cellElement.style.filter = `hue-rotate(${hueRotation}deg)`;
      }
      grid.appendChild(cellElement);
    });
  });
}