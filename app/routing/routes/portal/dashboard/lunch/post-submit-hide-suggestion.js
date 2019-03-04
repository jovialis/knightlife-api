const deleteKey = require('key-del');

module.exports.register = (app) => {
    app.post('/p/page/lunch/food/suggest/do/hide', async (req, res) => {
        const token = req.body._a;
        const badge = req.body.badge;

        try {
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

            const success = await require(`${ global.__interface }/day/complications/lunch/complication-lunch`).hideSuggestion(badge);

            res.json({
                index: {
                    success: success
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
}