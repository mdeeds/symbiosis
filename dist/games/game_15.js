var canvas = document.createElement('canvas');
canvas.width = /*(*/800/*)*/;
canvas.height = /*(*/800/*)*/;
canvas.tabIndex = 1;
var ctx = canvas.getContext('2d');

function render(bodies, player, keySet) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '/*(*/purple/*)*/';
  for (const b of bodies) {
    ctx.beginPath();
    ctx.arc(b.p.x, b.p.y, 5, -Math.PI, Math.PI);
    ctx.fill();
    b.setA(new V2(0, 0));
  }

  ctx.fillStyle = '/*(*/green/*)*/';
  {
    ctx.beginPath();
    ctx.arc(player.p.x, player.p.y, 7, -Math.PI, Math.PI);
    ctx.fill();
    player.setA(new V2(0, 0));
    const thrust = /*(*/0.1/*)*/;
    if (keySet.has('ArrowRight')) {
      player.setA(player.a.add(new V2(thrust, 0)));
    }
    if (keySet.has('ArrowLeft')) {
      player.setA(player.a.add(new V2(-thrust, 0)));
    }
    if (keySet.has('ArrowUp')) {
      player.setA(player.a.add(new V2(0, -thrust)));
    }
    if (keySet.has('ArrowDown')) {
      player.setA(player.a.add(new V2(0, thrust)));
    }
  }

  let center = new V2(0, 0);

  for (const b1 of bodies) {
    for (const b2 of bodies) {
      if (b1 === b2) {
        continue;
      }
      const rv = b2.p.sub(b1.p);
      const r2 = rv.len2();
      if (r2 < 100) {
        continue;
      }
      const rn = rv.norm();
      const f = rn.scale(100 / r2);
      // console.log(JSON.stringify(f));
      b1.setA(b1.a.add(f));
    }
    center = center.add(b1.p);
    //console.log(JSON.stringify(b1.a));
  }
  center = center.scale(1 / bodies.length);
  center = center.sub(new V2(canvas.width / 2, canvas.height / 2));

  for (const b of bodies) {
    b.p = b.p.sub(center);
    b.update();
  }

  requestAnimationFrame(() => { render(bodies, player, keySet); });
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

  let bodies = [];
  bodies.push(new Body(200, 200, 0, 0));
  bodies.push(new Body(/*(*/100, 200, 0, -1/*)*/));
  bodies.push(new Body(/*(*/300, 200, 0, 1/*)*/));

  for (let i = 0; i < /*(*/1/*)*/; ++i) {
    bodies.push(new Body(Math.random() * 1000, Math.random() * 1000,
      Math.random() - 0.5, Math.random() - 0.5));
  }

  let player = new Body(/*(*/500, 500, -0.5, 0/*)*/);
  bodies.push(player);

  render(bodies, player, keySet);

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
}
