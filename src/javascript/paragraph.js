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
      icon: "Paragraphe",
    };
  }

  static get pasteConfig() {
    return {
      tags: ["P", "UL", "OL", "LI"],
    };
  }

  merge(data) {
    this.plugin.data = {
      text: this.plugin.data.text + data.text,
    };
  }

  onPaste(event) {
    const element = event.detail.data;
    let data = element.innerHTML;
    switch (element.tagName) {
      case "OL":
      case "UL":
        data = element.outerHTML;
        break;
      case "LI":
        data = `<ul>${element.outerHTML}</ul>`;
        break;
    }
    this.plugin.data = {
      text: data,
    };
  }

  validate(savedData) {
    return savedData.text.trim() !== "";
  }
}
