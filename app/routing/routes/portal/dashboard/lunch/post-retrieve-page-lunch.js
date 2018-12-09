const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const deleteKey = require('key-del');

module.exports.register = (app) => {
    app.get('/dashboard/page/lunch/:year/:month/:day', async (req, res) => {
//        const token = req.body._a;

        try {
            const date = new Date(req.param('year'), req.param('month') - 1, req.param('day'));

//            const account = await require(`${ global.__interface }/portal/auth/auth-token`).validate(token); 
//
//            const hasPermission = await require(`${ global.__interface }/portal/account/account-modules`).hasModule(account, 'lunch');
//
//            if (!hasPermission) {
//                res.json({
//                    error: 'You do not have permission.',
//                    redirect: true
//                });
//                return;
//            }

            let complication = await require(`${ global.__interface }/day/retrieve-day`).retrieveComplication(date, 'lunch');

            deleteKey(complication, [ '_id' ], { copy: false });

            res.json({
                index: {
                    lunch: complication
                }
            });
        } catch (err) {
            console.log(err);

            res.status(500);

            // Account validation issue
            if (err.invalid) {
                res.json({
                    error: err.message,
                    redirect: true
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