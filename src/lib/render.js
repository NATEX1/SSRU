import EditorJSHTML from "editorjs-html";

const editorJsHtml = EditorJSHTML({
  header: (block) => {
    const align = block.tunes?.alignmentTune?.alignment || "left";
    return `<h${block.data.level} style="text-align:${align}">
      ${block.data.text}
    </h${block.data.level}>`;
  },
});

export function render(content) {
  if (!content) return "";

  try {
    const data =
      typeof content === "string" ? JSON.parse(content) : content;

    const parsed = editorJsHtml.parse(data);

    if (Array.isArray(parsed)) {
      return parsed.join("");
    }

    if (typeof parsed === "string") {
      return parsed;
    }

    if (parsed?.html) {
      return parsed.html;
    }

    return "";
  } catch (e) {
    console.error("Editor.js render error", e);
    return "";
  }
}
