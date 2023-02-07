const GameDetailModal = require('../models/GameDetail');
const UserModal = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const GameDetailModel = require('../models/GameDetail');
function uploadGameJson(req, res, next) {
  const payload = { ...req.body, file: req.files.file.data.toString() };

  //validate payload
  _validateUploadGameJsonPayload(payload, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    UserModal.findById(payload.user)
      .then((foundUser) => {
        if (!foundUser) {
          const errorObj = {
            error: 'Unauthorized action',
            statusCode: 401
          };
          return Promise.reject('Cannot process this request, user not found')
        }
        else return foundUser
      }
      )
      .then((user) => {

        const gameObj = new GameDetailModal({
          user: user._id,
          gameJson: payload.file,
          gameName: payload.gameName,
          gameSlug: uuidv4()
        });
        gameObj.save((err, savedRecord) => {
          if (err) {
            const errorObj = {
              error: err.message,
              statusCode: err.status
            };
            return next(errorObj);
          }
          res.status(201).send(JSON.stringify(savedRecord));

          // res.setHeader('Content-type', 'application/json');
          // res.statusCode = 201;
          // res.end(JSON.stringify(savedRecord))
        });
      })
      .catch((err) => {
        res.status(err.status).send({ error: err || "Error while creating game, try again." });
      })
  })
};

function getGamesByUserId(req, res, next) {
  //validate payload
  _validateGameDetailPayload(req.body.id, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    UserModal.findById(req.body.id)
      .then((foundUser) => {
        if (!foundUser) {
          const errorObj = {
            error: 'User not found',
            statusCode: 401
          };
          return Promise.reject('Cannot process this request, user not found')
        }
        else return foundUser
      })
      .then((user, err) => {
        GameDetailModal.find({ user: req.body.id }, (err, games) => {
          if (err) {
            const errorObj = {
              error: err.message,
              statusCode: 500
            };
            return next(errorObj);
          }
          res.setHeader('Content-type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(games))
        })
      })
      .catch((err) => {
        res.status(500).send({ error: err || "Error while fetching game, try again." });
      })
  })

};

function getGameById(req, res, next) {
  //validate payload
  _validateGameDetailPayload(req.body.id, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    GameDetailModel.find({ gameSlug: req.body.id })
      .then((game, err) => {
        if (err) {
          const errorObj = {
            error: err.message,
            statusCode: 500
          };
          return next(errorObj);
        }
        res.setHeader('Content-type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(game[0]))
      })
      .catch((err) => {
        res.status(500).send({ error: err || "Error while fetching game, try again." });
      })

  })

};

function fetchAllGames(req, res, next) {
  GameDetailModel.find({})
    .then((games, err) => {
      if (err) {
        const errorObj = {
          error: err.message,
          statusCode: 500
        };
        return next(errorObj);
      }
      res.setHeader('Content-type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(games))
    })
    .catch((err) => {
      res.status(500).send({ error: err || "Error while fetching game, try again." });
    })
};

function deleteGame(req, res, next) {
  GameDetailModel.deleteOne({ gameSlug: req.body.id })
    .then((games, err) => {
      if (err) {
        const errorObj = {
          error: err.message,
          statusCode: 500
        };
        return next(errorObj);
      }
      res.setHeader('Content-type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(games))
    })
    .catch((err) => {
      res.status(500).send({ error: err || "Error while fetching game, try again." });
    })
};

function updateGameJson(req, res, next) {
  const payload = { ...req.body, file: req.files.file.data.toString() };
  _validateUploadGameJsonPayload(payload, (validationErr) => {
    if (validationErr) {
      return next(validationErr);
    }
    GameDetailModal.findById(payload.id)
      .then((foundGame) => {
        if (!foundGame) {

          return Promise.reject('Cannot process this request, game not found')
        }
        else return foundGame
      }
      )
      .then((game) => {
        game.gameName = payload.gameName;
        game.gameJson = payload.file;
        game.save((err, savedRecord) => {
          res.status(201).send(JSON.stringify(savedRecord));
        });
      })
      .catch((err) => {
        res.status(500).send({ error: err || "Error while creating game, try again." });
      })
  })
}

module.exports = {
  uploadGameJson,
  getGamesByUserId,
  getGameById,
  fetchAllGames,
  deleteGame,
  updateGameJson
};

function _validateUploadGameJsonPayload(payload, callback) {
  if (!payload.user) {
    const errorObj = {
      message: 'The user is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  if (!payload.file) {
    const errorObj = {
      message: 'json file is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  if (!payload.gameName) {
    const errorObj = {
      message: 'gameName is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }
  return callback();
}

function _validateGameDetailPayload(payload, callback) {
  if (!payload) {
    const errorObj = {
      message: 'The user id is missing',
      statusCode: 400
    };
    return callback(errorObj);
  }

  return callback();
}