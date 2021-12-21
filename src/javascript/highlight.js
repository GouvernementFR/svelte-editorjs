import CorePlugin from "./_core_plugin";
import Highlight from "../svelte_plugins/Highlight.svelte";

export default class SvelteHighlight extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Highlight;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: "Exergue",
      icon: "Exergue",
    };
  }
}
