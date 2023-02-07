const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('./passport/setup');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

const app = express();

const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

require('./controller')(app);

app.use((err, req, res, next) => {
  if (err) {
    res.setHeader('Content-type', 'application/json');
    res.statusCode = err.statusCode;
    res.end(JSON.stringify({ message: err.message }));
  }
});

app.listen(process.env.PORT || PORT, () => {
  mongoose.connect('mongodb+srv://admin:Jyotid123@cluster0.gnbsm.mongodb.net/pwa-db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

  console.log(`The server has been started at port ${process.env.PORT || PORT} `);
});