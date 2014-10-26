var sw      = require('../../swagger/'),
    param   = require('../lib/paramTypes.js'),
    url     = require('url'),
    methods = require(appRoot + '/controllers/v1/auth.js');
var swe = sw.errors;

exports.signIn = {
    'spec': {
        path : "/auth",
        notes : "Sign a user in",
        summary : "Signing in successfully will return a session object and userId",
        method: "POST",
        parameters : [param.body("username", "", "string"), param.body("password", "encrypted password", "string")],
        responseMessages : [swe.invalid('username'), 
                            swe.invalid('password')],
        nickname : "signIn"
    },  
    'action': function(req, res) {

        res.send('Sign in successful!');
    }
};