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

module.exports.suggestFood = async (name) => {
    return new Promise(async (resolve, reject) => {
        const Food = mongoose.model('Food');

        try {
            Food.find({
                nameLower: {
                    '$regex': name.toLowerCase()
                }
            }, (err, items) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(items);
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.doUpdate = (lunch, props) => {
    const title = props.title || null;
    const items = props.items || [];

    return new Promise(async (resolve, reject) => {
        try {
            let idList = []

            for (const item of items) {
                const Food = mongoose.model('Food');

                // Exists
                if (item.badge !== undefined) {
                    const badge = item.badge;

                    const food = await Food.find({
                        badge: badge
                    });
                    
                    idList.append(food._id);
                }
                // Needs to be created
                else {
                    const name = item.name;
                    const allergy = item.allergy;

                    const newFood = await Food.create({
                        name: name,
                        allergy: allergy
                    });

                    idList.append(newFood._id);
                }
            }

            lunch.title = title;
            lunch.items = idList;
            
            resolve(await lunch.save());
        } catch (err) {
            reject(err);
        }
    });
}