function nextState(current, count) {
  switch (count) {
    // Try these values:
    case 0: return /*(*/current/*)*/;  // 0
    case 1: return /*(*/current/*)*/;  // 0
    case 2: return /*(*/0/*)*/;  // current
    case 3: return /*(*/0/*)*/;  // 1
    case 4: return /*(*/1/*)*/;  // 0
    case 5: return /*(*/1/*)*/;  // 0
    case 6: return /*(*/1/*)*/;  // 0
    case 7: return /*(*/0/*)*/;  // 0
    case 8: return /*(*/0/*)*/;  // 0
  }
}


function main() {
  const canvas = makeCanvas();
  render(canvas);
}

function render(canvas) {
  const ctx = canvas.getContext('2d');

  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const newData = new Uint8ClampedArray(4 * canvas.width * canvas.height);
  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      let count = 0;
      for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          count += Math.round(
            pixelData.data[
            (x + dx) * 4 +
            (y + dy) * 4 * canvas.width] / 255)
        }
      }
      const i = x * 4 + y * 4 * canvas.width;
      const state = Math.round(pixelData.data[i] / 255);
      const next = nextState(state, count);
      newData[i + 0] = next * 255;
      newData[i + 1] = next * 255;
      newData[i + 2] = next * 255;
      newData[i + 3] = 255;
    }
  }
  const imageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  setTimeout(() => { render(canvas); }, /*(*/200/*)*/);
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  const canvas = document.createElement('canvas');
  canvas.width = /*(*/10/*)*/;
  canvas.height = /*(*/10/*)*/;
  canvas.style.setProperty('image-rendering', 'pixelated');
  canvas.style.setProperty('width', '400px');
  canvas.style.setProperty('height', '400px');
  body.appendChild(canvas);

  const pixelData = new Uint8ClampedArray(4 * canvas.width * canvas.height);
  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const i = 4 * x + 4 * canvas.width * y;

      const intensity = Math.random() > 0.5 ? 1.0 : 0.0;
      pixelData[i + 0] = 255 * intensity;
      pixelData[i + 1] = 255 * intensity;
      pixelData[i + 2] = 255 * intensity;
      pixelData[i + 3] = 255;
    }
  }
  const imageData = new ImageData(pixelData, canvas.width, canvas.height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}


