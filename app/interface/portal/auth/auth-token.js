const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const uuid = require('uuid/v1');

module.exports.generate = (account) => {
    const badge = account.badge;
    const state = account.state;

    // This is used to keep track of assigned tokens. This'll be useful if, in the future, we want to store each token ID to keep track of them and individually remove sessions.
    const tokenUUID = uuid();

    const token = {
        id: tokenUUID,
        badge: badge,
        state: state
    };

    return jwt.sign(token, process.env.JWT_SECRET);
}

module.exports.validate = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
                return;
            }

            const Account = mongoose.model('Account');

            Account.findOne({
                badge: decoded.badge,
                state: decoded.state
            }, (err, account) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!account) {
                    reject({
                        message: 'Could not find a valid account.',
                        invalid: true
                    });
                    return;
                }

                resolve(account);
            });
        });
    });
}