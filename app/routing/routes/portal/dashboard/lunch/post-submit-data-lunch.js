const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports = function(app) {
    app.post('/restricted/edit/:year/:month/:day/lunch', (req, res) => {
        const token = req.body.token;
        const secret = process.env.SESSION_SECRET;
        
        const payload = req.body.payload;
        
        if (!token) {
            res.status(400);
            res.json({ 'error': 'No session token provided.' });
            
            return;
        }
        
        // Verify client token
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                res.status(401);
                res.json({ 'error': error });
                
                return;
            }
            
            // No error, so it was a valid token. Now we get into the meat.
            const year = req.param('year');
            const month = req.param('month');
            const day = req.param('day');
            
            const date = new Date(year, month - 1, day);
            if (!date) {
                res.status(400);
                res.json({ 'error': 'Invalid date supplied.' });
                
                return;
            }
            
            const DayOutline = mongoose.model('DayOutline');
            DayOutline.findOne({
                'legend.date': date
            }, (error, outline) => {
                const lunchId = outline.content.lunch;
                
                const DayLunch = mongoose.model('DayLunch');
                DayLunch.findByIdAndUpdate(lunchId, { 
                    content: payload 
                }, (error) => {
                    
                });
            });
            
            
            
            // TODO: Get Day file, get its Lunch file.
        });
    });
}