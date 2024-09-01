import { initGame } from './gameInit.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { handleResetGame } from './gameLogic.js';
import { initWebGPU, createBuffers, startRenderLoop } from './webgpu/webgpu.js';

async function startGame() {
  initGame();
  initDragAndDrop();

  const canvas = document.getElementById('webgpu-canvas');
  const { device, context, pipeline } = await initWebGPU(canvas);
  const { vertexBuffer, instanceBuffer, borderColorBuffer } = createBuffers(device);

  startRenderLoop(device, context, vertexBuffer, instanceBuffer, borderColorBuffer, pipeline);

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', handleResetGame);
}

document.addEventListener('DOMContentLoaded', startGame);
