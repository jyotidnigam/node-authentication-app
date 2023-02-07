const gameDetailService = require('../Service/gameDetailService');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (app) => {
  // Create a Game
  app.post('/create-game', (req, res, next) => {

    gameDetailService.uploadGameJson(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });
  // GET GAMES BY USER
  app.post('/games', (req, res, next) => {
    gameDetailService.getGamesByUserId(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });

  // GET GAME BY ID
  app.post('/gameById', (req, res, next) => {
    gameDetailService.getGameById(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });

  // GAME ALL
  app.get('/games', (req, res, next) => {

    gameDetailService.fetchAllGames(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });

  // DELETE GAME
  app.post('/delete/game', (req, res, next) => {

    gameDetailService.deleteGame(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });

  app.post('/update/game', (req, res, next) => {
    gameDetailService.updateGameJson(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  });
};