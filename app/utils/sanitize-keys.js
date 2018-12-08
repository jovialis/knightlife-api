module.exports.sanitize = async (object, keys) => {
    return new Promise(resolve => {
        sanitizeKeys(object, keys);
        resolve();
    });
}

function sanitizeKeys(object, keys) {
    for (let key in object) {
        if (typeof object[key] === "object") {
            sanitizeKeys(object[key], keys);
        } else if (keys.includes(key)) {
            delete object[key];
        }
    }
}