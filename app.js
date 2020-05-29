const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/config');


const app = express();

// handle mongoose collection.ensureIndex warn
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//create mongodb connection
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});


//Declare a constiable for API route
const api = require('./routes/api');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// init passport
app.use(passport.initialize());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  
  res.status(err.status).json(err.msgEn)
});

module.exports = app;
