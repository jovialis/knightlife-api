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
    const title = props.title;
    const items = props.items;

    console.log('In complication-lunch. Preparing to update lunch menu with props: ' + JSON.stringify(props));

    return new Promise(async (resolve, reject) => {
        try {
            let idList = []

            const Food = mongoose.model('Food');

            for (const item of items) {
                console.log('Handling provided food: ' + JSON.stringify(item));

                // Exists
                if (item.badge) {
                    console.log('Item does exist')
                    
                    const badge = item.badge;

                    const food = await Food.find({
                        badge: badge
                    });

                    idList.append(food._id);

                    console.log('Fetched food with badge: ' + badge);
                }
                // Needs to be created
                else {
                    console.log('Item does not exist.')
                    
                    const name = item.name;
                    const allergy = item.allergy;
                    
                    console.log('Name: ' + name);
                    console.log('Allergy: ' + allergy)

                    const newFood = await Food.create({
                        name: name,
                        allergy: allergy
                    });

                    idList.push(newFood._id);

                    console.log('Generated food with id: ' + JSON.stringify(newFood._id));
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