class Bee {
  constructor() {
    /*(*/
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    /*)*/
    this.xv = 0;
    this.yv = 0;
  }

  approach(x, y) {
    const damping = /*(*/0.999/*)*/;  // Keep this close to 1.0
    const excitement = /*(*/0.7/*)*/;

    let xa = (x - this.x) / 1000 + Math.random() * 0.01;
    let ya = (y - this.y) / 1000 + Math.random() * 0.01;;
    xa = Math.max(-excitement, Math.min(excitement, xa));
    ya = Math.max(-excitement, Math.min(excitement, ya));
    this.xv += xa;
    this.yv += ya;
    this.xv = damping * Math.max(-20, Math.min(20, this.xv));
    this.yv = damping * Math.max(-20, Math.min(20, this.yv));
  }

  move() {
    this.x += this.xv;
    this.y += this.yv;
    if (this.x < 0 || this.x > canvas.width) {
      /*(*/
      /*)*/
    }
    /*(*/
    if (this.x < 0 || this.x > canvas.width) {
    }
    /*)*/
  }
}

var mouseX = 0;
var mouseY = 0;

function chase(ev) {
  mouseX = ev.offsetX;
  mouseY = ev.offsetY;
}

var bees = [];

function renderLoop() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = /*(*/'black'/*)*/;

  for (const bee of bees) {
    ctx.beginPath();
    ctx.arc(bee.x, bee.y,
      /*(*/5/*)*/,  // radius
      -Math.PI, Math.PI);
    ctx.fill();
    bee.approach(mouseX, mouseY);
    bee.move();
  }
  requestAnimationFrame(renderLoop)
}

var canvas = null;
var fillStyle = 'black';

function restart() {
  bees = [];
  for (let i = 0; i < /*(*/100/*)*/; i = i + 1) {
    const bee = new Bee();
    bees.push(bee);
  }
}

function main() {
  makeCanvas();
  restart();
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
  canvas.addEventListener('click', (ev) => { restart(ev); });
  canvas.addEventListener('mousemove', (ev) => { chase(ev); });
}


