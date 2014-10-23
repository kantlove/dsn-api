// ### Swagger Sample Application
//
// This is a sample application which uses the [swagger-node-express](https://github.com/wordnik/swagger-node-express)
// module.  The application is organized in the following manner:
//
// #### petResources.js
//
// All API methods for this petstore implementation live in this file and are added to the swagger middleware.
//
// #### models.js
//
// This contains all model definitions which are sent & received from the API methods.
//
// #### petData.js
//
// This is the sample implementation which deals with data for this application

// Include express and swagger in the application.
var express = require("express"), 
    url = require("url"), 
    cors = require("cors"), 
    app = express(), 
    swagger = require("../").createNew(app);

var petResources = require("./resources.js");

app.use(express.json());
app.use(express.urlencoded());

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
  .addGet(petResources.getFunction)
  .addPost(petResources.postFunction)
  .addPut(petResources.putFunction)
  .addDelete(petResources.deleteFunction);

swagger.configureDeclaration("user", {
  description : "Testing functions",
  authorizations : ["oauth2"],
  produces: ["application/json"]
});

// set api info
swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "This is a test Swagger application",
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
swagger.configure("http://localhost:8002", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/../swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

app.get('/throw/some/error', function(){
  throw {
    status: 500,
    message: 'we just threw an error for a test case!'
  };
});

app.use(function(err, req, res, next){
  res.send(err.status, err.message);
});

// Start the server on port 8002
app.listen(8002);
