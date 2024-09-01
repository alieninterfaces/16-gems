import { initGame } from './gameInit.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { handleResetGame } from './gameLogic.js';
import { initWebGPU, createBuffers, startRenderLoop } from './webgpu/webgpu.js';
import { loadShaderCode } from './webgpu/shaderLoader.js';

async function startGame() {
  initGame();
  initDragAndDrop();

  const canvas = document.getElementById('webgpu-canvas');
  const { device, context, format } = await initWebGPU(canvas);
  const { vertexBuffer, colorBuffer } = createBuffers(device);

  const vertexShaderCode = await loadShaderCode('webgpu/vertex.wgsl');
  const fragmentShaderCode = await loadShaderCode('webgpu/fragment.wgsl');

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({ code: vertexShaderCode }),
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 3 * 4,
          attributes: [{
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
          }],
        },
        {
          arrayStride: 3 * 4,
          attributes: [{
            shaderLocation: 1,
            offset: 0,
            format: 'float32x3',
          }],
        },
      ],
    },
    fragment: {
      module: device.createShaderModule({ code: fragmentShaderCode }),
      entryPoint: 'main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  startRenderLoop(device, context, vertexBuffer, colorBuffer, pipeline);

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', handleResetGame);
}

document.addEventListener('DOMContentLoaded', startGame);
