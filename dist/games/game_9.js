var kEmpty = 0;
var kHuman = 1;
var kZombie = 2;
var kCure = 3;
var kWall = 4;

var state = null;

function updateState(canvas) {
  for (let i = 0; i < state.length; ++i) {
    const current = state[i];
    if (current === kEmpty) {
      continue;
    }
    const dx = Math.trunc(Math.random() * 3) - 1;
    const dy = Math.trunc(Math.random() * 3) - 1;
    if (dx !== 0 || dy !== 0) {
      const j = i + dx + dy * canvas.width;
      const other = state[j];
      if (current === kZombie && Math.random() < 0.8) {
        continue;
      }
      if (current === kHuman) {
        if (other === kEmpty) {
          state[j] = kHuman;
          state[i] = kEmpty;
        }
        if (other === kZombie) {
          state[i] = kZombie;
        }
      }
      if (current === kZombie) {
        if (other === kEmpty) {
          state[j] = kZombie;
          state[i] = kEmpty;
        }
        if (other === kCure) {
          state[j] = kHuman;
          state[i] = kEmpty;
        }
        if (other === kZombie) {
          state[i] = kZombie;
        }
      }
    }
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
      const i = x * 4 + y * 4 * canvas.width;
      switch (state[x + y * canvas.width]) {
        case kEmpty:
          newData[i + 0] = 0;
          newData[i + 1] = 0;
          newData[i + 2] = 0;
          newData[i + 3] = 255;
          break;
        case kHuman:
          newData[i + 0] = 255;
          newData[i + 1] = 200;
          newData[i + 2] = 128;
          newData[i + 3] = 255;
          break;
        case kCure:
          newData[i + 0] = 255;
          newData[i + 1] = 255;
          newData[i + 2] = 0;
          newData[i + 3] = 255;
          break;
        case kZombie:
          newData[i + 0] = 255;
          newData[i + 1] = 64;
          newData[i + 2] = 64;
          newData[i + 3] = 255;
          break;
        case kWall:
          newData[i + 0] = 0;
          newData[i + 1] = 0;
          newData[i + 2] = 64;
          newData[i + 3] = 255;
          break;
      }
    }
  }
  updateState(canvas);
  const imageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  setTimeout(() => { render(canvas); }, /*(*/100/*)*/);
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  const canvas = document.createElement('canvas');
  canvas.width = /*(*/200/*)*/;
  canvas.height = /*(*/200/*)*/;
  canvas.style.setProperty('image-rendering', 'pixelated');
  canvas.style.setProperty('width', '100vw');
  canvas.style.setProperty('height', '100vw');
  body.appendChild(canvas);

  state = new Int16Array(canvas.width * canvas.height);
  for (let i = 0; i < state.length; ++i) {
    let r = Math.random();
    if (r < 0.05) {
      state[i] = kHuman;
    } else if (r < 0.051) {
      state[i] = kZombie;
    } else if (r < 0.06) {
      state[i] = kCure;
    }
  }

  return canvas;
}
