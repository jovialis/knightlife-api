const mongoose = require('mongoose')

const complications = [
    require('./complications/schedule/complication-schedule'),
    require('./complications/lunch/complication-lunch')
];

module.exports.retrieve = (date) => {
    return new Promise(async (resolve, reject) => {
        const Day = mongoose.model('Day')

        Day.findOne({
            date: date
        }, async (err, day) => {
            if (err) {
                reject(err);
                return;
            }

            // Need to create a Day object
            if (!day) {
                try {
                    day = await Day.create({
                        date: date
                    });
                } catch (err) {
                    reject(err);
                    return;
                }
            }

            // Day object exists, ensure defaults

            try {
                await ensureDefaults(day);
            } catch (err) {
                reject(err);
                return;
            }

            // Populate complications
            for (const complication of complications) {
                try {
                    await mongoose.model(complication.model).populate(day, {
                        path: `complications.${ complication.path }`,
                        model: complication.model
                    });

                    if (complication.populate !== undefined) {
                        await complication.populate(`complications.${ complication.path }.`, day);
                    }
                } catch (err) {
                    reject(err);
                    return;
                }
            }
            
            resolve(day);
        });
    });
}

async function ensureDefaults(day) {
    return new Promise(async (resolve, reject) => {
        let changed = false;

        for (const complication of complications) {
            const path = complication.path;

            // Complication doesn't exist so we have to make it
            if (day.complications === undefined || day.complications[path] === undefined) {
                try {
                    const document = await complication.create(day);
                    const docId = document._id;

                    day.complications[path] = docId;

                    changed = true;
                } catch (err) {
                    reject(err);
                    return;
                }
            }
        }

        // Only save if we changed something.
        if (changed) {
            day.save(err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
            return;
        }

        resolve();
    });
}