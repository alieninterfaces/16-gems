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
export function getActiveCell(shape, offsetX, offsetY, cellSize) {
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
  const targetCol = Math.floor((clientX - gridRect.left) / cellSize) - activeCol;
  const targetRow = Math.floor((clientY - gridRect.top) / cellSize) - activeRow;
  const targetIndex = targetRow * GRID_SIZE + targetCol;
  
  return { targetCol, targetRow, targetIndex };
}

// Add these functions to your utils.js file or create a new file for them

export function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}