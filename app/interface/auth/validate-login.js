const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports.validate = (username, password) => {
    return new Promise((resolve, reject) => {
        const Account = mongoose.model('Account');

        Account.findOne({
            username: username
        }, (error, account) => {
            if (error) {
                reject(error);
                return;
            }

            if (!account) {
                reject({
                    message: 'No account found.',
                    invalid: true
                });
                return;
            }

            const hash = account.passhash;

            bcrypt.compare(password, hash, (err, match) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (match) {
                    resolve(account);
                } else {
                    reject({
                        message: 'Invalid password.',
                        invalid: true
                    });
                }
            });
        });
    });
}