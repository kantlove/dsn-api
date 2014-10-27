/* Server */
var express = require('express'),
    path    = require('path'),
    argv    = require('optimist').argv;

/* Config */
global.appPort    = argv.port || 5000;
global.appHost    = "http://localhost:" + global.appPort;
global.appVersion = require('./package.json').version;
global.appRoot    = path.resolve(__dirname);

var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    }
}

/* Create server */
var cors           = require('cors');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors(corsOptions));

/* Swagger */
require('./swagger').attach(app);

var docsHandler = express.static(path.join(global.appRoot, 'swagger-ui'));
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') {
        res.writeHead(302, { 'Location' : req.url + '/' });
        res.end();
        return;
    }
    req.url = req.url.substr('/docs'.length);
    return docsHandler(req, res, next);
});

/* Start server */
app.listen(global.appPort, function () {
    console.log();
    console.log('\t\t\t\t ▄▀ ▄▀');
    console.log('\t\t\t\t  ▀  ▀');
    console.log('\t\t\t\t█▀▀▀▀▀█▄');
    console.log('\t\t\t\t█░░░░░█─█');
    console.log('\t\t\t\t▀▄▄▄▄▄▀▀');
    console.log();
    console.log("\t\t\tMagic happens on port", global.appPort);
});