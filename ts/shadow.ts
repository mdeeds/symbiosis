import { ShadowPosition } from "./shadowPosition";

export class Shadow {
  private position: ShadowPosition;
  private img: HTMLImageElement;
  private textArea: HTMLTextAreaElement;

  constructor(position: ShadowPosition) {
    this.position = position;
    this.img = document.createElement('img');
    this.img.src = "Shadow.png";
    this.img.classList.add("shadow");
    this.img.style.setProperty(
      'filter', `hue-rotate(${this.position.hue}turn)`);
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(this.img);
  }

  setTab(tabId: string) {
    this.position.tabId = tabId;
  }

  setCurrentTab(tabId: string, textArea: HTMLTextAreaElement) {
    if (tabId === this.position.tabId) {
      this.img.hidden = false;
    } else {
      this.img.hidden = true;
    }
    this.textArea = textArea;
  }

  moveTo(x: number, y: number) {
    if (!this.textArea) {
      console.log("No text area.");
      return;
    }
    const scrollOffset = this.textArea.scrollTop;
    this.position.x = x;
    this.position.y = y;
    this.img.style.left = `${x - 20}px`;
    this.img.style.top = `${y - scrollOffset - 20}px`;
  }

  updatePosition(position: ShadowPosition) {
    this.setTab(position.tabId);
    this.moveTo(position.x, position.y);
  }
  getPosition(): ShadowPosition {
    return this.position;
  }
}