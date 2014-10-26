var sw      = require("../../swagger/"), 
    param   = require("../lib/paramTypes.js"), 
    url     = require("url"),
    methods = require(appRoot + '/controllers/v1/user.js')
var swe = sw.errors;

exports.getUserInfo = {
    'spec': {
        path : "/user",
        notes : "Get user info",
        summary : "Search a user by userId and return info",
        method: "GET",    
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("userId", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound("sessionId"),
                            swe.notFound("userId")],
        nickname : "getUserInfo"
    },
    'action': function (req,res) {
        res.send('Get user info successful!');
    }
};

exports.register = {
    'spec': {
        path : "/user",
        notes : "Register a new user",
        summary : "Create a new user from data passed from client",
        method: "POST",    
        parameters : [param.body("username", "", "string", true),
                      param.body("password", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('username'),
                            swe.notFound('password')],
        nickname : "register"
    },
    'action': function (req,res) {
        res.send('Register new user successful!');
    }
};