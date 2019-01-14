const deleteKey = require('key-del');

module.exports.register = (app) => {
    app.get('/data/events/:year/:month/:day', async (req, res) => {
        let categories = req.query.categories;
        if (categories !== undefined) {
            categories = categories.split(',');
        } else {
            categories = [];
        }

        const year = req.param('year');
        const month = req.param('month') - 1;
        const day = req.param('day');

        const date = new Date(year, month, day);

        if (!date) {
            res.status(404);
            res.json({
                error: 'Invalid date provided.'
            });
            return;
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
        
        try {
            let events = await require(`${ global.__interface }/events/events`).retrieveEvents(date, categories, filters);
            events = events.map(event => event.toObject());

            deleteKey(events, ['__v', '_id', 'calendarRaw', '__t', 'teamId'], { copy: false });

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