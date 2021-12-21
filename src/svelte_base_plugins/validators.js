function emailValidator(value) {
  return (
    (value &&
      !!value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) ||
    "Veuillez respecter le format d'adresse mail requis"
  );
}

function requiredValidator(value, param) {
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
  const urlRegex =
    "^(?:(?:(?:https?|ftp):)?//)(?:S+(?::S*)?@)?(?:(?!(?:10|127)(?:.d{1,3}){3})(?!(?:169.254|192.168)(?:.d{1,3}){2})(?!172.(?:1[6-9]|2d|3[0-1])(?:.d{1,3}){2})(?:[1-9]d?|1dd|2[01]d|22[0-3])(?:.(?:1?d{1,2}|2[0-4]d|25[0-5])){2}(?:.(?:[1-9]d?|1dd|2[0-4]d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff].)+(?:[a-z\u00a1-\uffff]{2,}.?))(?::d{2,5})?(?:[/?#]S*)?$";
  return (value && !!value.match(urlRegex)) || "Merci de saisir une URL valide";
}

function urlValidator(value, param) {
  const urlRegex =
    /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
  return (
    (value && !!value.match(urlRegex)) ||
    "L'URL doit être de cette forme : gouvernement.fr ou www.gouvernement.fr"
  );
}

export {
  emailValidator,
  requiredValidator,
  minLengthValidator,
  maxLengthValidator,
  linkValidator,
  urlValidator,
};
