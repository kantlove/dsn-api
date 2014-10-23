var sw = require("../");
var param = require("../lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

exports.getFunction = {
  'spec': {
    path : "/api/getFunction",
    notes : "A sample GET function",
    summary : "Do nothing",
    method: "GET",    
    parameters : [param.query("param1", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
    nickname : "getFunction"
  },
  'action': function (req,res) {
    res.send('GET successful!');
  }
};

exports.postFunction = {
  'spec': {
    path : "/api/postFunction",
    notes : "A sample POST function",
    summary : "Do nothing",
    method: "POST",
    parameters : [param.body("param1", "Example param 1", "string")],
    responseMessages : [swe.invalid('param1')],
    nickname : "postFunction"
  },  
  'action': function(req, res) {
    res.send('POST successful!');
  }
};

exports.putFunction = {
  'spec': {
    path : "/api/putFunction",
    notes : "A sample PUT function",
    method: "PUT",    
    summary : "Do nothing",
    parameters : [param.body("param1", "Example param 1", "string")],
    responseMessages : [swe.invalid('param1')],
    nickname : "putFunction"
  },  
  'action': function(req, res) {
    res.send('PUT successful!');
  }
};

exports.deleteFunction = {
  'spec': {
    path : "/api/deleteFunction",
    notes : "Example DELETE function",
    method: "DELETE",
    summary : "Do nothing",
    parameters : [param.query("param1", "Example param 1", "string")],
    responseMessages : [swe.invalid('param1')],
    nickname : "deleteFunction" 
  },  
  'action': function(req, res) {
    res.send('DELETE successful!');
  }
};
