function render(canvas) {
  const ctx = canvas.getContext('2d');

  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const newData = new Uint8ClampedArray(4 * canvas.width * canvas.height);
  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const noise = /*(*/30/*)*/;
      const i = x * 4 + y * 4 * canvas.width;
      newData[i + 0] = pixelData.data[i + 0] + (Math.random() - 0.5) * noise;
      newData[i + 1] = pixelData.data[i + 0] + (Math.random() - 0.5) * noise;
      newData[i + 2] = pixelData.data[i + 0] + (Math.random() - 0.5) * noise;
      newData[i + 3] = 255;
    }
  }
  const imageData = new ImageData(newData, canvas.width, canvas.height);
  window.createImageBitmap(imageData).then((bitmap) => {
    ctx.resetTransform();
    const dx = canvas.width / 2 + /*(*/ 0 /*)*/;
    const dy = canvas.height / 2 + /*(*/ 0 /*)*/;
    ctx.translate(dx, dy);
    const xscale = Math.pow(1.001, /*(*/ 5 /*)*/);
    const yscale = /*(*/ xscale /*)*/;
    ctx.scale(xscale, yscale);
    ctx.rotate(/*(*/0.02/*)*/);
    ctx.translate(-dx, -dy);
    ctx.drawImage(bitmap, 0, 0);
    setTimeout(() => { render(canvas); }, /*(*/10/*)*/);
  })
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  const canvas = document.createElement('canvas');
  canvas.width = /*(*/100/*)*/;
  canvas.height = /*(*/100/*)*/;
  canvas.style.setProperty('image-rendering', 'pixelated');
  canvas.style.setProperty('width', '100vw');
  // canvas.style.setProperty('height', '100vw');
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

function main() {
  const canvas = makeCanvas();
  render(canvas);
}


