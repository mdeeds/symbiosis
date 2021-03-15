import { rejects } from "assert";
import beautify from "js-beautify";
import { resolve } from "path";
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
  private textArea: HTMLTextAreaElement;
  private updateTimeout: NodeJS.Timeout = null;
  private tabId: string;
  private stateObserver: StateObserver;
  private editManager: EditManager;
  private shadowObserver: ShadowObserver;
  private shadow: Shadow;
  private shadowCallbacks: Function[];
  constructor(tabId: string, stateObserver: StateObserver,
    shadowObserver: ShadowObserver,
    textArea: HTMLTextAreaElement) {
    this.tabId = tabId;
    this.stateObserver = stateObserver;
    this.shadowObserver = shadowObserver;
    this.shadowCallbacks = [];
    // TODO: Because this is initially undefined, we have a problem showing it
    // later.
    shadowObserver.getShadowLocalShadow().then((shadow) => {
      this.shadow = shadow;
      for (const cb of this.shadowCallbacks) {
        cb(this.shadow);
      }
    });
    this.stateObserver.getConnection().waitReady().then(
      (conn) => {
        this.id = conn.id();
        this.textArea.addEventListener('mousemove',
          (ev) => { this.handleMove(ev); });
        this.textArea.addEventListener('scroll',
          (ev) => { this.handleMove(ev); })
      });
    this.textArea = textArea;
    this.editManager = new EditManager(this.textArea);
    // TODO: Add line numbers
    this.textArea.contentEditable = "true";
    this.textArea.spellcheck = false;
    this.textArea.classList.add("sharedTextArea");

    this.stateObserver.getConnection().addCallback("text: ",
      (serialized: string) => {
        const update: TextUpdate = JSON.parse(serialized) as TextUpdate;
        console.log(`Recieved ${serialized.length} bytes.`);
        const newText = atob(update.encodedText);
        const oldText = this.textArea.value;
        const charsAdded = newText.length - oldText.length;
        const insertBefore = this.textArea.selectionStart > update.sourcePosition;
        const newStart = this.textArea.selectionStart + (insertBefore ? charsAdded : 0);
        const newEnd = this.textArea.selectionEnd + (insertBefore ? charsAdded : 0);
        console.log(`Delta: ${charsAdded}, `
          + `this position: ${this.textArea.selectionStart}, `
          + `incoming position: ${update.sourcePosition}`);
        this.textArea.value = newText;
        this.textArea.setSelectionRange(newStart, newEnd);
      }
    )

    this.stateObserver.addMeetCallback((peerId: string) => {
      const update = new TextUpdate();
      update.encodedText = btoa(this.textArea.value);
      update.sourcePosition = this.textArea.selectionStart;
      const message = `text: ${JSON.stringify(update)}`;
      this.stateObserver.getConnection().send(peerId, message);
    })

    this.setUpEventListeners();
  }

  private readyShadow(): Promise<Shadow> {
    return new Promise((resolve, reject) => {
      if (this.shadow) {
        resolve(this.shadow);
      } else {
        this.shadowCallbacks.push(resolve);
      }
    });
  }

  setUpEventListeners() {
    this.textArea.addEventListener('keyup', (ev) => {
      if (this.updateTimeout === null) {
        this.updateTimeout = setTimeout(() => {
          const edits = this.editManager.getEdits();
          this.stateObserver.sendEdits(edits);
          this.updateTimeout = null;
        }, 1000);
      }
    });
    this.textArea.addEventListener('mousemove', (ev) => { this.handleMove(ev); });
    this.textArea.addEventListener('scroll', (ev) => { this.handleMove(ev); })
  }

  getTabId(): string {
    return this.tabId;
  }

  show() {
    this.textArea.hidden = false;
    this.readyShadow().then((shadow) => {
      shadow.setCurrentTab(this.tabId, this.textArea);
    });
  }

  hide() {
    this.textArea.hidden = true;
  }

  sendCode() {
    const code = this.textArea.value;
    console.log(`Uploading ${code.length} bytes.`);
    this.stateObserver.setScript(this.tabId, code);
    // TODO: Send code back to project.
  }

  // TODO add format button.
  format() {
    const code = beautify(this.textArea.value, {
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
    this.textArea.value = code;
  }

  private lastX: number;
  private lastY: number;
  handleMove(ev: Event) {
    if (!this.shadow) {
      return;
    }
    if (ev instanceof MouseEvent) {
      this.shadow.moveTo(ev.clientX, ev.clientY + this.textArea.scrollTop);
      this.lastX = ev.clientX;
      this.lastY = ev.clientY;
    } else {
      this.shadow.moveTo(this.lastX, this.lastY + this.textArea.scrollTop);
    }
    this.shadowObserver.updateShadow(this.shadow);
  }
}