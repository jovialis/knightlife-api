const mongoose = require('mongoose');

module.exports.register = (app) => {
    app.post('/dashboard/do/auth/login/google/login', async (req, res) => {
        try {
            const code = req.body.code;

            const account = await require(`${ global.__interface }/auth/validate-google-login`).validate(code); 
            const token = require(`${ global.__interface }/auth/generate-token`).generate(account);

            res.json({
                index: {
                    _a: token 
                }
            });
        } catch (err) {
            res.status(500);
            res.json({
                error: 'An internal error occurred.'
            });
        }
    });
};