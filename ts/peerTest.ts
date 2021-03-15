import Peer, { DataConnection } from "peerjs";

async function t1() {
  const peer = new Peer();

  const p: Promise<string> = new Promise((resolve, reject) => {
    peer.on('open', (id: string) => {
      console.log(`Id A: ${id}`);
      console.log("Opened.");
      resolve(id);
    });
  });

  const id = await p;
  console.log(`Id B: ${id}`);
}

t1().then(() => { console.log("Done.") });