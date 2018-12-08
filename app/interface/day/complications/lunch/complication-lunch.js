const mongoose = require('mongoose');

module.exports.path = 'lunch';
module.exports.model = 'Lunch';

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

module.exports.populate = async (basepath, doc) => {
    return new Promise(async (resolve, reject) => {
        const Food = mongoose.model('Food');

        try {
            await Food.populate(doc, {
                path: (basepath + 'items'),
                model: 'Food'
            });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}