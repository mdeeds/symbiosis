import { PeerGroup } from "./peerGroup";
import { Shadow } from "./shadow";
import { ShadowPosition } from "./shadowPosition";

export class ShadowObserver {
  private peerGroup: PeerGroup;
  private shadows: Map<string, Shadow>;
  private id: string;

  constructor(peerGroup: PeerGroup) {
    this.peerGroup = peerGroup;
    this.shadows = new Map<string, Shadow>();

    this.setupCallbacks();
  }

  private async setupCallbacks() {
    this.id = await this.peerGroup.getId();
    const sp = new ShadowPosition();
    sp.ownerId = this.id;
    sp.hue = Math.random();
    const shadow = new Shadow(sp);
    console.log(`This id: ${this.id}`);
    this.shadows.set(this.id, shadow);

    // this.peerGroup.getConnection().addCallback("shadow: ",
    //   (serialized: string) => {
    //     console.log(`AAAAA Got: ${serialized}`);
    //     const sp = JSON.parse(serialized) as ShadowPosition;
    //     if (!this.shadows.has(sp.ownerId)) {
    //       const shadow = new Shadow(sp);
    //       this.shadows.set(sp.ownerId, shadow);
    //     } else {
    //       this.shadows.get(sp.ownerId).updatePosition(sp);
    //     }
    //   });
  }

  async getShadowLocalShadow() {
    this.id = await this.peerGroup.getId();
    return new Promise<Shadow>((resolve, reject) => {
      resolve(this.shadows.get(this.id));
    });
  }

  updateShadow(shadow: Shadow) {
    console.log(`AAAAA: send`);
    this.peerGroup.broadcast(
      `shadow: ${JSON.stringify(shadow.getPosition())}`);
    this.shadows.set(this.id, shadow);
    // TODO: Update shadow position in tab collection...
  }
}