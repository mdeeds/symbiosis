import { EditManager } from "./editManager";
import { PeerGroup } from "./peerGroup";
import { Shadow } from "./shadow";
import { ShadowObserver } from "./shadowObserver";
import { SharedTextArea } from "./sharedTextArea";
import { StateObserver } from "./stateObserver";

export class Tab {
  private tabId: string;
  private textArea: HTMLTextAreaElement;
  private stateObserver: StateObserver;
  private editManager: EditManager;
  private sharedTextArea: SharedTextArea;

  constructor(tabId: string, textArea: HTMLTextAreaElement,
    peerGroup: PeerGroup,
    shadowObserver: ShadowObserver) {
    console.assert(textArea, "Text area required.");
    this.tabId = tabId;
    this.textArea = textArea;
    this.editManager = new EditManager(textArea);
    this.stateObserver = new StateObserver(peerGroup, this.editManager);
    this.sharedTextArea = new SharedTextArea(
      tabId, this.stateObserver, shadowObserver, this.textArea);
  }

  getTabId() {
    return this.tabId;
  }

  activate() {
    console.log("Activate");
    this.textArea.hidden = false;
    this.sharedTextArea.show();
  }

  deactivate() {
    this.textArea.hidden = true;
    this.sharedTextArea.hide();
  }
}