const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
function create(req, res, next) {
  const payload = req.body;

  //validate payload
  _validateCreatePayload(payload, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(payload.password, salt, (err, hash) => {
        if (err) throw err;
        UserModel.find({ email: payload.email })
          .then((foundUser) => {
            if (foundUser.length) {
              const errorObj = {
                error: 'User already exists!',
                statusCode: 409
              };
              return Promise.reject('User alreay exists')
            }
          }
          )
          .then(() => {
            const userObj = new UserModel({
              name: payload.name,
              email: payload.email,
              password: hash,
            });
            userObj.save((err, savedRecord) => {
              if (err) {
                const errorObj = {
                  error: err.message,
                  statusCode: 500
                };
                return next(errorObj);
              }

              res.setHeader('Content-type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(savedRecord))
            });
          })
          .catch((err) => {
            res.status(500).send({ error: err || "Error while register, try again." });
          })
      })

    })
  })


};

module.exports = {
  create
};

function _validateCreatePayload(payload, callback) {
  if (!payload.name) {
    const errorObj = {
      message: 'The first name is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  if (!payload.email) {
    const errorObj = {
      message: 'email is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }

  if (!payload.password) {
    const errorObj = {
      message: 'password is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }


  return callback();
}