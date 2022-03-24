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
  SvelteAccordion,
  SvelteIframe,
  SvelteParagraph,
  inlineToolbarFix,
} from "./build/svelte-editorjs.mjs";

window.addEventListener("load", function () {
  // EditorJS instantiation
  const editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    defaultBlock: 'paragraph',
    tools: {
      inlinetoolbarFix: {
        class: inlineToolbarFix,
        config: { type: "none" },
      },
      // paragraph: {
      //   class: SvelteParagraph,
      //   inlineToolbar: ["inlinetoolbarFix"],
      //   config: {
      //     type: "text",
      //   },
      // },
      Headers: {
        class: SvelteHeader,
        config: {
          type: "text",
        },
      },
      Buttons: {
        class: SvelteButton,
        config: { type: "button" },
      },
      Links: { class: SvelteLink, config: { type: "link" } },
      Accordion: { class: SvelteAccordion, config: { type: "widget" } },
      MiseEnAvants: { class: SvelteCallout, config: { type: "widget" } },
      Exergues: { class: SvelteHighlight, config: { type: "widget" } },
      Quotes: {
        class: SvelteQuote,
        config: { type: "widget" },
      },
      Iframe: {
        class: SvelteIframe,
        config: { type: "plugin" },
      },
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
