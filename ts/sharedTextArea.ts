import beautify from "js-beautify";
import { EditManager } from "./editManager";
import { Shadow } from "./shadow";
import { ShadowObserver } from "./shadowObserver";
import { ShadowPosition } from "./shadowPosition";
import { StateObserver } from "./stateObserver";

class TextUpdate {
  sourcePosition: number;
  encodedText: string;
}

export class SharedTextArea {
  private id: string;
  private div: HTMLTextAreaElement;
  private updateTimeout: NodeJS.Timeout = null;
  private tabId: string;
  private stateObserver: StateObserver;
  private editManager: EditManager;
  private shadowObserver: ShadowObserver;
  private shadow: Shadow;
  constructor(tabId: string, stateObserver: StateObserver,
    shadowObserver: ShadowObserver,
    textArea: HTMLTextAreaElement) {
    this.tabId = tabId;
    this.stateObserver = stateObserver;
    this.shadowObserver = shadowObserver;
    shadowObserver.getShadowLocalShadow().then((shadow) => {
      this.shadow = shadow;
    });
    this.stateObserver.getConnection().waitReady().then(
      (conn) => {
        this.id = conn.id();
        this.div.addEventListener('mousemove',
          (ev) => { this.handleMove(ev); });
        this.div.addEventListener('scroll',
          (ev) => { this.handleMove(ev); })
      });
    this.div = textArea;
    this.editManager = new EditManager(this.div);
    // TODO: Add line numbers
    this.div.contentEditable = "true";
    this.div.spellcheck = false;
    this.div.classList.add("sharedTextArea");

    this.stateObserver.getConnection().addCallback("text: ",
      (serialized: string) => {
        const update: TextUpdate = JSON.parse(serialized) as TextUpdate;
        console.log(`Recieved ${serialized.length} bytes.`);
        const newText = atob(update.encodedText);
        const oldText = this.div.value;
        const charsAdded = newText.length - oldText.length;
        const insertBefore = this.div.selectionStart > update.sourcePosition;
        const newStart = this.div.selectionStart + (insertBefore ? charsAdded : 0);
        const newEnd = this.div.selectionEnd + (insertBefore ? charsAdded : 0);
        console.log(`Delta: ${charsAdded}, `
          + `this position: ${this.div.selectionStart}, `
          + `incoming position: ${update.sourcePosition}`);
        this.div.value = newText;
        this.div.setSelectionRange(newStart, newEnd);
      }
    )

    this.stateObserver.addMeetCallback((peerId: string) => {
      const update = new TextUpdate();
      update.encodedText = btoa(this.div.value);
      update.sourcePosition = this.div.selectionStart;
      const message = `text: ${JSON.stringify(update)}`;
      this.stateObserver.getConnection().send(peerId, message);
    })

    this.setUpEventListeners();
  }

  setUpEventListeners() {
    this.div.addEventListener('keyup', (ev) => {
      if (this.updateTimeout === null) {
        this.updateTimeout = setTimeout(() => {
          const edits = this.editManager.getEdits();
          this.stateObserver.sendEdits(edits);
          this.updateTimeout = null;
        }, 1000);
      }
    });
    this.div.addEventListener('mousemove', (ev) => { this.handleMove(ev); });
    this.div.addEventListener('scroll', (ev) => { this.handleMove(ev); })
  }

  getTabId(): string {
    return this.tabId;
  }

  show() {
    this.div.hidden = false;
  }

  hide() {
    this.div.hidden = true;
  }

  sendCode() {
    const code = this.div.value;
    console.log(`Uploading ${code.length} bytes.`);
    this.stateObserver.setScript(this.tabId, code);
    // TODO: Send code back to project.
  }

  // TODO add format button.
  format() {
    const code = beautify(this.div.value, {
      "indent_size": 2,
      "indent_char": " ",
      "max_preserve_newlines": 1,
      "preserve_newlines": true,
      "keep_array_indentation": false,
      "break_chained_methods": false,
      "brace_style": "collapse",
      "space_before_conditional": true,
      "unescape_strings": false,
      "jslint_happy": false,
      "end_with_newline": false,
      "wrap_line_length": 80,
      "comma_first": false,
      "e4x": false,
      "indent_empty_lines": false
    });
    this.div.value = code;
  }

  private lastX: number;
  private lastY: number;
  handleMove(ev: Event) {
    if (!this.shadow) {
      return;
    }
    if (ev instanceof MouseEvent) {
      this.shadow.moveTo(ev.clientX, ev.clientY + this.div.scrollTop);
      this.lastX = ev.clientX;
      this.lastY = ev.clientY;
      console.log(`${ev.clientX}, ${ev.clientY}`);
    } else {
      this.shadow.moveTo(this.lastX, this.lastY + this.div.scrollTop);
    }
    this.shadowObserver.updateShadow(this.shadow);
  }
}