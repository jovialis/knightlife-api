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

            try { 
                // Need to create a Day object
                if (!day) {
                    day = await Day.create({
                        date: date
                    });
                }

                // Day object exists, ensure defaults
                await ensureDefaults(day);

                // Populate complications
                for (const complication of complications) {
                    await populateComplication(day, complication);
                }

                resolve(day);
            } catch (err) {
                reject(err);
                return;
            }
        });
    });
}

module.exports.retrieveComplication = (date, desiredComplication) => {
    return new Promise(async (resolve, reject) => {
        for (const complication of complications) {
            if (complication.path === desiredComplication) {
                const Day = mongoose.model('Day');

                Day.findOne({
                    date: date
                }, async (err, day) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    try {
                        if (!day) {
                            day = await Day.create({
                                date: date
                            });
                        }

                        let changed = await ensureDefault(day, complication);

                        if (changed) {
                            await day.save();
                        }

                        resolve(await populateComplication(day, complication));
                    } catch (err) {
                        reject(err);
                    }
                });
                return;
            }
        }
        reject('Invalid complication name.');
    });
}

async function ensureDefaults(day) {
    return new Promise(async (resolve, reject) => {
        let changed = false;

        for (const complication of complications) {
            changed = await ensureDefault(day, complication);
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

async function ensureDefault(day, complication) {
    return new Promise(async (resolve, reject) => {
        const path = complication.path;

        // Complication doesn't exist so we have to make it
        if (day.complications === undefined || day.complications[path] === undefined) {
            try {
                const document = await complication.create(day);
                const docId = document._id;

                day.complications[path] = docId;

                resolve(true);
                return;
            } catch (err) {
                reject(err);
                return;
            }
        }
        resolve(false);
    });
}

async function populateComplication(day, complication) {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.model(complication.model).populate(day, {
                path: `complications.${ complication.path }`,
                model: complication.model
            });

            if (complication.populate !== undefined) {
                await complication.populate(`complications.${ complication.path }.`, day);
            }

            resolve(day.complications[complication.path]);
        } catch (err) {
            reject(err);
            return;
        }
    });
}