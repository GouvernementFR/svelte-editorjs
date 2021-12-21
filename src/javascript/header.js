import CorePlugin from "./_core_plugin";
import Header from "../svelte_plugins/Header.svelte";

export default class SvelteHeader extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Header;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: "Titre",
      icon: "Titre",
    };
  }
}
