export function rotateMatrix(matrix) {
  const N = matrix.length;
  const rotated = matrix[0].map((val, index) => 
    matrix.map(row => row[index]).reverse()
  );
  return rotated;
}

export function getHueRotationFromColor(color) {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hueRotation = Math.round(hsl[0] * 360);
  return hueRotation;
}

export function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function rgbToHsl(r, g, b) {
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

// Function to get the active cell based on mouse position
export function getActiveCell(shape, centerX, centerY, cellSize) {
  const rows = shape.length;
  const cols = shape[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (shape[row][col]) {
        const cellCenterX = (col + 0.5) * cellSize;
        const cellCenterY = (row + 0.5) * cellSize;

        if (Math.abs(cellCenterX - centerX) < cellSize / 2 &&
            Math.abs(cellCenterY - centerY) < cellSize / 2) {
          return [row, col];
        }
      }
    }
  }

  // If no active cell is found, return the center cell
  return [Math.floor(rows / 2), Math.floor(cols / 2)];
}

export function getGridCell(index) {
    return document.querySelector(`.grid-cell[data-index="${index}"]`);
  }
  
  export function setGridCellBackground(index, imageUrl, color) {
    const cell = getGridCell(index);
    if (cell) {
      cell.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : '';
      cell.style.backgroundSize = 'cover';
      if (color) {
        const hueRotation = getHueRotationFromColor(color);
        cell.style.filter = `hue-rotate(${hueRotation}deg)`;
      } else {
        cell.style.filter = '';
      }
    }
  }

import { GRID_SIZE } from './constants.js';

export function calculateTargetPosition(clientX, clientY, gridRect, activeRow, activeCol) {
  const cellSize = gridRect.width / GRID_SIZE;
  const gridX = clientX - gridRect.left;
  const gridY = clientY - gridRect.top;

  let targetCol = Math.floor(gridX / cellSize) - activeCol;
  let targetRow = Math.floor(gridY / cellSize) - activeRow;

  // Ensure the target position is within the grid boundaries
  targetCol = Math.max(0, Math.min(targetCol, GRID_SIZE - 1));
  targetRow = Math.max(0, Math.min(targetRow, GRID_SIZE - 1));

  const targetIndex = targetRow * GRID_SIZE + targetCol;

  return { targetCol, targetRow, targetIndex };
}