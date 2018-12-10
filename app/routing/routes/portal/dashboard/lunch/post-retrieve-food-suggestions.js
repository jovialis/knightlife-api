module.exports.register = (app) => {
    app.get('/dashboard/page/lunch/food/suggest', async (req, res) => {
//        const token = req.body._a;
//        const text = req.body.text;
        const text = req.param('text')

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

            const items = await require(`${ global.__interface }/day/complications/lunch/complication-lunch`).suggestFood(text);
            
            res.json({
                index: {
                    items: items
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