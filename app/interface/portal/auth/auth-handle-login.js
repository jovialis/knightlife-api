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

module.exports.handleGoogle = (code) => {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await require(`${ __basedir }/app/google/google-loader`).getGoogleAccountFromCode(code);

            const id = details.id;
            const email = details.email;
            const name = details.name;
            let image = details.image;

            // Fix default image sizing
            image = image.replace('sz=50', '');

            const Account = mongoose.model('Account');

            Account.findOne({
                badge: id
            }, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                let account = result;

                if (account) {
                    account.name = name;
                    account.username = email;
                    account.picture = image;
                } else {
                    account = new Account({
                        badge: id,
                        name: name,
                        username: email,
                        picture: image
                    });
                }

                account.save(err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(account);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}