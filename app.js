/* Server */
var express = require('express'),
    path    = require('path'),
    argv    = require('optimist').argv,
    fs      = require('fs');

/* Config */
global.resetDb     = argv.resetDb || false;
global.localServer = argv.localServer || false;
global.localDb     = argv.localDb || false;
global.logging     = argv.logging || false;
global.appPort     = argv.port || 5000;
global.appRoot     = path.resolve(__dirname);
global.appVersion  = require('./package.json').version;
if (global.localServer)
    global.appHost = 'http://localhost:' + global.appPort;
else
    global.appHost = 'http://dreamyday.tk';

fs.writeFileSync('./swagger-ui/index.html',
    fs.readFileSync('./swagger-ui/index.txt', 'utf8')
      .replace('{swagger-startup-url}', global.appHost + '/api-docs'));

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
if (global.logging)
    app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors(corsOptions));

/* Swagger */
require('./swagger').attach(app);

var docsHandler = express.static(path.join(global.appRoot, 'swagger-ui'));
// get /docs
app.get(/^\/docs(\/.*)?$/, function (req, res, next) {
    if (req.url === '/docs') {
        res.writeHead(302, { 'Location' : req.url + '/' });
        res.end();
        return;
    }
    req.url = req.url.substr('/docs'.length);
    return docsHandler(req, res, next);
});

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static('views'));
// get /
app.get(/^\/?$/, function (req, res, next) {
    res.render("home");
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