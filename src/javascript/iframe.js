import CorePlugin from "./_core_plugin";
import Iframe from "../svelte_plugins/Iframe.svelte";

export default class SvelteIframe extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Iframe;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon: "Insérer une iframe",
    };
  }
}
