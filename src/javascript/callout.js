import CorePlugin from "./_core_plugin";
import Callout from "../svelte_plugins/Callout.svelte";

export default class SvelteCallout extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Callout;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon: "Mise en avant",
    };
  }
}
