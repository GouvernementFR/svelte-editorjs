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

  static get toolbox() {
    return {
      icon: "Accordéon",
    };
  }
}
