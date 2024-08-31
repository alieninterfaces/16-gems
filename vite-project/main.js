import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

// Define Tetris pieces
const tetrisPieces = {
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
    color: '#f0a000'
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
    color: '#f0f000'
  }
};

let selectedPiece = null;
let score = 0;

// Function to create the game grid
function createGameGrid() {
  const gameGrid = document.getElementById('game-grid');
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    gameGrid.appendChild(cell);
  }
}

// Function to render a single Tetris piece
function renderTetrisPiece(key, piece, container) {
  const pieceElement = document.createElement('div');
  pieceElement.className = 'tetris-piece';
  pieceElement.id = `piece-${key}-${Date.now()}`; // Add unique identifier

  const grid = document.createElement('div');
  grid.className = 'piece-grid';
  
  // Create a deep copy of the piece shape and randomly rotate it
  let shapeClone = JSON.parse(JSON.stringify(piece.shape));
  const rotations = Math.floor(Math.random() * 4); // 0 to 3 rotations
  for (let i = 0; i < rotations; i++) {
    shapeClone = rotateMatrix(shapeClone);
  }
  pieceElement.dataset.shape = JSON.stringify(shapeClone);
  
  updatePieceGrid(grid, shapeClone, piece.color);

  pieceElement.appendChild(grid);
  container.appendChild(pieceElement);

  pieceElement.setAttribute('draggable', true);
  pieceElement.addEventListener('dragstart', dragStart);
}

// Function to update the piece grid
function updatePieceGrid(grid, shape, color) {
  grid.innerHTML = '';
  grid.style.display = 'grid';
  grid.style.gridTemplateRows = `repeat(${shape.length}, 20px)`;
  grid.style.gridTemplateColumns = `repeat(${shape[0].length}, 20px)`;

  shape.forEach(row => {
    row.forEach(cell => {
      const cellElement = document.createElement('div');
      cellElement.className = 'piece-cell';
      cellElement.style.backgroundColor = cell ? color : 'transparent';
      grid.appendChild(cellElement);
    });
  });
}

// Function to rotate a matrix (2D array) 90 degrees clockwise
function rotateMatrix(matrix) {
  const N = matrix.length;
  const rotated = matrix[0].map((val, index) => 
    matrix.map(row => row[index]).reverse()
  );
  return rotated;
}

// Function to render initial Tetris pieces
function renderTetrisPieces() {
  const tetrisBank = document.getElementById('tetris-bank');
  for (let i = 0; i < 4; i++) {
    const randomPiece = getRandomPiece();
    renderTetrisPiece(randomPiece.key, randomPiece.piece, tetrisBank);
  }
}

// Function to get a random piece
function getRandomPiece() {
  const keys = Object.keys(tetrisPieces);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, piece: tetrisPieces[randomKey] };
}

// Function to replace used piece
function replaceUsedPiece(usedPieceElement) {
  const tetrisBank = document.getElementById('tetris-bank');
  const randomPiece = getRandomPiece();
  usedPieceElement.remove();
  renderTetrisPiece(randomPiece.key, randomPiece.piece, tetrisBank);
}

// Function to initialize drag-and-drop and hover preview
function initDragAndDrop() {
  const gridCells = document.querySelectorAll('.grid-cell');

  gridCells.forEach(cell => {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
    cell.addEventListener('mouseover', showPreview);
    cell.addEventListener('mouseout', clearPreview);
  });
}

// Function to select a piece
function selectPiece(e) {
  if (selectedPiece) {
    selectedPiece.classList.remove('selected');
  }
  selectedPiece = e.currentTarget;
  selectedPiece.classList.add('selected');
}

// Function to show preview
function showPreview(e) {
  if (!selectedPiece) return;

  const shape = JSON.parse(selectedPiece.dataset.shape);
  const targetIndex = parseInt(e.target.dataset.index);
  const gridSize = 5;

  clearPreview();

  if (canPlacePiece(shape, targetIndex, gridSize)) {
    const targetRow = Math.floor(targetIndex / gridSize);
    const targetCol = targetIndex % gridSize;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const cellIndex = (targetRow + row) * gridSize + (targetCol + col);
          const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
          cell.classList.add('preview');
        }
      }
    }
  }
}

// Function to clear preview
function clearPreview() {
  document.querySelectorAll('.grid-cell.preview').forEach(cell => {
    cell.classList.remove('preview');
  });
}

// Drag start event handler
function dragStart(e) {
  const pieceElement = e.currentTarget;
  const shape = JSON.parse(pieceElement.dataset.shape);
  e.dataTransfer.setData('text/plain', JSON.stringify({
    id: pieceElement.id,
    shape: shape
  }));
  selectPiece(e);
}

// Drag over event handler
function dragOver(e) {
  e.preventDefault();
  showPreview(e);
}

// Drop event handler
function drop(e) {
  e.preventDefault();
  if (!selectedPiece) return;

  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const pieceId = data.id;
  const pieceShape = data.shape;
  const pieceType = pieceId.split('-')[1];

  const targetIndex = parseInt(e.target.dataset.index);
  const gridSize = 5;

  if (canPlacePiece(pieceShape, targetIndex, gridSize)) {
    placePiece(pieceShape, targetIndex, gridSize, tetrisPieces[pieceType].color);
    replaceUsedPiece(selectedPiece);
    selectedPiece = null;
  }

  clearPreview();
}

// Function to check if a piece can be placed
function canPlacePiece(pieceShape, targetIndex, gridSize) {
  const targetRow = Math.floor(targetIndex / gridSize);
  const targetCol = targetIndex % gridSize;

  for (let row = 0; row < pieceShape.length; row++) {
    for (let col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col]) {
        const gridRow = targetRow + row;
        const gridCol = targetCol + col;
        if (gridRow >= gridSize || gridCol >= gridSize) {
          return false;
        }
        const cellIndex = gridRow * gridSize + gridCol;
        const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
        if (cell.style.backgroundColor !== '') {
          return false;
        }
      }
    }
  }
  return true;
}

// Function to place a piece on the grid
function placePiece(pieceShape, targetIndex, gridSize, color) {
  const targetRow = Math.floor(targetIndex / gridSize);
  const targetCol = targetIndex % gridSize;

  for (let row = 0; row < pieceShape.length; row++) {
    for (let col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col]) {
        const cellIndex = (targetRow + row) * gridSize + (targetCol + col);
        const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
        cell.style.backgroundColor = color;
      }
    }
  }

  checkAndClearLines(gridSize);
}

// Function to check and clear completed rows and columns
function checkAndClearLines(gridSize) {
  let clearedRows = 0;
  let clearedColumns = 0;

  for (let i = 0; i < gridSize; i++) {
    if (isRowComplete(i, gridSize)) {
      clearRow(i, gridSize);
      clearedRows++;
    }
    if (isColumnComplete(i, gridSize)) {
      clearColumn(i, gridSize);
      clearedColumns++;
    }
  }

  updateScore(clearedRows, clearedColumns);
}

// Function to check if a row is complete
function isRowComplete(row, gridSize) {
  for (let col = 0; col < gridSize; col++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    if (cell.style.backgroundColor === '') {
      return false;
    }
  }
  return true;
}

// Function to check if a column is complete
function isColumnComplete(col, gridSize) {
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    if (cell.style.backgroundColor === '') {
      return false;
    }
  }
  return true;
}

// Function to clear a completed row
function clearRow(row, gridSize) {
  for (let col = 0; col < gridSize; col++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundColor = '';
  }
}

// Function to clear a completed column
function clearColumn(col, gridSize) {
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundColor = '';
  }
}

// Function to update the score
function updateScore(clearedRows, clearedColumns) {
  let pointsEarned = 0;
  
  if (clearedRows > 0 && clearedColumns > 0) {
    // Special case: both row(s) and column(s) cleared
    pointsEarned = 10;
  } else {
    // Regular case: award 1 point per cleared line
    pointsEarned = clearedRows + clearedColumns;
  }
  
  score += pointsEarned;
  
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`;
  } else {
    console.error('Score element not found');
  }
}

// Function to reset the game
function resetGame() {
  // Clear the grid
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.style.backgroundColor = '';
  });

  // Reset the score
  score = 0;
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = 'Score: 0';
  }

  // Clear the tetris bank
  const tetrisBank = document.getElementById('tetris-bank');
  tetrisBank.innerHTML = '';

  // Generate new pieces
  renderTetrisPieces();

  // Clear selected piece
  if (selectedPiece) {
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
  }
}

// Function to initialize the game
function initGame() {
  createGameGrid();
  renderTetrisPieces();
  initDragAndDrop();
  
  // Add score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score';
  scoreDisplay.textContent = 'Score: 0';
  document.getElementById('app').insertBefore(scoreDisplay, document.getElementById('game-container'));

  // Add reset button functionality
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetGame);
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

