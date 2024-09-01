@fragment
fn main(@location(0) localPos : vec2<f32>) -> @location(0) vec4<f32> {
  let borderWidth = 0.05;
  let isBorder = any(localPos < vec2<f32>(-0.5 + borderWidth)) || any(localPos > vec2<f32>(0.5 - borderWidth));
  let color = select(vec4<f32>(1.0, 1.0, 1.0, 1.0), vec4<f32>(0.0, 0.0, 0.0, 1.0), isBorder);
  return color;
}