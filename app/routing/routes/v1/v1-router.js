module.exports.register = function(app) {
    app.get('/api/schedule', require('./schedule/schedule'));
    app.get('/api/schedule/next', require('./schedule/next-day'));
    app.get('/api/schedule/special', require('./schedule/special'));
    app.get('/api/schedule/template', require('./schedule/template'));

    app.get('/api/lunch', require('./lunch/lunch'));
    app.get('/api/events', require('./event/events'));

    app.get('/api/upcoming', require('./upcoming/upcoming'));

    app.get('/api/survey', require('./survey/survey'));

    app.post('/api/device/register', require('./device/registration'));
}