import { GRID_SIZE } from '../constants.js';

export async function initWebGPU(canvas) {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported on this browser.');
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();

  const pipeline = await createPipeline(device, format);

  context.configure({
    device,
    format,
    alphaMode: 'opaque',
  });

  return { device, context, format, pipeline };
}

async function createPipeline(device, format) {
  const vertexShaderModule = device.createShaderModule({
    code: await fetch('webgpu/vertex.wgsl').then(response => response.text()),
  });

  const fragmentShaderModule = device.createShaderModule({
    code: await fetch('webgpu/fragment.wgsl').then(response => response.text()),
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
      device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: 'uniform' },
          },
        ],
      }),
    ],
  });

  return device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: vertexShaderModule,
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: 3 * Float32Array.BYTES_PER_ELEMENT,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x3',
            },
          ],
        },
        {
          arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
          stepMode: 'instance',
          attributes: [
            {
              shaderLocation: 1,
              offset: 0,
              format: 'float32x4',
            },
            {
              shaderLocation: 2,
              offset: 4 * Float32Array.BYTES_PER_ELEMENT,
              format: 'float32x4',
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentShaderModule,
      entryPoint: 'main',
      targets: [{ format }],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });
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

  // Create instance buffer for colors and border colors
  const instanceData = new Float32Array(GRID_SIZE * GRID_SIZE * 8); // 4 for fill color, 4 for border color
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const offset = i * 8;
    // Fill color (white for all squares)
    instanceData.set([1.0, 1.0, 1.0, 1.0], offset);
    
    // Border color (blue for even squares, black for odd squares)
    if (i % 2 === 0) {
      instanceData.set([0.0, 0.0, 1.0, 1.0], offset + 4); // Blue
    } else {
      instanceData.set([0.0, 0.0, 0.0, 1.0], offset + 4); // Black
    }
  }

  const instanceBuffer = device.createBuffer({
    size: instanceData.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(instanceBuffer.getMappedRange()).set(instanceData);
  instanceBuffer.unmap();

  const borderColorBuffer = device.createBuffer({
    size: 4 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Set initial border color to blue
  const borderColor = new Float32Array([0.0, 0.0, 1.0, 1.0]); // RGBA
  device.queue.writeBuffer(borderColorBuffer, 0, borderColor);

  return { vertexBuffer, instanceBuffer, borderColorBuffer };
}

export function render(device, context, vertexBuffer, instanceBuffer, borderColorBuffer, pipeline) {
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
  passEncoder.setVertexBuffer(1, instanceBuffer);
  passEncoder.setBindGroup(0, createBindGroup(device, pipeline, borderColorBuffer));
  passEncoder.draw(6, GRID_SIZE * GRID_SIZE, 0, 0); // Draw the entire grid
  passEncoder.end(); // Use end() instead of endPass()

  device.queue.submit([commandEncoder.finish()]);
}

function createBindGroup(device, pipeline, borderColorBuffer) {
  return device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: borderColorBuffer,
        },
      },
    ],
  });
}

export function startRenderLoop(device, context, vertexBuffer, instanceBuffer, borderColorBuffer, pipeline) {
  function frame() {
    render(device, context, vertexBuffer, instanceBuffer, borderColorBuffer, pipeline);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}