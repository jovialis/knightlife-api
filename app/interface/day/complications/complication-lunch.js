const mongoose = require('mongoose');

module.exports.path = 'lunch';

module.exports.create = (day) => {
    return new Promise((resolve, reject) => {
        const Lunch = mongoose.model('Lunch');

        // We try to find one first; we don't return a new instance if one already exists
        Lunch.create({}, (err, lunch) => {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(lunch);
        });
    });
}