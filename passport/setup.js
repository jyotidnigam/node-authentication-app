
const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
// const jwt=require('jsonwebtoken');
//checking for security through passport strategy

passport.serializeUser((user, done) => {
    console.log("In serialize ==>", user.token);
    return done(null, user.token);
});

passport.deserializeUser((user, done) => {
    return done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const newUser = new User({ email, password })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then((user) => {
                            return done(null, user)
                        }).catch((err) => {
                            return done(null, false, { message: err })
                        })
                    })
                })
            }
            else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) return done(null, user);
                    else return done(null, false, { message: 'wrong password' })
                })
            }
        }).catch((err) => {
            return done(null, false, { message: err })
        })
}))

module.exports = passport;