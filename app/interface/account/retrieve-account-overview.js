const mongoose = require('mongoose');

module.exports.retrieve = (account) => {
    return new Promise((resolve, reject) => {
        resolve(digestAccount(account));
    });
}

module.exports.retrieveByBadge = (badge) => {
    return new Promise((resolve, reject) => {
        const Account = mongoose.model('Account');

        Account.findOne({
            badge: badge
        }, (err, account) => {
            if (err) {
                reject(err);
                return;
            }

            if (!account) {
                reject('No account found.');
                return;
            }

            resolve(digestAccount(account));
        });
    });
}

function digestAccount(account) {
    return {
        username: account.username,
        name: account.name,
        picture: account.picture
    };
}