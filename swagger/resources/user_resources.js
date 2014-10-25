var sw = require("../../swagger/");
var param = require("../lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

exports.getUserInfo = {
  'spec': {
    path : "/user/getUserInfo",
    notes : "Get user info",
    summary : "Search a user by userId and return info",
    method: "GET",    
    parameters : [param.query("userId", "Id of target User", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('userId')],
    nickname : "getUserInfo"
  },
  'action': function (req,res) {
    res.send('Get user info successful!');
  }
};

exports.register = {
  'spec': {
    path : "/user/register",
    notes : "Register a new user",
    summary : "Create a new user from data passed from client",
    method: "POST",    
    parameters : [param.body("username", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
    nickname : "register"
  },
  'action': function (req,res) {
    res.send('Register new user successful!');
  }
};