import { GameFrame } from "./gameFrame";
import { HeartbeatGroup } from "./heartbeatGroup";

export class StateObserver {
  private heartbeatGroup: HeartbeatGroup;
  private gameFrame: GameFrame;

  private codeMap: Map<string, string>;

  constructor(heartbeatGroup: HeartbeatGroup, gameFrame: GameFrame) {
    this.heartbeatGroup = heartbeatGroup;
    this.gameFrame = gameFrame;
    this.codeMap = new Map<string, string>();

    const restartButton = document.createElement('div');
    restartButton.innerText = "Restart";
    restartButton.id = "Restart";
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(restartButton);
    restartButton.addEventListener('click', (ev) => {
      this.sendCode();
    })
  }

  getConnection() {
    return this.heartbeatGroup.getConnection();
  }

  addMeetCallback(callback: Function) {
    this.heartbeatGroup.addMeetCallback(callback);
  }

  broadcast(message: string) {
    this.heartbeatGroup.broadcast(message);
  }

  private sendCode() {
    let allCode: string = "";
    for (const code of this.codeMap.values()) {
      allCode = allCode + code;
    }
    this.gameFrame.setScript(allCode);
  }

  // TODO: Add "restart" button.
  setScript(tabId: string, code: string) {
    this.codeMap.set(tabId, code);
    this.sendCode();
  }

}