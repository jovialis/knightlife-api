const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');

module.exports = function() {
    // Setup google
    const WebUser = require(`${__basedir}/database/models/webuser`)

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://www.bbnknightlife.com/login/auth/google/callback"
    }, function(accessToken, refreshToken, profile, cb) {
        const profileId = profile.id;
        
        WebUser.findOne({
            gid: profileId
        }, { _id: 0 }, function(err, obj) {
            if (obj) {
                cb(null, obj);
                return;
            }
            
            const newUser = new WebUser({
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.picture,
                gid: profileId
            });

            newUser.save(function(error, object) {
                cb(error, object);
            });
        });
    }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.googleId);
    });

    passport.deserializeUser(function(id, done) {
        WebUser.findOne({
            googleId: id
        }, { _id: 0 }, function(err, user) {
            done(err, user);
        });
    });
}