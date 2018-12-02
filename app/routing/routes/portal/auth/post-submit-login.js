const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports.register = (app) => {
    app.post('/dashboard/do/auth/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        try {
            const account = await require(`${ global.__interface }/auth/validate-login`).validate(username, password); 
            const token = require(`${ global.__interface }/auth/generate-token`).generate(account);

            res.json({
                index: {
                    _a: token 
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