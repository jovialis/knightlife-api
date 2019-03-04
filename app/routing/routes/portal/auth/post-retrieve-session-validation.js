const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports.register = (app) => {
    app.post('/p/do/auth/session/validate', async (req, res) => {
        const token = req.body._a;

        try {
            const account = await require(`${ global.__interface }/portal/auth/auth-token`).validate(token); 

            res.json({
                index: {
                    valid: true
                }
            });
        } catch (err) {
            console.log(err);
            
            res.status(500);

            // Account validation issue
            if (err.invalid) {
                res.json({
                    error: err.message
                });
                return;
            }

            // Other internal error
            res.json({
                error: 'An internal error occurred.'
            });
        }
    });
};