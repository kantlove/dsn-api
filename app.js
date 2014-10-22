/* Server */
var express = require('express'),
    http    = require('http'),
    path    = require('path'),
    argv    = require('optimist').argv;

/* Config */
var port = argv.port || 5000;

/* All environments */
var app = express();
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

/* Definition */

/* Version 1 */
app.all('/v1/*', function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	return next();
});

app.use('/v1', require('./controllers/v1/router'));

/* Create server */
app.listen(port, function () {
    console.log("Magic happens on port", port);
});