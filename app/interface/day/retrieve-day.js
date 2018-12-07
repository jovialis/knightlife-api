const mongoose = require('mongoose')

const complications = [
    './complications/complication-schedule',
    './complications/complication-lunch'
];

module.exports.retrieve = (date) => {
    return new Promise(async (resolve, reject) => {
        const Day = mongoose.model('Day')

        Day.findOne({
            date: date
        }, { _id: false }, async (err, day) => {
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
            for (const path of complications) {
                query = query.populate(`complications.${ require(path) }`);
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

function ensureDefaults(day) {
    return Promise(async (resolve, reject) => {
        let changed = false;

        for (const path of complications) {
            const complication = require(path);

            const path = complication.path;

            // Complication doesn't exist so we have to make it
            if (!(path in day.complications)) {
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