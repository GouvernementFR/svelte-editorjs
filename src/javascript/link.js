import CorePlugin from "./_core_plugin";
import Link from "../svelte_plugins/Link.svelte";

export default class SvelteLink extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Link;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: "Lien",
      icon: "Lien",
    };
  }
}
