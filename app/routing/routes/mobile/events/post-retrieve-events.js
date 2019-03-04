const deleteKey = require('key-del');

module.exports.register = (app) => {
    app.get('/m/d/events', async (req, res) => {
        let categories = req.query.categories;
        if (categories !== undefined) {
            categories = categories.split(',');
        } else {
            categories = [];
        }

        let rawFilters = req.query.filters;
        let filters = {};
        
        if (rawFilters !== undefined) {
            try {
                rawFilters = rawFilters.split(',');
                rawFilters.forEach(filter => {
                    const split = filter.split(':');
                    
                    if (!isNaN(split[1])) {
                        split[1] = parseInt(split[1]);
                    }
                    
                    filters[split[0]] = split[1];
                });
            } catch (err) {
                console.log(err);

                res.status(500);
                res.json({
                    error: 'Invalid filter format.'
                });
                return;
            }
        } else {
            rawFilters = [];
        }
        
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        try {
            let events = await require(`${ global.__interface }/events/events`).retrieveUpcomingEvents(date, categories, filters);
            events = events.map(event => event.toObject());

            deleteKey(events, ['__v', '_id', 'calendarRaw', '__t', 'teamId', 'hidden'], { copy: false });

            res.json({
                index: events
            });
        } catch (err) {
            console.log(err);

            res.status(500);

            res.json({
                error: 'An internal error occurred.'
            });
        }
    });
}