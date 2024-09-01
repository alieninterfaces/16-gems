struct Uniforms {
  borderColor : vec4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;

@fragment
fn main(
  @location(0) localPos : vec2<f32>,
  @location(1) @interpolate(flat) instanceIndex : u32,
  @location(2) @interpolate(flat) fillColor : vec4<f32>,
  @location(3) @interpolate(flat) borderColor : vec4<f32>
) -> @location(0) vec4<f32> {
  let borderWidth = 0.05;
  let isBorder = any(localPos < vec2<f32>(-0.5 + borderWidth)) || any(localPos > vec2<f32>(0.5 - borderWidth));
  let isOutside = instanceIndex >= 64u; // Assuming 8x8 grid
  let finalColor = select(
    select(fillColor, uniforms.borderColor, isOutside),
    borderColor,
    isBorder
  );
  return finalColor;
}