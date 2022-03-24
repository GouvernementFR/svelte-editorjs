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
      icon: "Titre",
    };
  }

  onPaste(event) {
    const content = event.detail.data;

    let level = 2;

    switch (content.tagName) {
      case "H1":
        level = 2;
        break;
      case "H2":
        level = 2;
        break;
      case "H3":
        level = 3;
        break;
      case "H4":
        level = 4;
        break;
      case "H5":
        level = 4;
        break;
      case "H6":
        level = 4;
        break;
    }

    this.plugin.data = {
      level: level,
      text: content.innerHTML,
    };
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {},
    };
  }

  static get pasteConfig() {
    return {
      tags: ["H1", "H2", "H3", "H4", "H5", "H6"],
    };
  }

  validate(savedData) {
    return savedData.text.trim() !== "";
  }
}
