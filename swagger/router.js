
var express = require("express"), 
    url = require("url"), 
    router = express.Router(),
    swagger = require("../swagger").createNew(router);

var models = require("./models/models.js");

var userRs          = require('./resources/user_resources.js'),
    authRs          = require('./resources/auth_resources.js'),
    dreamRs         = require('./resources/dream_resources.js'),
    achievementRs   = require('./resources/achievement_resources.js');

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `special-key`.  All other HTTP ops are A-OK
swagger.addValidator(
    function validate(req, path, httpMethod) {
        return true;
    }
);

// Add models and methods to swagger
swagger.addModels(models)
.addPost(authRs.signIn)
.addGet(userRs.getUserInfo).addPost(userRs.register)
.addPost(dreamRs.createDream).addPut(dreamRs.updateDream).addPost(dreamRs.comment).addDelete(dreamRs.deleteDream)
.addPost(achievementRs.createAchievement).addPut(achievementRs.updateAchievement).addDelete(achievementRs.deleteAchievement);

// set api info
swagger.setApiInfo({
    title: "Dream Social Network API Documentation",
    description: "API Document for Dream Social Network",
});

swagger.setAuthorizations({
    apiKey: {
        type: "apiKey",
        passAs: "header"
    }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://localhost:5000", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui/');

router.get(/^\/docs(\/.*)?$/, function(req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
        res.writeHead(302, { 'Location' : req.url + '/docs/' });
        res.end();
        return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr(5);
    return docs_handler(req, res, next);
});

router.use(function(err, req, res, next){
    res.send(err.status, err.message);
});

// Start the server on port 8002
module.exports = router;
