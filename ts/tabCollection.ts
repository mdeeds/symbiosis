import { PeerGroup } from "./peerGroup";
import { Project } from "./project";
import { ShadowObserver } from "./shadowObserver";
import { Tab } from "./tab";

export class TabCollection {
  private buttonContainer: HTMLDivElement;
  private tabCollectionDiv: HTMLDivElement;
  private plus: HTMLSpanElement;
  private tabMap: Map<string, Tab>;
  private tabList: Tab[];

  private project: Project;
  private peerGroup: PeerGroup;
  private id: string;
  private currentTabId: string;
  private shadowObserver: ShadowObserver;

  constructor(project: Project,
    peerGroup: PeerGroup) {
    this.project = project;
    this.peerGroup = peerGroup;
    this.shadowObserver = new ShadowObserver(this.peerGroup);
    this.tabMap = new Map<string, Tab>();
    this.tabList = [];

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
      const newTab = this.addTextArea("");
      this.selectTab(newTab.getTabId());
    });

    this.tabCollectionDiv.appendChild(this.buttonContainer);

    for (const content of project.getTabContent()) {
      this.addTextArea(content);
    }
    if (this.tabList.length > 0) {
      this.selectTab(this.tabList[0].getTabId());
    }
  }

  private selectTab(tabId: string) {
    for (const t of this.tabList) {
      if (t.getTabId() === tabId) {
        t.activate();
      } else {
        t.deactivate();
      }
    }
  }

  private createButton(tabId: string) {
    const button = document.createElement('span');
    button.innerText = tabId;
    button.classList.add('tab');
    this.buttonContainer.appendChild(button);
    button.addEventListener('click', (ev: MouseEvent) => {
      this.selectTab(tabId);
    });
    return button
  }

  addTextArea(content: string): Tab {
    const tabId = Math.random().toFixed(3);
    const textArea = document.createElement('textarea');
    textArea.classList.add('sharedTextArea');
    this.tabCollectionDiv.appendChild(textArea);
    textArea.value = content;
    const tabButton = this.createButton(tabId);
    const tab = new Tab(
      tabId, textArea, this.peerGroup, this.shadowObserver);
    tabButton.classList.add('active');
    this.tabMap.set(tabId, tab);
    this.tabList.push(tab);
    return tab;
  }
}