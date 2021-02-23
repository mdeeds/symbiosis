function getIntensity(x, y) {
  let result = /*(*/x + y/*)*/;
  // Other functions to try:
  // x * y
  // 10 * x / y
  // 2 * x + y
  // x * x + y * y
  // 50 * Math.sin(x/10) + 50*Math.sin(y/10) + 100
  return result;
}

function getColor(intensity) {
  const c = Math.round(intensity) % 256;
  return [
    /*(*/c/*)*/, // Red
    /*(*/c/*)*/, // Green
    /*(*/c/*)*/]; // Blue
}

function main() {
  const canvas = makeCanvas();
  render(canvas);
}

function render(canvas) {
  const ctx = canvas.getContext('2d');

  const pixelData = new Uint8ClampedArray(4 * canvas.width * canvas.height);
  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const i = 4 * x + 4 * canvas.width * y;
      const intensity = getIntensity(x, y);
      const color = getColor(intensity);
      pixelData[i + 0] = color[0];
      pixelData[i + 1] = color[1];
      pixelData[i + 2] = color[2];
      pixelData[i + 3] = 255;
    }
  }
  const imageData = new ImageData(pixelData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  const canvas = document.createElement('canvas');
  canvas.width = /*(*/800/*)*/;
  canvas.height = /*(*/600/*)*/;
  body.appendChild(canvas);

  canvas.addEventListener('mousemove', (ev) => { draw(ev); });
  return canvas;
}


