const mongoose = require('mongoose');

const redis = require(`${ __redis }`);
const redisGet = require('util').promisify(redis.get).bind(redis);

const dynamicEventCategories = [
    require('./categories/sports'),
    require('./categories/arts'),
    require('./categories/school-all'),
    require('./categories/school-upper')
];

// Filter by date, category, filters

// All upcoming events
module.exports.retrieveUpcomingEvents = async (date, categories, filters) => {
    return new Promise(async (resolve, reject) => {
        const Event = mongoose.model('Event');

        let query = {
            date: {
                $gte: date
            },
            hidden: false,
            ...filters
        };
        
        if (categories.length > 0) {
            query.categories = {
                $in: categories
            };
        }
        
        try {
            const events = await Event.find(query);
            resolve(events);

            // Fetch event updates.
            attemptFetchEventUpdates();
        } catch (err) {
            reject(err);
            return;
        }
    });    
}

// Events on a given day
module.exports.retrieveEvents = async (date, categories, filters) => {
    return new Promise(async (resolve, reject) => {
        const Event = mongoose.model('Event');

        let query = {
            date: date,
            hidden: false,
            ...filters
        };

        if (categories.length > 0) {
            query.categories = {
                $in: categories
            };
        }

        try {
            const events = await Event.find(query);
            resolve(events);

            attemptFetchEventUpdates();
        } catch (err) {
            reject(err);
            return;
        }
    });    
}

async function attemptFetchEventUpdates() {
    const start = new Date();

//    console.log('Fetching remote events.');

    try {
        const categoryStart = new Date();

        for (const category of dynamicEventCategories) {
            // Doesn't need to be fetched because it doesn't support remote items.
            if (!category.remote) {
                continue;
            }
            
            // Check if category has been cached or recently checked
            const redisCheck = await redisGet(`events-${ category.name }-refresh-global`);
//            const redisCheck = null;
            
            if (redisCheck === null) {
                // 16 hours
                redis.set(`events-${ category.name }-refresh-global`, 'ye boi', 'EX', category.refreshDelay);

                console.log(`Fetching up-to-date events for category ${ category.name }.`);
                const categoryStart = new Date();

                await category.fetchUpdates();

                console.log(`Updated category ${ category.name } in ${ new Date() - categoryStart }ms`);
            } else {
//                console.log(`Event category ${ category.name } has been updated recently. Ignoring.`);
            }
        }        
    } catch (err) {
        console.log(err);
    }

//    console.log(`Fetched all remote events in ${ new Date() - start }ms`)
}