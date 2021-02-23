import { HeartbeatGroup } from "./heartbeatGroup";
import { Shadow } from "./shadow";
import { ShadowPosition } from "./shadowPosition";

export class ShadowObserver {
  private heartbeatGroup: HeartbeatGroup;
  private shadows: Map<string, Shadow>;
  private id: string;

  constructor(heartbeatGroup: HeartbeatGroup) {
    this.heartbeatGroup = heartbeatGroup;
    this.shadows = new Map<string, Shadow>();

    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.heartbeatGroup.getConnection().waitReady().then(
      (conn) => {
        this.id = conn.id();
        const sp = new ShadowPosition();
        sp.ownerId = this.id;
        sp.hue = Math.random();
        const shadow = new Shadow(sp);
        console.log(`This id: ${this.id}`);
        this.shadows.set(this.id, shadow);
      });
    this.heartbeatGroup.getConnection().addCallback("shadow: ",
      (serialized: string) => {
        const sp = JSON.parse(serialized) as ShadowPosition;
        if (!this.shadows.has(sp.ownerId)) {
          const shadow = new Shadow(sp);
          this.shadows.set(sp.ownerId, shadow);
        } else {
          this.shadows.get(sp.ownerId).updatePosition(sp);
        }
      });
  }

  getShadowLocalShadow() {
    return new Promise<Shadow>((resolve, reject) => {
      this.heartbeatGroup.getConnection().waitReady().then(
        (conn) => {
          this.id = conn.id();
          resolve(this.shadows.get(this.id));
        });
    });
  }

  updateShadow(shadow: Shadow) {
    this.heartbeatGroup.broadcast(
      `shadow: ${JSON.stringify(shadow.getPosition())}`);
    this.shadows.set(this.id, shadow);
    // TODO: Update shadow position in tab collection...
  }
}