import { HeartbeatGroup } from "./heartbeatGroup";
import { Project } from "./project";
import { ShadowObserver } from "./shadowObserver";
import { Tab } from "./tab";

export class TabCollection {
  private buttonContainer: HTMLDivElement;
  private tabCollectionDiv: HTMLDivElement;
  private plus: HTMLSpanElement;
  private tabMap: Map<string, Tab>;

  private project: Project;
  private heartbeatGroup: HeartbeatGroup;
  private id: string;
  private currentTabId: string;
  private shadowObserver: ShadowObserver;

  constructor(project: Project,
    heartbeatGroup: HeartbeatGroup) {
    this.project = project;
    this.heartbeatGroup = heartbeatGroup;
    this.shadowObserver = new ShadowObserver(this.heartbeatGroup);
    this.tabMap = new Map<string, Tab>();

    const body = document.getElementsByTagName('body')[0];
    this.tabCollectionDiv = document.createElement('div');
    this.tabCollectionDiv.classList.add('tabCollection');
    body.appendChild(this.tabCollectionDiv);

    this.buttonContainer = document.createElement('div');
    this.plus = this.createButton('+');
    this.plus.classList.remove('active');
    this.buttonContainer.classList.add('tabs');
    this.tabCollectionDiv.appendChild(this.buttonContainer);

    this.plus.addEventListener('click', (ev) => {
      this.addTextArea("");
    });

    this.tabCollectionDiv.appendChild(this.buttonContainer);

    for (const content of project.getTabContent()) {
      this.addTextArea(content);
    }
  }

  private createButton(tabId: string) {
    const button = document.createElement('span');
    button.innerText = tabId;
    button.classList.add('tab');
    this.buttonContainer.appendChild(button);
    button.addEventListener('click', (ev: MouseEvent) => {
      for (const [tabId, tab] of this.tabMap.entries()) {
        tab.deactivate();
      }
      this.tabMap.get(tabId).activate();
    });
    return button
  }

  addTextArea(content: string) {
    const tabId = Math.random().toFixed(3);
    const textArea = document.createElement('textarea');
    textArea.classList.add('sharedTextArea');
    this.tabCollectionDiv.appendChild(textArea);
    textArea.value = content;
    const tabButton = this.createButton(tabId);
    const tab = new Tab(
      tabId, textArea, this.heartbeatGroup, this.shadowObserver);
    tabButton.classList.add('active');
    this.tabMap.set(tabId, tab);
  }
}