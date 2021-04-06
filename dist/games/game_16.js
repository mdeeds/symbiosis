var canvas = document.createElement('canvas');
canvas.width = /*(*/800/*)*/;
canvas.height = /*(*/800/*)*/;
canvas.tabIndex = 1;
var ctx = canvas.getContext('2d');

var projectiles = [];

var angle = 0;
var thrust = 0;
var score = 0;

function render(player, target, keySet) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '/*(*/48/*)*/px sans';
  ctx.fillStyle = '/*(*/black/*)*/';
  ctx.fillText(score.toFixed(0), 20, 50);

  const playerSize = /*(*/5/*)*/;
  ctx.fillStyle = '/*(*/yellow/*)*/';
  ctx.beginPath();
  ctx.arc(player.x, player.y, playerSize, -Math.PI, Math.PI);
  ctx.fill();
  ctx.strokeStyle = '/*(*/red/*)*/';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(player.x, player.y, playerSize + thrust,
    angle - 0.4, angle + 0.4);
  ctx.stroke();

  for (let i = 36; i > 0; i -= 5) {
    ctx.fillStyle = i % 2 == 0 ? 'red' : 'white';
    ctx.beginPath();
    ctx.arc(target.x, target.y, i, -Math.PI, Math.PI);
    ctx.fill();
  }

  if (keySet.has('ArrowRight')) {
    angle += 0.03;
  }
  if (keySet.has('ArrowLeft')) {
    angle -= 0.03;
  }

  if (keySet.has(' ')) {
    /*(*/thrust += 0.2/*)*/;
  } else {
    if (thrust > 0) {
      const p = new Body(player.x, player.y,
        Math.cos(angle) * thrust, Math.sin(angle) * thrust);
      projectiles.push(p);
      p.setA(new V2(0, 0.1));
      score -= /*(*/10/*)*/;
      thrust = 0;
    }
  }

  for (const p of projectiles) {
    ctx.fillStyle = '/*(*/black/*)*/';
    ctx.beginPath();
    ctx.arc(p.p.x, p.p.y, 3, -Math.PI, Math.PI);
    ctx.fill();
    p.update();
    if (p.p.x > canvas.width) {
      p.v.x = -Math.abs(p.v.x);
    }
    if (p.p.x < 0) {
      p.v.x = Math.abs(p.v.x);
    }
    if (p.p.y > canvas.height) {
      p.v.y = -Math.abs(p.v.y);
    }
    const distance = target.sub(p.p).len();
    if (distance < 40) {
      score += /*(*/100/*)*/;
      reset(player, target);
    }
  }
  score -= /*(*/0.01/*)*/;
  if (score < 0) {
    score = 0;
  }
  requestAnimationFrame(() => { render(player, target, keySet); });
}

function reset(player, target) {
  player.x = Math.random() * canvas.width;
  player.y = Math.random() * canvas.height;

  target.x = Math.random() * canvas.width;
  target.y = Math.random() * canvas.height;

  projectiles = [];
}

function main() {
  var docBody = document.getElementsByTagName('body')[0];
  docBody.appendChild(canvas);

  let keySet = new Set();
  canvas.addEventListener('keydown', (ev) => {
    ev.preventDefault();
    keySet.add(ev.key);
  });
  canvas.addEventListener('keyup', (ev) => {
    ev.preventDefault();
    keySet.delete(ev.key);
  });

  let player = new V2(0, 0);
  let target = new V2(0, 0);
  reset(player, target);

  render(player, target, keySet);

}

class V2 {
  x = 0;
  y = 0;
  constructor(x, y) {
    if (arguments.length == 2) {
      this.x = x;
      this.y = y;
    }
  }
  add(other) {
    return new V2(this.x + other.x, this.y + other.y);
  }
  sub(other) {
    return new V2(this.x - other.x, this.y - other.y);
  }
  scale(a) {
    return new V2(a * this.x, a * this.y);
  }
  dot(other) {
    return (other.x * this.x) + (other.y * this.y);
  }
  len2() {
    return this.dot(this);
  }
  len() {
    return Math.sqrt(this.len2());
  }
  norm() {
    return this.scale(1 / this.len());
  }
}

class Body {
  p = new V2(0, 0);
  v = new V2(0, 0);
  a = new V2(0, 0);
  constructor(x, y, xv, yv) {
    this.p = new V2(x, y);
    this.v = new V2(xv, yv);
  }

  update() {
    this.p = this.p.add(this.v);
    this.v = this.v.add(this.a);
  }

  setA(a) {
    this.a = a;
  }

  setV(v) {
    this.v = v;
  }
}
