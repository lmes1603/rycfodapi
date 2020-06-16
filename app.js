var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8081;

var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

var indexRouter = require('./routes/index');
var twilio = require('./routes/twilio');
//var dynamoRouter = require('./routes/dynamodb');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/twilio', twilio);
//app.use('/dynamodb', dynamoRouter);
const fs = require('fs');


module.exports = app;
