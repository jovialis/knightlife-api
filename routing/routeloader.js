const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');

module.exports = function (app) {
    
    // Register GET
    app.get('/api/schedule', require('./routes/schedule/schedule'));
    app.get('/api/schedule/next', require('./routes/schedule/next-day'));
    app.get('/api/schedule/special', require('./routes/schedule/special'));
    app.get('/api/schedule/template', require('./routes/schedule/template'));
    
    app.get('/api/lunch', require('./routes/lunch/lunch'));
    app.get('/api/events', require('./routes/event/events'));
    
    app.get('/api/upcoming', require('./routes/upcoming/upcoming'));
    
    app.get('/api/survey', require('./routes/survey/survey'));

    // Setup POST decryption middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    // Register POST
    app.post('/api/push/refresh/events', loggedIn, require('./routes/push/refresh/events'));
    app.post('/api/push/refresh/lunch', loggedIn, require('./routes/push/refresh/lunch'));
    app.post('/api/push/refresh/schedule', loggedIn, require('./routes/push/refresh/schedule'));
    app.post('/api/push/message', loggedIn, require('./routes/push/message'));
    
    app.post('/api/device/register', require('./routes/device/registration'));
    
    // Setup Google Auth via passport
    app.use(passport.initialize());
    
    app.get('/login/auth/google', passport.authenticate('google', { scope: ['profile'] }));
    app.get('/login/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
    });
    
};

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}