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
    // Vertex positions for a single triangle
    0.0,  0.5, 0.0,
   -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ]);

  const colors = new Float32Array([
    // Colors for each vertex
    1.0, 0.0, 0.0, // Red
    0.0, 1.0, 0.0, // Green
    0.0, 0.0, 1.0, // Blue
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  const colorBuffer = device.createBuffer({
    size: colors.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(colorBuffer.getMappedRange()).set(colors);
  colorBuffer.unmap();

  return { vertexBuffer, colorBuffer };
}

export function render(device, context, vertexBuffer, colorBuffer, pipeline) {
  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();

  const renderPassDescriptor = {
    colorAttachments: [{
      view: textureView,
      loadOp: 'clear', // Specify how the color attachment should be loaded
      clearValue: { r: 0, g: 0, b: 0, a: 1 }, // Clear to black
      storeOp: 'store',
    }],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.setVertexBuffer(1, colorBuffer);
  passEncoder.draw(3, 1, 0, 0); // Draw the triangle
  passEncoder.end(); // Use end() instead of endPass()

  device.queue.submit([commandEncoder.finish()]);
}

export function startRenderLoop(device, context, vertexBuffer, colorBuffer, pipeline) {
  function frame() {
    render(device, context, vertexBuffer, colorBuffer, pipeline);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}