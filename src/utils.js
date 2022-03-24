export function createElem(tagName, classNames = null, attributes = {}) {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    el[attrName] = attributes[attrName];
  }

  return el;
}

export function appendToElement(elem, elems) {
  for (const node of elems) {
    if (node instanceof Element) {
      elem.appendChild(node);
    } else {
      elem.appendChild(node.render());
    }
  }
}

/*
This is commented out until the DSFR fixes the js api. A fix is implemented below.
export function removePaddingMargin(elem) {
    console.log(elem.classList)
    elem.classList.forEach((ele) => {console.log("ok : " + ele)})
    const classes = [...elem.classList].filter(
        (c) => c.startsWith('fr-m') || c.startsWith('fr-p')
    );
    elem.classList.remove(...classes);
    return classes;
}
 */

export function removePaddingMargin(elem) {
  const store = [];
  elem.classList.forEach((ele) => store.push(ele));
  const classes = store.filter(
    (c) => c.startsWith("fr-m") || c.startsWith("fr-p")
  );
  elem.classList.remove(...classes);
  return classes;
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Octet";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Octets", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// See https://mathiasbynens.be/demo/url-regex
export const urlRegex =
  "https://(www)?[-a-zA-Z0-9@:%._~#=]{1,256}[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_.~#?&//=]*)";
