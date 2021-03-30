var maxIter = /*(*/200/*)*/;

function getColor(iter) {
  let v = /*(*/Math.sqrt(iter / maxIter)/*)*/;

  const r = 255 * (/*(*/v/*)*/);
  const g = 255 * (/*(*/Math.sin(12 * v)/*)*/);
  const b = 255 * (/*(*/1 - v/*)*/);
  const a = 255 * (/*(*/v / 2 + 0.5/*)*/);

  return [r, g, b, a];
}

// Mandelbrot Set
function step(x, y, x2, y2, x0, y0) {
  const yy = /*(*/2 * x * y + y0/*)*/;
  const xx = /*(*/x2 - y2 + x0/*)*/;
  return [xx, yy];
}

// "Burning Ship Fractal"
// function step(x, y, x2, y2, x0, y0) {
//   const yy = Math.abs(2 * x * y) + y0;
//   const xx = x2 - y2 + x0;
//   return [xx, yy];
// }

/*(*/
x0 = -2.5; x1 = 1.5; y0 = -2; y1 = 2;
/*)*/

function iterate(xx, yy) {
  // z = z^2 + c
  const x0 = xx;
  const y0 = yy;
  let x = x0;
  let y = y0;
  let iteration = 0;

  while (true) {
    let x2 = x * x;
    let y2 = y * y;
    let r2 = x2 + y2;
    if (r2 > 25) {
      return iteration;
    }

    [x, y] = step(x, y, x2, y2, x0, y0);

    ++iteration;
    if (iteration >= maxIter) {
      return iteration;
    }
  }
}

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');


var loc = document.createElement('div');

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dx = (x1 - x0) / canvas.width;
  const dy = (y1 - y0) / canvas.height;

  const p = new Uint8ClampedArray(4 * canvas.width * canvas.height);

  for (let i = 0; i < canvas.width; ++i) {
    for (let j = 0; j < canvas.height; ++j) {
      const x = x0 + i * dx;
      const y = y0 + j * dy;

      iters = iterate(x, y);
      const [r, g, b, a] = getColor(iters);

      const offset = 4 * i + 4 * canvas.width * j;
      p[offset + 0] = r;
      p[offset + 1] = g;
      p[offset + 2] = b;
      p[offset + 3] = a;
    }
  }

  const imageData = new ImageData(p, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  loc.innerText = `x0 = ${x0}; x1 = ${x1}; y0 = ${y0}; y1 = ${y1};`;
}

function main() {
  const body = document.getElementsByTagName('body')[0];
  canvas.width = /*(*/1000/*)*/;
  canvas.height = /*(*/1000/*)*/;
  body.appendChild(canvas);
  body.appendChild(loc);
  canvas.addEventListener('click', (ev) => {
    const w = (x1 - x0);
    const h = (y1 - y0);
    const x = w * (ev.offsetX / canvas.width) + x0;
    const y = h * (ev.offsetY / canvas.height) + y0;
    x0 = x - w / 4;
    x1 = x + w / 4;
    y0 = y - h / 4;
    y1 = y + h / 4;
    render();
  });

  render();
}

