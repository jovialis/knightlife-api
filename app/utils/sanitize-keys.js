module.exports.sanitize = (object, key) => {
    removeKey(object, key);
}

function removeKey(obj, searchKey) {
    for (const objKey in obj) {
        if (objKey === searchKey)
            delete obj[objKey];
        else if (typeof obj[objKey] === 'object')
            removeKey(obj[objKey], searchKey);
    }
}