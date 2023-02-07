module.exports = (app) => {
  require('./authController')(app);
  require('./gameDetailController')(app);
}