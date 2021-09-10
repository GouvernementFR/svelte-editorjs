
function emailValidator(value) {
    return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) || 'Veuillez respecter le format d\'adresse mail requis'
}

function requiredValidator(value, test) {
    return (value !== undefined && value !== null && value !== '') || 'Ce champ est requis'
}

function minLengthValidator(value, length) {
    return (value.length > length) || `Ce champ doit comporter au moins ${length} caractères`
}

function maxLengthValidator(value, length) {
    return (value.length < length) || `Ce champ doit comporter au maximum ${length} caractères`
}

export {
    emailValidator,
    requiredValidator,
    minLengthValidator,
    maxLengthValidator
}
