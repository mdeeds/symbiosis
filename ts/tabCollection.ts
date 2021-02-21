import { GameFrame } from "./gameFrame";
import { HeartbeatGroup } from "./heartbeatGroup";
import { Project } from "./project";
import { SharedTextArea } from "./sharedTextArea";
import { StateObserver } from "./stateObserver";

export class TabCollection {

  private buttonContainer: HTMLDivElement;
  private plus: HTMLSpanElement;
  private tabMap: Map<HTMLSpanElement, SharedTextArea>;

  private project: Project;
  private stateObserver: StateObserver;
  private heartbeatGroup: HeartbeatGroup;
  private gameFrame: GameFrame;

  constructor(project: Project,
    heartbeatGroup: HeartbeatGroup, gameFrame: GameFrame) {
    this.project = project;
    this.heartbeatGroup = heartbeatGroup;
    this.gameFrame = gameFrame;
    this.tabMap = new Map<HTMLSpanElement, SharedTextArea>();

    const body = document.getElementsByTagName('body')[0];
    const tabCollectionDiv = document.createElement('div');
    tabCollectionDiv.classList.add('tabCollection');
    body.appendChild(tabCollectionDiv);

    this.stateObserver = new StateObserver(
      this.heartbeatGroup, this.gameFrame);

    this.buttonContainer = document.createElement('div');
    this.plus = this.createButton('+');
    this.plus.classList.remove('active');
    this.buttonContainer.classList.add('tabs');
    tabCollectionDiv.appendChild(this.buttonContainer);

    this.plus.addEventListener('click', (ev) => {
      const tabId = window.performance.now().toFixed(0);
      this.addTextArea(
        new SharedTextArea(tabId, this.update.bind(this), tabCollectionDiv, ""));
    });

    tabCollectionDiv.appendChild(this.buttonContainer);

    for (const content of project.getTabContent()) {
      const tabId = Math.random().toFixed(3);
      this.addTextArea(
        new SharedTextArea(tabId, this.update.bind(this), tabCollectionDiv,
          content));
    }
  }

  private update(tabId: string, newestText: string) {

  }

  private setupCallbacks() {
    this.stateObserver.getConnection().waitReady().then(
      (conn) => {
        this.id = conn.id();
        const sp = new ShadowPosition();
        sp.ownerId = this.id;
        sp.hue = Math.random();
        console.log(`This id: ${this.id}`);
        this.shadows.set(this.id, sp)
        this.updateShadows();

        this.div.addEventListener('mousemove',
          (ev) => { this.handleMove(ev); });
        this.div.addEventListener('scroll',
          (ev) => { this.handleMove(ev); })
      });

  }

  private createButton(label: string) {
    const button = document.createElement('span');
    button.innerText = label;
    button.classList.add('tab');
    this.buttonContainer.appendChild(button);
    button.addEventListener('click', (ev: MouseEvent) => {
      for (const [b, sta] of this.tabMap.entries()) {
        b.classList.remove('active');
        sta.hide();
      }
      const b = ev.target as HTMLSpanElement;
      if (b !== this.plus) {
        b.classList.add('active');
        this.tabMap.get(b).show();
      }
    });
    return button
  }

  addTextArea(sta: SharedTextArea) {
    const button = this.createButton(sta.getTabId());
    button.classList.add('active');
    this.tabMap.set(button, sta);
  }
}