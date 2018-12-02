const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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