import { QuadTree } from "./quadTree";

export class GameFrame {
  private iFrame: HTMLIFrameElement;
  private source = "";
  constructor() {
    this.iFrame = document.createElement('iframe');
    this.iFrame.id = "GameFrame";
    this.iFrame.hidden = false;
    this.setContent(this.source);
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(this.iFrame);
  }

  show() {
    this.uploadContent(this.source);
    this.iFrame.hidden = false;
  }

  hide() {
    this.iFrame.hidden = true;
    this.uploadContent("");
  }

  setContent(html: string) {
    this.source = html;
    if (!this.iFrame.hidden) {
      this.uploadContent(html);
    }
  }

  private uploadContent(html: string) {
    const dataUrl = `data:text/html;base64,${btoa(html)}`;
    this.iFrame.src = dataUrl;
  }

  setScript(javascript: string) {
    const html =
      `<head>` +
      `<script>${QuadTree.toString()}</script>` +
      `<script>${javascript}</script>` +
      `</head>` +
      `<body onload="main()"></body>`;
    this.setContent(html);
  }
}