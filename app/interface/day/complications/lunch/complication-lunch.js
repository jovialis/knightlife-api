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
                suggest: true,
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

module.exports.hideSuggestion = async (badge) => {
    return new Promise(async (resolve, reject) => {
        const Food = mongoose.model('Food');
        
        try {
            await Food.findOneAndUpdate({
                badge: badge
            }, {
                suggest: false
            });
            
            resolve(true);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.doUpdate = (lunch, props) => {
    const title = props.title;
    const items = props.items;

    return new Promise(async (resolve, reject) => {
        try {
            let idList = []

            const Food = mongoose.model('Food');

            for (const item of items) {
                // Require item name for processing
                if (!item.name) {
                    continue;
                }

                const indexingName = item.name.trim().toLowerCase();
                const indexingAllergy = item.allergy ? (item.allergy.trim().toLowerCase()) : null;

                const alreadyExisting = await Food.findOne({
                    nameLower: indexingName,
                    allergyLower: indexingAllergy
                });

                if (alreadyExisting) {
                    idList.push(alreadyExisting._id);
                    continue;
                }

                const name = item.name.trim();
                const allergy = item.allergy ? (item.allergy.trim()) : null;

                const newFood = await Food.create({
                    name: name,
                    allergy: allergy
                });

                idList.push(newFood._id);
            }

            lunch.title = title;
            lunch.items = idList;

            resolve(await lunch.save());
        } catch (err) {
            reject(err);
        }
    });
}