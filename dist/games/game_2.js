function draw(event) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = /*(*/'black'/*)*/;
  ctx.beginPath();
  ctx.arc(event.offsetX, event.offsetY,
    /*(*/5/*)*/,  // radius
    -Math.PI, Math.PI);
  ctx.fill();
}

var canvas = null;
var fillStyle = 'black';

function main() {
  makeCanvas();
  addButton('white').addEventListener('click', () => {
    fillStyle = 'white';
  });
  // TODO: Add more buttons.
  /*(*/
  /*)*/
}

function addButton(text) {
  const button = document.createElement('span');
  button.innerText = text;
  button.style.setProperty('background-color', 'gray');
  button.style.setProperty('border', 'outset 3px solid gray');
  button.style.setProperty('padding', '5px');
  button.style.setProperty('margin', '5px');
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(button);
  return button;
}

function makeCanvas() {
  const body = document.getElementsByTagName('body')[0];
  canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.backgroundColor = 'lightblue';
  body.appendChild(canvas);

  canvas.addEventListener('mousemove', (ev) => { draw(ev); });
}


