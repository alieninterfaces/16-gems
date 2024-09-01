import { getActiveCell, calculateTargetPosition } from './utils.js';
import { GRID_SIZE, VERTICAL_DRAG_OFFSET, BUBBLE_IMAGE_URL } from './constants.js';
import { canPlacePiece, placePiece } from './gameLogic.js';
import { replaceUsedPiece } from './pieces.js';
import { getHueRotationFromColor } from './utils.js';
import { updatePiecesOpacity } from './gameBoard.js';
import { updateDropRegions } from './webgpu/webgpu.js';

let draggedPiece = null;
let lastTouchX = 0;
let lastTouchY = 0;
let currentShape = null;

export function initDragAndDrop() {
  // Remove previous event listeners to avoid duplicates
  document.removeEventListener('mousedown', dragStart);
  document.removeEventListener('touchstart', dragStart);
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', drop);
  document.removeEventListener('touchend', drop);

  // Add new event listeners
  document.addEventListener('mousedown', dragStart);
  document.addEventListener('touchstart', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', drop);
  document.addEventListener('touchend', drop);
}

function dragStart(e) {
  const pieceElement = e.target.closest('.tetris-piece');
  if (!pieceElement || pieceElement.classList.contains('unplaceable')) {
    return;
  }

  e.preventDefault();

  const shape = JSON.parse(pieceElement.dataset.shape);
  const rect = pieceElement.getBoundingClientRect();
  let clientX = e.clientX || e.touches[0].clientX;
  let clientY = e.clientY || e.touches[0].clientY;
  clientY -= VERTICAL_DRAG_OFFSET;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const cellSize = rect.width / shape[0].length;
  const [activeRow, activeCol] = getActiveCell(shape, centerX, centerY, cellSize);

  draggedPiece = createDraggedPieceElement(shape, pieceElement.dataset.color, activeRow, activeCol, pieceElement.id);
  document.body.appendChild(draggedPiece);

  updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, cellSize);

  // Update WebGPU drop regions
  currentShape = JSON.parse(draggedPiece.dataset.shape);
  updateDropRegionsForShape(currentShape);
}

function drag(e) {
  if (!draggedPiece) return;
  e.preventDefault();

  let clientX = e.clientX || e.touches[0].clientX;
  let clientY = e.clientY || e.touches[0].clientY;
  clientY -= VERTICAL_DRAG_OFFSET;
  lastTouchX = clientX;
  lastTouchY = clientY;
  const cellSize = document.querySelector('.grid-cell').offsetWidth;
  const activeRow = parseInt(draggedPiece.dataset.activeRow || 0);
  const activeCol = parseInt(draggedPiece.dataset.activeCol || 0);
  updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, cellSize);
  
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  const { targetCol, targetRow } = calculateTargetPosition(clientX, clientY, gridRect, activeRow, activeCol);

  showPreview(clientX, clientY);

  // Only update drop regions if the shape has changed
  const newShape = JSON.parse(draggedPiece.dataset.shape);
  if (JSON.stringify(newShape) !== JSON.stringify(currentShape)) {
    currentShape = newShape;
    updateDropRegionsForShape(currentShape);
  }
}

function drop(e) {
  if (!draggedPiece) return;
  if (e.target.nodeName === 'BUTTON') return;
  e.preventDefault();

  let clientX = lastTouchX || e.clientX || e.changedTouches[0].clientX;
  let clientY = lastTouchY || e.clientY || e.changedTouches[0].clientY;
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  const pieceId = draggedPiece.dataset.originalId;
  const pieceShape = JSON.parse(draggedPiece.dataset.shape);
  const activeRow = parseInt(draggedPiece.dataset.activeRow);
  const activeCol = parseInt(draggedPiece.dataset.activeCol);

  lastTouchX = null;
  lastTouchY = null;

  if (clientX < gridRect.left || clientX > gridRect.right ||
      clientY < gridRect.top || clientY > gridRect.bottom) {
    returnPieceToBank(pieceId);
    clearDraggedPiece();
    clearPreview();
    updateDropRegions([]); // Clear WebGPU drop regions
    return;
  }

  const { targetIndex } = calculateTargetPosition(clientX, clientY, gridRect, activeRow, activeCol);

  if (canPlacePiece(pieceShape, targetIndex)) {
    const color = draggedPiece.dataset.color;
    placePiece(pieceShape, targetIndex, color);
    replaceUsedPiece(document.getElementById(pieceId));
    updatePiecesOpacity();
  } else {
    returnPieceToBank(pieceId);
  }

  clearDraggedPiece();
  clearPreview();
  updateDropRegions([]); // Clear WebGPU drop regions
  currentShape = null;
}

function createDraggedPieceElement(shape, color, activeRow, activeCol, originalId) {
  const draggedPiece = document.createElement('div');
  draggedPiece.className = 'dragged-piece';
  draggedPiece.style.position = 'fixed';
  draggedPiece.style.pointerEvents = 'none';
  draggedPiece.style.zIndex = '1000';
  draggedPiece.style.opacity = '0.8';
  
  const gridCellSize = document.querySelector('.grid-cell').offsetWidth;
  draggedPiece.style.width = `${shape[0].length * gridCellSize}px`;
  draggedPiece.style.height = `${shape.length * gridCellSize}px`;
  
  const pieceGrid = createPieceGrid(shape, color);
  draggedPiece.appendChild(pieceGrid);

  draggedPiece.dataset.shape = JSON.stringify(shape);
  draggedPiece.dataset.activeRow = activeRow;
  draggedPiece.dataset.activeCol = activeCol;
  draggedPiece.dataset.originalId = originalId;
  draggedPiece.dataset.color = color;

  return draggedPiece;
}

function createPieceGrid(shape, color) {
  const pieceGrid = document.createElement('div');
  pieceGrid.style.display = 'grid';
  pieceGrid.style.width = '100%';
  pieceGrid.style.height = '100%';
  pieceGrid.style.gridTemplateColumns = `repeat(${shape[0].length}, 1fr)`;
  pieceGrid.style.gridTemplateRows = `repeat(${shape.length}, 1fr)`;
  
  shape.forEach(row => {
    row.forEach(cell => {
      const cellElement = document.createElement('div');
      cellElement.style.backgroundImage = cell ? `url("${BUBBLE_IMAGE_URL}")` : 'none';
      cellElement.style.backgroundSize = 'cover';
      const hueRotation = getHueRotationFromColor(color);
      cellElement.style.filter = `hue-rotate(${hueRotation}deg)`;
      pieceGrid.appendChild(cellElement);
    });
  });

  return pieceGrid;
}

function updateDraggedPiecePosition(clientX, clientY, activeRow, activeCol, cellSize) {
  if (draggedPiece) {
    const shape = JSON.parse(draggedPiece.dataset.shape);
    const pieceWidth = shape[0].length * cellSize;
    const pieceHeight = shape.length * cellSize;

    // Calculate the offset to align the active cell with the cursor
    const offsetX = (activeCol + 0.5) * cellSize;
    const offsetY = (activeRow + 0.5) * cellSize;
    
    // Update the position of the dragged piece
    draggedPiece.style.left = `${clientX - offsetX}px`;
    draggedPiece.style.top = `${clientY - offsetY}px`;
  }
}

function showPreview(clientX, clientY) {
  if (!draggedPiece) return;

  const shape = JSON.parse(draggedPiece.dataset.shape);
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  
  const activeRow = parseInt(draggedPiece.dataset.activeRow);
  const activeCol = parseInt(draggedPiece.dataset.activeCol);

  const { targetCol, targetRow, targetIndex } = calculateTargetPosition(clientX, clientY, gridRect, activeRow, activeCol);

  clearPreview();

  if (canPlacePiece(shape, targetIndex)) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const cellIndex = (targetRow + row) * GRID_SIZE + (targetCol + col);
          const cell = document.querySelector(`.grid-cell[data-index="${cellIndex}"]`);
          if (cell) cell.classList.add('preview');
        }
      }
    }
  }
}

function clearPreview() {
  document.querySelectorAll('.grid-cell.preview').forEach(cell => {
    cell.classList.remove('preview');
  });
}

function clearDraggedPiece() {
  if (draggedPiece) {
    draggedPiece.remove();
    draggedPiece = null;
  }
}

function returnPieceToBank(pieceId) {
  const originalPiece = document.getElementById(pieceId);
  if (originalPiece) {
    originalPiece.classList.remove('dragging');
  }
}

function getValidDropRegions(shape) {
  const validRegions = [];
  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;

  for (let row = 0; row <= GRID_SIZE - shapeHeight; row++) {
    for (let col = 0; col <= GRID_SIZE - shapeWidth; col++) {
      const index = row * GRID_SIZE + col;
      if (canPlacePiece(shape, index)) {
        validRegions.push({ row, col });
      }
    }
  }
  return validRegions;
}

function mapDropRegionsToWebGPU(dropRegions, webgpuRect, gridRect) {
  const mappedDropRegions = [];
  const cellSize = gridRect.width / GRID_SIZE;
  const scaleX = webgpuRect.width / gridRect.width;
  const scaleY = webgpuRect.height / gridRect.height;
  const offsetX = (gridRect.left - webgpuRect.left) / cellSize;
  const offsetY = (gridRect.top - webgpuRect.top) / cellSize;

  for (const { row, col } of dropRegions) {
    const mappedX = (col + offsetX) * scaleX;
    const mappedY = (row + offsetY) * scaleY;
    mappedDropRegions.push({ x: mappedX, y: mappedY });
  }

  return mappedDropRegions;
}

function updateDropRegionsForShape(shape) {
  const dropRegions = getValidDropRegions(shape);
  console.log('Valid drop regions:', dropRegions);
  
  const gridContainer = document.getElementById('game-grid-container');
  const gridRect = gridContainer.getBoundingClientRect();
  const webgpuCanvas = document.getElementById('webgpu-canvas');
  const webgpuRect = webgpuCanvas.getBoundingClientRect();
  
  const mappedDropRegions = mapDropRegionsToWebGPU(dropRegions, webgpuRect, gridRect);
  console.log('Mapped drop regions:', mappedDropRegions);
  
  updateDropRegions(mappedDropRegions);
}

// Export necessary functions
export { dragStart, drag, drop, clearPreview };
