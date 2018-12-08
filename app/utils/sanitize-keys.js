module.exports.sanitize = async (object, keys) => {
    return new Promise(async resolve => {
        await sanitizeKeys(object, keys);
        resolve();
    });
}

async function sanitizeKeys(object, keys) {
    for (let key in object) {
        if (typeof object[key] === "object") {
            sanitizeKeys(object[key], keys);
        } else if (keys.includes(key)) {
            delete object[key];
        }
    }
}