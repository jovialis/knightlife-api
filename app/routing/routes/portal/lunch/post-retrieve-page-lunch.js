const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports.register = (app) => {
    app.post('/dashboard/page/home', async (req, res) => {
        const token = req.body._a;

        try {
            const account = await require(`${ global.__interface }/auth/validate-token`).validate(token); 

            const overview = await require(`${ global.__interface }/account/retrieve-account-overview`).retrieve(account);

            const modules = await require(`${ global.__interface }/modules/modules`).retrieveUserModules(account);

            res.json({
                index: {
                    overview: overview,
                    modules: modules
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