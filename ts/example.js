
var map = [
  " # # #",
  "  # # #         ###########",
  "                        **#",
  "      * * *              *#",
  "   ########               #                                # * #",
  "    *****         *       #     ###  ##      ****          # * #   *",
  "                *         #   *   *** ##     ****          # * #  *",
  "           ####           #            ##    ****          # * # *    *****",
  "  P                ##                   ##                 # * #*",
  "########################################################## ################",
];

var canvas = null;
var catImg = null;
var keys = new Set();

function main() {
  const body = document.getElementsByTagName('body')[0];
  canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 633;
  canvas.style.width = `100vw`;
  canvas.style.position = 'absolute';
  canvas.style.backgroundColor = 'lightblue';
  canvas.style.position = 'absolute';
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.tabIndex = 0;
  body.appendChild(canvas);

  catImg = document.createElement('img');
  catImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABMElEQVRYR+2WsRGDMAxFoWGMDJEqEzBQCjJDKDIQQ2QgmuREMGeErG+BDcldaGWsp/8lQVkYnqauXm3Xl9IrWkxLIV4WSnA/X4vb81FwCEoeiqH6ogAoAV2EAOiMBLhZAQ4gXejgXCxkFX/XpACSk8djILICEBCCgABOflR92/XDkaauFkc1CBUgNvlY6bEAmkK7KLAaAG035D1I7MJBq0vfZ2nD/SQATQRNwzgZaqMPQaeC1CyWSfC24DQRUXsgNYBlHUMFfIWs/YCqp/tmANrqXGkF3LTfAcBlTjWO0RY4b0M7YY38sY0482hLolCDIhUWTZIawgwg2WEdP/88BMi1hCRoCWb2MeJ7YA87FgB+9x4KcDl9/vFyP0EF/gBofFJZo05BqiTaPRPAXhVzmDfDUdtUisCduwAAAABJRU5ErkJggg==";

  renderLoop();
  canvas.addEventListener('keydown', (ev) => { keys.add(ev.code); });
  canvas.addEventListener('keyup', (ev) => { keys.delete(ev.code); });
}

var catX = null;
var catY = null;


var offset = 0;

function renderLoop() {
  const ctx = canvas.getContext("2d");
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(-offset, 0);
  ctx.imageSmoothingEnabled = false;

  let x = 0;
  let y = 0;
  const tileSize = 64;
  for (l of map) {
    let x = 0;
    for (c of l) {
      switch (c) {
        case "#":
          ctx.fillStyle = "brown";
          ctx.fillRect(x, y, tileSize, tileSize);
          break;
        case "*":
          ctx.fillStyle = "gold";
          ctx.fillRect(x + 8, y + 8, tileSize - 16, tileSize - 16);
          break;
        case "P":
          if (catX === null) {
            catX = x;
            catY = y;
          }
          break;
      }
      x += tileSize;
    }
    y += tileSize;
  }

  ctx.drawImage(catImg, catX, catY, tileSize, tileSize);

  const xv = Math.max(1, (catX - offset) / tileSize);
  if (keys.has('ArrowUp')) {
    catY -= 5;
  }
  if (keys.has('ArrowDown')) {
    catY += 5;
  }
  if (keys.has('ArrowLeft')) {
    catX -= 5 + xv;
  }
  if (keys.has('ArrowRight')) {
    catX += 5 + xv;
  }

  offset += xv;
  if (catX < offset) {
    catX = offset;
  }

  const i = Math.round(catX / tileSize);
  const j = Math.round(catY / tileSize);

  if (j < map.length && i < map[j].length) {
    const c = map[j][i];
    if (c == "*") {
      map[j] = map[j].substr(0, i) + " " + map[j].substr(i + 1);
    } if (c == "#") {
      catY += tileSize / 2;
    }
  }

  requestAnimationFrame(renderLoop);
}
