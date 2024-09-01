import { renderTetrisPiece } from './gameBoard.js';
import { updatePiecesOpacity } from './gameBoard.js';

// Define Tetris pieces
export const tetrisPieces = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00f0f0'
  },
  L: {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    color: '#c54155'
  },
  J: {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    color: '#c54155'
  },
  T: {
    shape: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    color: '#a000f0'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ae59b3'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  Single: {
    shape: [
      [1]
    ],
    color: '#f0a0f0'
  },
  Plus: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    color: '#a0a0a0'
  },
  U: {
    shape: [
      [1, 0, 1],
      [1, 1, 1]
    ],
    color: '#7bac3c'
  },
  BigSquare: {
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    color: '#9e4b1e'
  },
  Two: {
    shape: [
      [1, 1]
    ],
    color: '#3c77b9'
  }
};

export function getRandomPiece() {
  const keys = Object.keys(tetrisPieces);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, piece: tetrisPieces[randomKey] };
}

// Function to replace used piece
export function replaceUsedPiece(usedPieceElement) {
  const tetrisBank = document.getElementById('tetris-bank');
  const randomPiece = getRandomPiece();
  usedPieceElement.remove();
  renderTetrisPiece(randomPiece.key, randomPiece.piece, tetrisBank);
  updatePiecesOpacity();
  //initDragAndDrop(); // Re-initialize drag and drop after replacing a piece
  return randomPiece;
}

// ... other piece-related functions ...