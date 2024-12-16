require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug the JWT secret

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const apiRouter = require('./app_api/routes/index');
const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');

const handlebars = require('hbs');

// Bring in the DB & Auth
require('./app_api/models/db');
require('./app_api/config/passport');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // Allow requests from Angular app
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true'); // Optional: if cookies or auth headers are sent
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight requests
  }
  next();
});

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));

// Register handlebars partials (https://www.npmjs.com/package/hbs)
handlebars.registerPartials(__dirname + '/app_server/views/partials');

app.set('view engine', 'hbs');

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Wire up routes to the controllers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Catch unauthorized user error and create 401
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ "message": err.name + ": " + err.message });
  }
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
