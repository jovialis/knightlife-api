const mongoose = require('mongoose');

module.exports.validate = (code) => {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await require(`${ __basedir }/app/google/google-loader`).getGoogleAccountFromCode(code);
            
            const id = details.id;
            const email = details.email;
            const name = details.name;
            const image = details.image;

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