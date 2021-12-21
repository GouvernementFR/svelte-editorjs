import CorePlugin from "./_core_plugin";
import Paragraph from "../svelte_plugins/Paragraph.svelte";

export default class SvelteParagraph extends CorePlugin {
  constructor(...args) {
    super(...args);
    this.Plugin = Paragraph;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      title: "Paragraphe",
      icon: "Paragraphe",
    };
  }
}
