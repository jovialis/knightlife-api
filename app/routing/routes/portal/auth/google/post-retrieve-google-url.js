module.exports.register = (app) => {
    app.post('/dashboard/do/auth/login/google', (req, res) => {
        const url = require(`${ __basedir }/app/google/google-loader`).urlGoogle();
        
        res.json({
            index: {
                redirect: url
            }
        });
    });
}