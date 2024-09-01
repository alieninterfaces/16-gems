import { GRID_SIZE } from '../constants.js';

export async function initWebGPU(canvas) {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported on this browser.');
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format,
    alphaMode: 'opaque',
  });

  return { device, context, format };
}

export function createBuffers(device) {
  const vertices = new Float32Array([
    // Vertex positions for a single cell (two triangles)
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
    -0.5,  0.5, 0.0,
     0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
    -0.5,  0.5, 0.0,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  return { vertexBuffer };
}

export function render(device, context, vertexBuffer, pipeline) {
  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();

  const renderPassDescriptor = {
    colorAttachments: [{
      view: textureView,
      loadOp: 'clear', // Specify how the color attachment should be loaded
      clearValue: { r: 1, g: 1, b: 1, a: 1 }, // Clear to white
      storeOp: 'store',
    }],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(6, GRID_SIZE * GRID_SIZE, 0, 0); // Draw the entire grid
  passEncoder.end(); // Use end() instead of endPass()

  device.queue.submit([commandEncoder.finish()]);
}

export function startRenderLoop(device, context, vertexBuffer, pipeline) {
  function frame() {
    render(device, context, vertexBuffer, pipeline);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}