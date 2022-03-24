function isWordDocument(doc) {
  /*
    Check if pasted from a MS office Word document (not working with the online version).
    Might be further extended if there is need to check if pasted from MS Excel etc.
    Might also be made more permissive just based on the presence of some very specific classes, like MsoListParagraph.
     */
  const docRoot = doc.documentElement;
  return (
    docRoot.hasAttribute("xmlns:w") &&
    docRoot.getAttribute("xmlns:w").indexOf("office:word") !== -1
  );
}

function sanitizeWordDocument(doc) {
  let ele = false;
  const children = Array.from(doc.body.children);
  const soleChild =
    children.length === 1 && !children[0].classList.contains("MsoListParagraph")
      ? children[0]
      : false;
  if (soleChild) {
    ele = sanitizeWordHtml(soleChild.innerHTML);
    insertHtml(ele);
  } else if (
    children.every((ele) => ele.className.startsWith("MsoListParagraph"))
  ) {
    // All elements belong to a list
    ele = sanitizeWordList(children);
    insertHtml(ele.outerHTML);
  }
  return ele;
}

function sanitizeWordHtml(html) {
  // Removes all tags except <i>, <b>, <br>
  return html
    .replace(/(<\/?(?:i|b|br)[^>]*>)|<[^>]+>/gi, "$1")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function sanitizeWordList(elementsArray) {
  // Detects the list type
  const firstChar = elementsArray[0].textContent.charAt(0);
  const listType = !isNaN(firstChar) ? "OL" : "UL";
  const list = document.createElement(listType);
  elementsArray.forEach((ele) => {
    ele.innerHTML = sanitizeWordHtml(ele.innerHTML);
    // removes the first characters added by word (bullet points, numbering)
    const firstChar = ele.textContent.charAt(0);
    // Don't rely on firstChar when listType === "OL" because there might be numbered list have more than 9 elements
    const toStrip =
      listType === "OL" ? ele.textContent.split(".", 1)[0] + "." : firstChar;
    // Word uses <p> tags instead of <li>
    const li = document.createElement("li");
    li.innerHTML = ele.innerHTML.replace(toStrip, "").trim();
    list.appendChild(li);
  });
  return list;
}

function isHtml(doc) {
  // First check that the element has child nodes
  if (doc.hasChildNodes()) {
    const children = Array.from(doc.childNodes);
    return !!children.filter((child) => child.hasChildNodes()).length;
  }
  return false;
}

function sanitizeHtml(html) {
  // Removes all tags except <i>, <b>, <br>, <li>, <ul>, <ol>
  return html
    .replace(/(<\/?(?:i|b|br|li|ol|ul)[^>]*>)|<[^>]+>/gi, "$1")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function insertHtml(html) {
  document.execCommand("insertHTML", false, html);
}

export {
  isWordDocument,
  sanitizeWordDocument,
  isHtml,
  sanitizeHtml,
  insertHtml,
};
