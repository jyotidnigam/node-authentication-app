const AuthService = require('../Service/authService');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (app) => {
  // create a user
  app.post('/register', (req, res, next) => {

    AuthService.create(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(400).json({ error: err })
      if (!user) return res.status(400).json({ error: 'No user found' })
      req.logIn(user, () => {
        if (err) return res.status(400).json({ error: err })
        const token = JWT.sign(user._doc, config.jwtSecret, {
          expiresIn: config.jwtExpiresIn
        });
        delete user.password;
        return res.status(200).json({ user, token })
      })
    })(req, res, next);
  });
};