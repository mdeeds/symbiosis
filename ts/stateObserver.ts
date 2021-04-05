import { EditManager } from "./editManager";
import { GameFrame } from "./gameFrame";
import { Edit } from "./levenshtein";
import { PeerConnection } from "./peerConnection";
import { PeerGroup } from "./peerGroup";

export class StateObserver {
  private peerGroup: PeerGroup;
  private gameFrame: GameFrame;
  private editManager: EditManager;

  private codeMap: Map<string, string>;
  private id: string;

  constructor(peerGroup: PeerGroup, editManager: EditManager) {
    this.peerGroup = peerGroup;
    this.gameFrame = new GameFrame();
    this.editManager = editManager;
    // peerGroup.getConnection().waitReady().then((connection) => {
    //   this.initialize(connection);
    // })
  }

  initialize(connection: PeerConnection) {
    //   this.id = connection.id();
    //   this.codeMap = new Map<string, string>();

    //   const restartButton = document.createElement('div');
    //   restartButton.innerText = "Restart";
    //   restartButton.id = "Restart";
    //   const body = document.getElementsByTagName('body')[0];
    //   body.appendChild(restartButton);
    //   restartButton.addEventListener('click', (ev) => {
    //     this.sendCode();
    //   });

    //   this.getConnection().addCallback("edit: ",
    //     (serialized: string) => {
    //       const edits: Edit<string>[] = JSON.parse(serialized);
    //       this.editManager.applyEdits(edits);
    //     });
  }

  // getConnection() {
  //   return this.peerGroup.getConnection();
  // }

  // addMeetCallback(callback: Function) {
  //   this.peerGroup.addMeetCallback(callback);
  // }

  sendEdits(edits: Edit<string>[]) {
    const message = `edit: ${JSON.stringify(edits)}`;
    this.peerGroup.broadcast(message);
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