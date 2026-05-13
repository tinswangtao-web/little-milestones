/**
 * Hides the appendix sentinel lines in the Markdown editor so they don't distract
 * in Source / Live Preview; reading view is unchanged. The text remains in the file.
 */
import { RangeSetBuilder, type Text } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

/** Whole-line markers we hide (must stay in sync with constants / legacy formats). */
function lineMatchesSentinel(doc: Text, lineNo: number): boolean {
  const line = doc.line(lineNo);
  const t = line.text.trim();
  if (t === "<!-- LM:user-content-boundary -->") return true;
  if (t === "[//]: # (lm-user-content-boundary)") return true;
  if (t === "LM:user-content-boundary") return true;
  // Legacy Obsidian %% block: only hide bare %% when adjacent to our middle line
  if (t === "%%") {
    if (lineNo < doc.lines) {
      const next = doc.line(lineNo + 1).text.trim();
      if (next === "LM:user-content-boundary") return true;
    }
    if (lineNo > 1) {
      const prev = doc.line(lineNo - 1).text.trim();
      if (prev === "LM:user-content-boundary") return true;
    }
  }
  return false;
}

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const doc = view.state.doc;
  for (let i = 1; i <= doc.lines; i++) {
    if (lineMatchesSentinel(doc, i)) {
      const line = doc.line(i);
      builder.add(line.from, line.from, Decoration.line({ class: "lm-boundary-sentinel-line" }));
    }
  }
  return builder.finish();
}

const sentinelPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);

export const boundarySentinelHideExtension: Extension = sentinelPlugin;
