var sw = require("../../swagger/");
var param = require("../lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

exports.signIn = {
  'spec': {
    path : "/auth/signin",
    notes : "Sign a user in",
    summary : "Signing in successfully will return a session object and userId",
    method: "POST",
    parameters : [param.body("username", "username", "string"), param.body("password", "encrypted password", "string")],
    responseMessages : [swe.invalid('username'), swe.invalid('password')],
    nickname : "signIn"
  },  
  'action': function(req, res) {
    res.send('Sign in successful!');
  }
};