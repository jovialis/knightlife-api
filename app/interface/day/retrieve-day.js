const mongoose = require('mongoose')

const complications = [
    require('./complications/complication-schedule'),
    require('./complications/complication-lunch')
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
                const newDay = await Day.create({
                    date: date
                });

                try {
                    await ensureDefaults(newDay);
                    resolve(newDay);
                } catch (err) {
                    reject(err);
                }
                return;
            }

            // Day object exists, ensure defaults

            try {
                await ensureDefaults(day);
            } catch (err) {
                reject(err);
                return;
            }

            // Chain populate queries
            let query = day;
            for (const complication of complications) {
                query = query.populate(`complications.${ complication.path }`);
            }

            query.populate((err, doc) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(doc);
            });
        });
    });
}

async function ensureDefaults(day) {
    return new Promise(async (resolve, reject) => {
        let changed = false;

        for (const complication of complications) {
            const path = complication.path;
            
            // Complication doesn't exist so we have to make it
            if (!day.hasOwnProperty('complications') || !day.complications.hasOwnProperty(path)) {
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