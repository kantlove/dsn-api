
var express = require("express"), 
    url = require("url"), 
    router = express.Router(),
    swagger = require("../swagger").createNew(router);

var resources = require("./resources.js");


// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `special-key`.  All other HTTP ops are A-OK
swagger.addValidator(
  function validate(req, path, httpMethod) {
    return true;
  }
);

var models = require("./models.js");

// Add models and methods to swagger
swagger.addModels(models)
  .addGet(resources.getFunction)
  .addPost(resources.postFunction)
  .addPut(resources.putFunction)
  .addDelete(resources.deleteFunction);

swagger.configureDeclaration("user", {
  description : "Testing functions",
  authorizations : ["oauth2"],
  produces: ["application/json"]
});

// set api info
swagger.setApiInfo({
  title: "DSN API",
  description: "API Document for DSN",
  termsOfServiceUrl: "http://helloreverb.com/terms/",
  contact: "minhthai40@gmail.com",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
//swagger.configure("http://localhost:8002", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui/');
router.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/docs/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

router.use(function(err, req, res, next){
  res.send(err.status, err.message);
});

// Start the server on port 8002
module.exports = router;
