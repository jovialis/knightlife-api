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
            const outline = await require(`${ global.__interface }/day/retrieve-day`).retrieve(date);
            
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