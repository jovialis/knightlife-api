const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');

module.exports = function() {
    // Setup google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://www.bbnknightlife.com/login/auth/google/callback"
    }, function(accessToken, refreshToken, profile, cb) {
        const WebUser = require(`${__basedir}/database/models/webuser`)

        const newUser = new WebUser({
            googleId: profile.id
        });
        
        newUser.save(function(error, object) {
            cb(error, object);
        });
    }));
}