module.exports.register = (app) => {
    app.get('/api/data/digest/:year/:month/:day', async (req, res) => {
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
        
        try {
            let outline = await require(`${ global.__interface }/day/retrieve-day`).retrieve(date);
            await require(`${ __basedir }/app/utils/sanitize-keys`).sanitize(outline, [ '_id', '__v' ]);
            
            res.json({
                index: outline
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