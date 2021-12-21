import EditorJS from "@editorjs/editorjs";
import JSONFormatter from "json-formatter-js";
import "@gouvfr/dsfr/dist/dsfr/dsfr.min.css";
import "@gouvfr/dsfr/dist/dsfr/dsfr.module.min";

// Plugins css
import "./build/svelte-editorjs.css";

// Plugins import
import {
  SvelteHeader,
  SvelteButton,
  SvelteCallout,
  SvelteHighlight,
  SvelteLink,
  SvelteQuote,
} from "./build/svelte-editorjs.mjs";

window.addEventListener("load", function () {
  // EditorJS instantiation
  const editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    tools: {
      headers: SvelteHeader,
      quotes: SvelteQuote,
      buttons: SvelteButton,
      callouts: SvelteCallout,
      highlights: SvelteHighlight,
      links: SvelteLink,
    },
  });

  // Small utility to review editor underlying data in a modal
  const btn = document.querySelector("button.sticky");
  btn.addEventListener("click", showJson);

  async function showJson() {
    const data = await editor.save();
    const formatter = new JSONFormatter(data.blocks);
    const jsonviewer = document.querySelector(".jsonviewer");
    jsonviewer.innerHTML = "";
    jsonviewer.appendChild(formatter.render());
  }
});
