import CorePlugin from "./_core_plugin";
import Quote from "../svelte_plugins/Quote.svelte";

export default class SvelteQuote extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Quote;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: "Citation",
      icon: "Citation",
    };
  }
}
