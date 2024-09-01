export async function loadShaderCode(url) {
  const response = await fetch(url);
  return response.text();
}