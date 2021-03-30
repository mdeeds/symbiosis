function step(f, t) {
  /*(*/
  f();
  t(-120);
  f();
  t(120);
  f();
  t(120);
  f();
  t(-120);
  f();
  /*)*/
}

function go(forward) {
  forward(/*(*/1/*)*/);
}


var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

function minOfArray(a) {
  let min = 0;
  for (let i = 0; i < a.length; ++i) {
    min = Math.min(min, a[i]);
  }
  return min;
}

function maxOfArray(a) {
  let max = 0;
  for (let i = 0; i < a.length; ++i) {
    max = Math.max(max, a[i]);
  }
  return max;
}

var maxSteps = /*(*/10/*)*/;

function main() {
  const body = document.getElementsByTagName('body')[0];
  canvas.width = /*(*/1000/*)*/;
  canvas.height = /*(*/1000/*)*/;
  canvas.style.width = '100vw';
  body.appendChild(canvas);

  const xs = [];
  const ys = [];

  let theta = 0.0;
  let x = 0.0;
  let y = 0.0;

  turn = (angle) => {
    theta += angle / 180 * Math.PI;
  }

  let stepCount = 0;

  forward = (steps) => {
    if (steps > maxSteps) {
      steps = maxSteps;
    }
    if (steps === 0) {
      x += Math.cos(theta) * 4;
      y += Math.sin(theta) * 4;
      xs.push(x);
      ys.push(y);
    } else {
      step(() => { ++stepCount; forward(steps - 1); }, turn);
    }
  }
  go(forward);

  const minX = minOfArray(xs);
  const minY = minOfArray(ys);
  const maxX = maxOfArray(xs);
  const maxY = maxOfArray(ys);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xScale = (0.8 * canvas.width) / (maxX - minX);
  const yScale = (0.8 * canvas.height) / (maxY - minY);
  const scale = Math.min(xScale, yScale);
  ctx.translate(0.1 * canvas.width, 0.1 * canvas.height);
  ctx.scale(scale, scale);
  ctx.translate(-minX, -minY);
  console.log(`Scale: ${scale}`);

  ctx.strokeStyle = '/*(*/black/*)*/';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let i = 0; i < xs.length; ++i) {
    ctx.lineTo(xs[i], ys[i]);
  }
  ctx.stroke();
}

