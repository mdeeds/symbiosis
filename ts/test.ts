import { PeerGroup } from "./peerGroup";

class Box {
  d: HTMLDivElement;
  constructor() {
    this.d = document.createElement('div');
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(this.d);
  }
  add(message: string, color: string) {
    const div = document.createElement('div');
    const s = window.performance.now() / 1000;
    div.innerText = `${s.toFixed(2)}: ${message}`;
    div.style.color = color;
    this.d.appendChild(div);
  }
}

export class Test {
  constructor() {
    this.start();
  }

  async start() {
    const box = new Box();
    box.add('Start 1', 'white');
    const pg1 = await PeerGroup.make(null,
      (ev: string, id: string, data: string) => {
        box.add(`${ev}@${id}: ${data}`, 'red');
      });
    const joinId = await pg1.getId();
    box.add(`Join id: ${joinId}`, 'white');

    const pg2 = await PeerGroup.make(joinId,
      (ev: string, id: string, data: string) => {
        box.add(`${ev}@${id}: ${data}`, 'green');
      });
    const id2 = await pg2.getId();
    box.add(`ID2: ${id2}`, 'white');

    const pg3 = await PeerGroup.make(joinId,
      (ev: string, id: string, data: string) => {
        box.add(`${ev}@${id}: ${data}`, 'blue');
      });
    const id3 = await pg3.getId();
    box.add(`ID2: ${id3}`, 'white');

    await new Promise((resolve, reject) => { setTimeout(resolve, 3000); });
    pg2.broadcast("Hello from green");
    pg1.broadcast("Hello from red");
    pg3.broadcast("Hello from blue");
  }
}