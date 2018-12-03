module.exports.register = (app) => {
    app.get('/login/google', (req, res) => {
        const url = require(`${ __basedir }/app/google/google-loader`).urlGoogle();
        res.redirect(url);
    });
}