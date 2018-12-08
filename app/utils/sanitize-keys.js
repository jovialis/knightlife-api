module.exports.sanitize = (object, keys) => {
    return sanitizeKeys(object, keys);
}

function sanitizeKeys(object, keys) {
    for (let key in object) {
        if (typeof object[key] == "object") {
            sanitizeKeys(object[key], keys);
        } else if (keys.includes(key)) {
            delete object[key];
        }
    }
    return object;
}