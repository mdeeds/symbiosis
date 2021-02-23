// Click to launch the ball.

var x = 0;
var y = 0;
var xv = 0;
var yv = 0;

function launch(ev) {
  x = 0;
  y = 0;
  xv = ev.offsetX / /*(*/30/*)*/;
  yv = (canvas.height - ev.offsetY) / /*(*/30/*)*/;
}

function applyPhysics() {
  x += xv;
  y += yv;
  yv -= /*(*/1.0/*)*/;  // Gravity
}

function hitBottom() {
  // TODO: Make it bounce when you hit the bottom.
  /*(*/
  /*)*/
}

function hitSide() {
  // TODO: Make it bounce when you hit the bottom.
  /*(*/
  /*)*/
}


function renderLoop() {
  const ctx = canvas.getContext('2d');
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(50, canvas.height - 50);
  ctx.scale(1, -1);

  ctx.fillStyle = /*(*/'black'/*)*/;
  ctx.beginPath();
  ctx.arc(x, y,
    /*(*/5/*)*/,  // radius
    -Math.PI, Math.PI);
  ctx.fill();
  if (y <= 0) {
    hitBottom();
  } if (x < -50 || x > canvas.width - 50) {
    hitSide();
  }
  applyPhysics();
  requestAnimationFrame(renderLoop)
}

var canvas = null;
var fillStyle = 'black';

function main() {
  makeCanvas();
  renderLoop();
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  canvas = document.createElement('canvas');
  canvas.width = /*(*/800/*)*/;
  canvas.height = /*(*/600/*)*/;
  canvas.style.backgroundColor = /*(*/'lightblue'/*)*/;

  const ctx = canvas.getContext('2d');
  body.appendChild(canvas);
  canvas.addEventListener('click', (ev) => { launch(ev); });
}


