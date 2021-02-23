import { Edit, Levenshtein } from "./levenshtein";

export class EditManager {
  private previousContent: string;
  private textArea: HTMLTextAreaElement;
  constructor(textArea: HTMLTextAreaElement) {
    this.previousContent = textArea.value;
    this.textArea = textArea;
  }

  // Applies edits to text area.
  applyEdits(edits: Edit<string>[]) {
    let selectionStart = this.textArea.selectionStart;
    let selectionEnd = this.textArea.selectionEnd;
    const lines: string[] = Levenshtein.splitLines(this.textArea.value);
    Levenshtein.applyEdits<string>(lines, edits);
    this.textArea.value = Levenshtein.combineLines(lines);
    this.textArea.setSelectionRange(selectionStart, selectionEnd);
  }

  getEdits(): Edit<string>[] {
    const edits = Levenshtein.distance<string>(
      Levenshtein.splitLines(this.previousContent),
      Levenshtein.splitLines(this.textArea.value));
    return edits;
  }
}