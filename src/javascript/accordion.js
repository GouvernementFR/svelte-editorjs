import CorePlugin from "./_core_plugin";
import Accordion from "../svelte_plugins/Accordion.svelte";

export default class SvelteAccordion extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Accordion;
  }

  static get enableLineBreaks() {
    return true;
  }

  static formattingTagHandler(el) {
    // Pasting from MS Word sometimes adds empty format tags. This makes sure they are removed.
    if (el.textContent.trim() === "") {
      return false;
    }
    return {};
  }

  static get sanitize() {
    /*
        Prevents to save some weird html inserted from the contenteditable inputs. Should not happen since html is
        sanitized on paste. Might be moved to _core_plugin.js if this becomes default.
         */
    return {
      br: true,
      b: this.formattingTagHandler,
      i: this.formattingTagHandler,
      ul: {},
      ol: {},
      li: {},
      p: this.formattingTagHandler,
      a: { href: true, target: true },
    };
  }

  static get toolbox() {
    return {
      icon: "Accordéon",
    };
  }
}
