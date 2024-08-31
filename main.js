
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
  J: {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    color: '#0000f0'
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
    color: '#f0f0a0'
  }
};

let selectedPiece = null;
let score = 0;
let draggedPiece = null;

// Function to create the game grid
function createGameGrid() {
  const gameGrid = document.getElementById('game-grid');
  const gridSize = 5;

  for (let i = 0; i < gridSize * gridSize; i++) {
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
  pieceElement.dataset.color = piece.color;
  updatePieceGrid(grid, shapeClone, piece.color);

  pieceElement.appendChild(grid);
  container.appendChild(pieceElement);

  pieceElement.setAttribute('draggable', true);
  pieceElement.addEventListener('dragstart', dragStart);
  pieceElement.addEventListener('dragend', dragEnd);
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
      if (cell) {
        cellElement.style.backgroundImage = 'url("/bubble.png")';
        cellElement.style.backgroundSize = 'cover';
        const hueRotation = getHueRotationFromColor(color);
        cellElement.style.filter = `hue-rotate(${hueRotation}deg)`;
      }
      grid.appendChild(cellElement);
    });
  });
}

function getHueRotationFromColor(color) {
  // Convert hex to RGB
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hueRotation = Math.round(hsl[0] * 360);
  return hueRotation;
}

function hexToRgb(hex) {
  // Remove the hash if it's there
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
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
  tetrisBank.innerHTML = ''; // Clear existing pieces
  const numPieces = 5; // Increase the number of pieces in the bank
  for (let i = 0; i < numPieces; i++) {
    const randomPiece = getRandomPiece();
    renderTetrisPiece(randomPiece.key, randomPiece.piece, tetrisBank);
  }
  updatePiecesOpacity();
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
  updatePiecesOpacity();
}

// Function to initialize drag-and-drop and touch events
function initDragAndDrop() {
  //const gridCells = document.querySelectorAll('.grid-cell');
  const tetrisPieces = document.querySelectorAll('.tetris-piece');

  tetrisPieces.forEach(piece => {
    piece.addEventListener('mousedown', dragStart);
    piece.addEventListener('touchstart', dragStart, { passive: false });
  });

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });

  //document.addEventListener('mouseup', dragEnd);
  //document.addEventListener('touchend', dragEnd);

  document.addEventListener('mouseup', drop);
  document.addEventListener('touchend', drop);

  /*
  gridCells.forEach(cell => {
    cell.addEventListener('mouseup', drop);
    cell.addEventListener('touchend', drop);
  });
  */
}

// Unified drag start event handler
function dragStart(e) {
  e.preventDefault();
  const pieceElement = e.target.closest('.tetris-piece');
  if (!pieceElement || pieceElement.classList.contains('unplaceable')) {
    return;
  }

  const shape = JSON.parse(pieceElement.dataset.shape);
  const rect = pieceElement.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  // Calculate the center of the piece
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const cellSize = rect.width / shape[0].length;
  const [activeRow, activeCol] = getActiveCell(shape, centerX, centerY, cellSize);

  // Create a new element for dragging
  draggedPiece = document.createElement('div');
  draggedPiece.className = 'dragged-piece';
  draggedPiece.style.position = 'fixed';
  draggedPiece.style.pointerEvents = 'none';
  draggedPiece.style.zIndex = '1000';
  draggedPiece.style.opacity = '0.8';
  
  // Set the size to match the game grid
  const gridCellSize = document.querySelector('.grid-cell').offsetWidth;
  draggedPiece.style.width = `${shape[0].length * gridCellSize}px`;
  draggedPiece.style.height = `${shape.length * gridCellSize}px`;
  
  // Create the shape inside the dragged piece
  const pieceGrid = document.createElement('div');
  pieceGrid.style.display = 'grid';
  pieceGrid.style.width = '100%';
  pieceGrid.style.height = '100%';
  pieceGrid.style.gridTemplateColumns = `repeat(${shape[0].length}, 1fr)`;
  pieceGrid.style.gridTemplateRows = `repeat(${shape.length}, 1fr)`;
  
  const color = pieceElement.dataset.color;
  draggedPiece.dataset.color = color;
  console.log('b', color);
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.style.backgroundImage = cell ? 'url("/bubble.png")' : 'transparent';
      cellElement.style.backgroundSize = 'cover';
      console.log('a', color);
      const hueRotation = getHueRotationFromColor(color);
      cellElement.style.filter = `hue-rotate(${hueRotation}deg)`;
      pieceGrid.appendChild(cellElement);
    });
  });
  
  draggedPiece.appendChild(pieceGrid);
  document.body.appendChild(draggedPiece);

  updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, gridCellSize);

  draggedPiece.dataset.shape = JSON.stringify(shape);
  draggedPiece.dataset.activeRow = activeRow;
  draggedPiece.dataset.activeCol = activeCol;
  draggedPiece.dataset.originalId = pieceElement.id;
  draggedPiece.dataset.color = color;
  pieceElement.classList.add('dragging');
}

// Unified drag event handler
function drag(e) {
  e.preventDefault();
  if (draggedPiece) {
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const cellSize = document.querySelector('.grid-cell').offsetWidth;
    const activeRow = parseInt(draggedPiece.dataset.activeRow || 0);
    const activeCol = parseInt(draggedPiece.dataset.activeCol || 0);
    updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, cellSize);
    showPreview(clientX, clientY);
  }
}

/*
// Unified drop event handler
function drop(e) {
  e.preventDefault();
  console.log('drop')
  if (!draggedPiece) return;

  const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
  const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

  const pieceShape = JSON.parse(draggedPiece.dataset.shape);
  const pieceId = draggedPiece.dataset.originalId;
  const pieceType = pieceId.split('-')[1];
  const activeRow = parseInt(draggedPiece.dataset.activeRow);
  const activeCol = parseInt(draggedPiece.dataset.activeCol);

  const gridSize = 5;
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  const cellSize = (gridRect.width - 10) / gridSize; // Subtract padding

  // Check if the drop occurred within the grid container boundaries
  if (clientX < gridRect.left || clientX > gridRect.right ||
      clientY < gridRect.top || clientY > gridRect.bottom) {
        console.log('out of bounds')
    returnPieceToBank(pieceId);
    clearDraggedPiece();
    clearPreview();
    return;
  }

  console.log('in bounds')

  // Adjust the target calculation to consider the center of the piece
  const pieceWidth = draggedPiece.offsetWidth;
  const pieceHeight = draggedPiece.offsetHeight;
  const targetCol = Math.floor((clientX - gridRect.left - 5 - pieceWidth / 2) / cellSize);
  const targetRow = Math.floor((clientY - gridRect.top - 5 - pieceHeight / 2) / cellSize);
  const targetIndex = targetRow * gridSize + targetCol;

  if (canPlacePiece(pieceShape, targetIndex, gridSize)) {
    const color = draggedPiece.dataset.color;
    placePiece(pieceShape, targetIndex, gridSize, color);
    replaceUsedPiece(document.getElementById(pieceId));
  } else {
    returnPieceToBank(pieceId);
  }

  clearDraggedPiece();
  clearPreview();
}
  */

function drop(e) {
  e.preventDefault();
  console.log('drop')
  if (!draggedPiece) return;

  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  const cellSize = document.querySelector('.grid-cell').offsetWidth;
  const pieceId = draggedPiece.dataset.originalId;
  const pieceShape = JSON.parse(draggedPiece.dataset.shape);

  const gridSize = 5;
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();

  // Check if the drop occurred within the grid container boundaries
  if (clientX < gridRect.left || clientX > gridRect.right ||
      clientY < gridRect.top || clientY > gridRect.bottom) {
        console.log('out of bounds')
    returnPieceToBank(pieceId);
    clearDraggedPiece();
    clearPreview();
    return;
  }

  const pieceWidth = draggedPiece.offsetWidth;
  const pieceHeight = draggedPiece.offsetHeight;
  const targetCol = Math.floor((clientX - gridRect.left - 5 - pieceWidth / 2) / cellSize);
  const targetRow = Math.floor((clientY - gridRect.top - 5 - pieceHeight / 2) / cellSize);
  const targetIndex = targetRow * gridSize + targetCol;

  if (canPlacePiece(pieceShape, targetIndex, gridSize)) {
    const color = draggedPiece.dataset.color;
    placePiece(pieceShape, targetIndex, gridSize, color);
    replaceUsedPiece(document.getElementById(pieceId));
  } else {
    returnPieceToBank(pieceId);
  }

  clearDraggedPiece();
  clearPreview();
}

// Function to update the dragged piece position
function updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, cellSize) {
  if (draggedPiece) {
    const pieceWidth = draggedPiece.offsetWidth;
    const pieceHeight = draggedPiece.offsetHeight;
    const offsetX = pieceWidth / 2;
    const offsetY = pieceHeight / 2;
    draggedPiece.style.left = `${clientX - offsetX}px`;
    draggedPiece.style.top = `${clientY - offsetY}px`;
  }
}

// Function to show preview
function showPreview(clientX, clientY) {
  if (!draggedPiece) return;

  const shape = JSON.parse(draggedPiece.dataset.shape);
  const gridSize = 5;
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  const cellSize = (gridRect.width - 10) / gridSize; // Subtract padding
  
  const pieceWidth = draggedPiece.offsetWidth;
  const pieceHeight = draggedPiece.offsetHeight;

  // Adjust the target calculation to consider the center of the piece
  const targetCol = Math.floor((clientX - gridRect.left - 5 - pieceWidth / 2) / cellSize);
  const targetRow = Math.floor((clientY - gridRect.top - 5 - pieceHeight / 2) / cellSize);
  const targetIndex = targetRow * gridSize + targetCol;

  clearPreview();

  if (canPlacePiece(shape, targetIndex, gridSize)) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const cellIndex = (targetRow + row) * gridSize + (targetCol + col);
          const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
          if (cell) cell.classList.add('preview');
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

// Function to check if a piece can be placed
function canPlacePiece(pieceShape, targetIndex, gridSize) {
  const targetRow = Math.floor(targetIndex / gridSize);
  const targetCol = targetIndex % gridSize;

  for (let row = 0; row < pieceShape.length; row++) {
    for (let col = 0; col < pieceShape[row].length; col++) {
      if (pieceShape[row][col]) {
        const gridRow = targetRow + row;
        const gridCol = targetCol + col;
        if (gridRow >= gridSize || gridCol >= gridSize || gridRow < 0 || gridCol < 0) {
          return false;
        }
        const cellIndex = gridRow * gridSize + gridCol;
        const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
        if (!cell || cell.style.backgroundImage !== '') {
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
        if (cell) {
          cell.style.backgroundImage = 'url("/bubble.png")';
          cell.style.backgroundSize = 'cover';
          const hueRotation = getHueRotationFromColor(color);
          cell.style.filter = `hue-rotate(${hueRotation}deg)`;
          //cell.style.filter = color;
        }
      }
    }
  }

  checkAndClearLines(gridSize);
  updatePiecesOpacity();
}

// Function to check and clear completed rows and columns
function checkAndClearLines(gridSize) {
  let clearedRows = [];
  let clearedColumns = [];

  for (let i = 0; i < gridSize; i++) {
    if (isRowComplete(i, gridSize)) {
      clearedRows.push(i);
    }
    if (isColumnComplete(i, gridSize)) {
      clearedColumns.push(i);
    }
  }

  // Clear rows
  clearedRows.forEach(row => clearRow(row, gridSize));

  // Clear columns
  clearedColumns.forEach(col => clearColumn(col, gridSize));

  updateScore(clearedRows.length, clearedColumns.length);
  updatePiecesOpacity();
}

// Function to check if a row is complete
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

// Function to check if a column is complete
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

// Function to clear a completed row
function clearRow(row, gridSize) {
  for (let col = 0; col < gridSize; col++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundImage = '';
    cell.style.filter = '';
  }
}

// Function to clear a completed column
function clearColumn(col, gridSize) {
  for (let row = 0; row < gridSize; row++) {
    const cellIndex = row * gridSize + col;
    const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
    cell.style.backgroundImage = '';
    cell.style.filter = '';
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
    cell.style.backgroundImage = '';
    cell.style.filter = '';
    cell.classList.remove('preview');
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

  // Clear dragged piece if it exists
  if (draggedPiece) {
    draggedPiece.remove();
    draggedPiece = null;
  }

  // Reset opacity of all pieces in the bank
  const bankPieces = document.querySelectorAll('.tetris-piece');
  bankPieces.forEach(piece => {
    piece.style.opacity = '1';
  });

  // Clear any ongoing drag operation
  if (document.draggedPiece) {
    document.draggedPiece = null;
  }

  renderTetrisPieces();
  updatePiecesOpacity();
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
  resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    resetGame();
    // Cancel any ongoing drag operation
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'none';
      e.dataTransfer.effectAllowed = 'none';
    }
  });
}

// Add a new dragEnd function
function dragEnd(e) {
  clearDraggedPiece();
  clearPreview();
}

// Add a new clearDraggedPiece function
function clearDraggedPiece() {
  if (draggedPiece) {
    draggedPiece.remove();
    draggedPiece = null;
  }
  // Remove the dragging class from all pieces in the bank
  const bankPieces = document.querySelectorAll('.tetris-piece');
  bankPieces.forEach(piece => {
    piece.classList.remove('dragging');
  });
}

// Add this function to check if a piece can be placed anywhere on the grid
function canPieceBePlacedAnywhere(shape) {
  const gridSize = 5;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      if (canPlacePiece(shape, index, gridSize)) {
        return true;
      }
    }
  }
  return false;
}

// Add this function to update the opacity of all pieces in the bank
function updatePiecesOpacity() {
  const bankPieces = document.querySelectorAll('.tetris-piece');
  bankPieces.forEach(piece => {
    const shape = JSON.parse(piece.dataset.shape);
    const canBePlaced = canPieceBePlacedAnywhere(shape);
    piece.classList.toggle('unplaceable', !canBePlaced);
    piece.draggable = canBePlaced;
  });
}

// Add a new function to return the piece to the bank
function returnPieceToBank(pieceId) {
  const originalPiece = document.getElementById(pieceId);
  if (originalPiece) {
    originalPiece.classList.remove('dragging');
  }
}

// Function to get the active cell based on mouse position
function getActiveCell(shape, offsetX, offsetY, cellSize) {
  const row = Math.floor(offsetY / cellSize);
  const col = Math.floor(offsetX / cellSize);
  
  if (shape[row] && shape[row][col]) {
    return [row, col];
  }
  
  // If the clicked cell is not active, find the nearest active cell
  const rows = shape.length;
  const cols = shape[0].length;
  let minDistance = Infinity;
  let nearestActiveCell = [0, 0];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c]) {
        const distance = Math.sqrt(Math.pow(r - row, 2) + Math.pow(c - col, 2));
        if (distance < minDistance) {
          minDistance = distance;
          nearestActiveCell = [r, c];
        }
      }
    }
  }

  return nearestActiveCell;
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

