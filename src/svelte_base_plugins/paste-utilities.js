function isWordDocument(doc) {
  /*
  Check if pasted from a MS office Word document (not working with the online version).
  Might be further extended if there is need to check if pasted from MS Excel etc.
  Might also be made more permissive just based on the presence of some very specific classes, like MsoListParagraph.
   */
  const docRoot = doc.documentElement;
  return (
      docRoot.hasAttribute('xmlns:w') &&
      docRoot.getAttribute('xmlns:w').indexOf('office:word') !== -1
  );
}

function sanitizeWordDocument(doc) {
  let ele = false;
  const children = Array.from(doc.body.children);
  const soleChild =
      children.length === 1 &&
      !children[0].classList.contains('MsoListParagraph')
          ? children[0]
          : false;
  if (soleChild) {
      ele = sanitizeWordHtml(soleChild.innerHTML);
      insertHtml(ele);
  } else if (
      children.every((ele) => ele.className.startsWith('MsoListParagraph'))
  ) {
      // All elements belong to a list
      ele = sanitizeWordList(children);
      insertHtml(ele.outerHTML);
  }
  return ele;
}

function sanitizeWordHtml(html) {
  // Removes all tags except <i>, <br>, <b>
  return html
      .replace(/(<\/?(?:i|br|b))(?:[^>]*)(>)|<[^>]+>/gi, '$1$2')
      .replace(/(&nbsp;)+(?=&nbsp;)/g, '')
      .replace(/(<br>)+(?=<br><br>)/g, '')
      .replace(/ +(?= )/g, '')
      .trim();
}

function sanitizeWordList(elementsArray) {
  // Detects the list type
  const firstChar = elementsArray[0].textContent.charAt(0);
  const listType = !isNaN(firstChar) ? 'OL' : 'UL';
  const list = document.createElement(listType);
  elementsArray.forEach((ele) => {
      ele.innerHTML = sanitizeWordHtml(ele.innerHTML);
      // removes the first characters added by word (bullet points, numbering)
      const firstChar = ele.textContent.charAt(0);
      // Don't rely on firstChar when listType === "OL" because there might be numbered list have more than 9 elements
      const toStrip =
          listType === 'OL'
              ? ele.textContent.split('.', 1)[0] + '.'
              : firstChar;
      // Word uses <p> tags instead of <li>
      const li = document.createElement('li');
      li.innerHTML = ele.innerHTML.replace(toStrip, '').trim();
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

function convertWordLists(html) {
  /*
  Word uses <p> tags for lists. All of them have a class attribute starting with "MsoListParagraph".
  Gets all of them to create proper lists (only work for windows desktop as of now).
   */
  let ul;
  const listElements = Array.from(html.children).filter((ele) =>
      ele.className.startsWith('MsoListParagraph')
  );
  listElements.forEach((ch) => {
      // First element in list means a list has to inserted.
      if (ch.classList.contains('MsoListParagraphCxSpFirst')) {
          ul = document.createElement('ul');
          ch.before(ul);
          ul.appendChild(ch);
          // Last element in list means a list is complete and needs to be sanitized.
      } else if (ch.classList.contains('MsoListParagraphCxSpLast')) {
          ul.appendChild(ch);
          const sanitizedUl = sanitizeWordList(ul.children);
          ul.replaceWith(sanitizedUl);
          // Single list element
      } else if (ch.classList.contains('MsoListParagraph')) {
          ul = document.createElement('ul');
          ch.before(ul);
          ul.appendChild(ch);
          const sanitizedUl = sanitizeWordList(ul.children);
          ul.replaceWith(sanitizedUl);
          // Elements in between
      } else {
          ul.appendChild(ch);
      }
  });
  return html.innerHTML;
}

function sanitizeHtml(doc) {
  let html = doc.body.innerHTML;
  if (html.indexOf('MsoListParagraph') !== -1) {
      html = convertWordLists(doc.body);
  }

  return (
      html
          // Removes all tags except <i>, <br>, <b>, <li>, <ul>, <ol> & <p>
          .replace(
              /(<\/?(?:i|br|b|li|ol|ul|p))(?:[^>]*)(>)|<[^>]+>/gi,
              '$1$2'
          )
          // Removes duplicates non-breakable
          .replace(/(&nbsp;)+(?=&nbsp;)/g, '')
          // Succession of more than two <br> are removed
          .replace(/(<br>)+(?=<br><br>)/g, '')
          // Removes duplicate spaces
          .replace(/ +(?= )/g, '')
          .trim()
  );
}

function insertHtml(html) {
  document.execCommand('insertHTML', false, html);
}

export {isWordDocument, sanitizeWordDocument, isHtml, sanitizeHtml, insertHtml};
