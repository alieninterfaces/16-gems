struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) localPos : vec2<f32>
};

@vertex
fn main(@location(0) position : vec3<f32>, @builtin(instance_index) instanceIndex : u32) -> VertexOutput {
  var output : VertexOutput;
  let gridSize = 8.0;
  let cellSize = 2.0 / gridSize;
  let cellPos = vec2<f32>(
    (f32(instanceIndex % u32(gridSize)) * cellSize) - 1.0 + cellSize / 2.0,
    (f32(instanceIndex / u32(gridSize)) * cellSize) - 1.0 + cellSize / 2.0
  );
  output.position = vec4<f32>(position.xy * cellSize + cellPos, position.z, 1.0);
  output.localPos = position.xy;
  return output;
}