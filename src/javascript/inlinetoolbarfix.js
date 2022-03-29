export default class inlineToolbarFix {
  /*
    The sanitize() static method that could be defined in plugins does not work on paste. Seems that this behaviour is
    only made available with the inlineToolbar. This class adds a dummy tool to the inlinetoolbar with a sanitize()
    config that restores the required paste behaviour. It's a hack nonetheless.
     */

  static get isInline() {
    return true;
  }

  static formattingTagHandler(el) {
    // Pasting from MS Word sometimes adds empty format tags. This makes sure they are removed.
    if (el.textContent.trim() === "") {
      return false;
    }
    return {};
  }

  static paragraphTagHandler(el) {
    /*
        If the p tags seems to come from MS Office, ignore it. Prevent the creation of multiple paragraphs when pasting
        lists from MS Office.
         */
    if (el.className.startsWith("MsoListParagraph")) {
      return false;
    }
    return {};
  }

  static get sanitize() {
    return {
      br: true,
      b: this.formattingTagHandler,
      i: this.formattingTagHandler,
      ul: {},
      ol: {},
      li: {},
      p: this.paragraphTagHandler,
    };
  }

  render() {
    // Return value must be HTMLElement.
    return document.createElement("span");
  }

  /*
    Inline tools must provide 3 methods to work : render, surround, and checkStat. Hence the empty surround() and
    checkState() defined below.
     */
  surround() {}

  checkState() {}
}
