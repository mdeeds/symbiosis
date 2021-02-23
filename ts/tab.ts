import { EditManager } from "./editManager";
import { HeartbeatGroup } from "./heartbeatGroup";
import { Shadow } from "./shadow";
import { ShadowObserver } from "./shadowObserver";
import { SharedTextArea } from "./sharedTextArea";
import { StateObserver } from "./stateObserver";

export class Tab {
  private tabId: string;
  private tabElement: HTMLSpanElement;
  private textArea: HTMLTextAreaElement;
  private stateObserver: StateObserver;
  private editManager: EditManager;

  constructor(tabId: string, textArea: HTMLTextAreaElement,
    heartbeatGroup: HeartbeatGroup,
    shadowObserver: ShadowObserver) {
    this.tabId = tabId;
    this.textArea = textArea;
    this.editManager = new EditManager(textArea);
    this.stateObserver = new StateObserver(heartbeatGroup, this.editManager);
    const sta = new SharedTextArea(
      tabId, this.stateObserver, shadowObserver, this.textArea);
  }

  getTabId() {
    return this.tabId;
  }

  activate() {
    this.textArea.hidden = false;
    this.tabElement.classList.add('active');
  }

  deactivate() {
    this.textArea.hidden = true;
    this.tabElement.classList.remove('active');
  }
}