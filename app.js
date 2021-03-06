const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
//
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


// if not work with config =>
const mongoURL = 'mongodb://localhost:27017/parasiro';
mongoose.connect(mongoURL).then(function() { console.log("mongoose conected"); }).catch(function(err) { console.log(err) });
//mongo conected

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 
//session
app.use(
    session({
        key: "userSeed",
        secret: "Secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 1
        },
    })
);
app.use("/", routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;