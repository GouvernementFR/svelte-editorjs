import CorePlugin from "./_core_plugin";
import Button from "../svelte_plugins/Button.svelte";

export default class SvelteButton extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Button;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon: "Bouton",
    };
  }
}
