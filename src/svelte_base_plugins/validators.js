function emailValidator(value) {
  return (
    (value &&
      !!value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) ||
    "Veuillez respecter le format d'adresse mail requis"
  );
}

function requiredValidator(value) {
  return (
    (value !== undefined && value !== null && value !== "") ||
    "Ce champ est requis"
  );
}

function minLengthValidator(value, length) {
  return (
    value.length > length ||
    `Ce champ doit comporter au moins ${length} caractères`
  );
}

function maxLengthValidator(value, length) {
  return (
    value.length < length ||
    `Ce champ doit comporter au maximum ${length} caractères`
  );
}

function linkValidator(value, param) {
  // See https://mathiasbynens.be/demo/url-regex. Might need to be changed.
  const urlRegex = "^(https?)://[^\\s/.]+\\.[^\\s]{2,}$";
  return (value && !!value.match(urlRegex)) || "Veuillez saisir une URL valide";
}

function anchorValidator(value) {
  const anchorRegex = "^#[a-zA-Z0-9-_]+$";
  return (
    (value && !!value.match(anchorRegex)) ||
    "Veuillez respecter le format requis"
  );
}

function urlValidator(value) {
  const urlRegex =
    /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
  return (
    (value && !!value.match(urlRegex)) ||
    "L'URL doit être de cette forme : gouvernement.fr ou www.gouvernement.fr"
  );
}

function iframeValidator(value) {
  const iframeRegex = /<iframe[^>]*src=["|']([^'"]+)["|'][^>]*>\s*?<\/iframe>/;
  return (
    (value && !!value.match(iframeRegex)) ||
    "Le code iframe doit débuter avec <iframe ...> et finir par </iframe>."
  );
}

export {
  emailValidator,
  requiredValidator,
  minLengthValidator,
  maxLengthValidator,
  linkValidator,
  anchorValidator,
  urlValidator,
  iframeValidator,
};
