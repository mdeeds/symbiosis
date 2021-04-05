import { GameFrame } from "./gameFrame";

export class Game {
  private gameFrame: GameFrame;
  constructor(game: string) {

    const req: XMLHttpRequest = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        this.startGame(req.responseText);
      }
    };
    req.open("GET", `games/game_${game}.js`);
    req.send();
  }

  startGame(data: string) {
    const textArea = document.createElement('div');
    const html = data.replace(/\/\*\(\*\//g, '<span>')
      .replace(/\/\*\)\*\//g, '</span>');
    textArea.innerHTML = html;
    textArea.classList.add('code');
    for (const span of textArea.getElementsByTagName('span')) {
      span.contentEditable = "true";
      span.classList.add('editable');
      span.spellcheck = false;
      if (span.innerText.indexOf('\n') >= 0) {
        span.style.setProperty('display', 'block');
      }
    }
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(textArea);
    this.gameFrame = new GameFrame();
    textArea.addEventListener('keyup', (ev) => {
      this.gameFrame.setScript(textArea.innerText);
    });
    this.gameFrame.setScript(textArea.innerText);
  }

}