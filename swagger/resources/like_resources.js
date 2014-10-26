var sw      = require("../../swagger/"), 
    param   = require("../lib/paramTypes.js"), 
    url     = require("url"),
    methods = require(appRoot + '/controllers/v1/like.js');
var swe = sw.errors;

exports.likeDream = {
    'spec': {
        path : "/like/dream",
        notes : "Like or Unlike a dream",
        summary : "Like and unlike",
        method: "POST",    
        parameters : [param.body("sessionId", "", "string", true), 
                      param.body("dreamId", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'), 
                            swe.notFound('dreamId'),
                            swe.invalid('sessionId')],
        nickname : "likeDream"
    },
    'action': function (req,res) {
        res.send('Like dream successful!');
    }
};

exports.likeAchievement = {
    'spec': {
        path : "/like/achievement",
        notes : "Like or Unlike an achievement",
        summary : "Like and unlike",
        method: "POST",    
        parameters : [param.body("sessionId", "", "string", true), 
                      param.body("achievementId", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'), 
                            swe.notFound('achievementId'),
                            swe.invalid('sessionId')],
        nickname : "likeAchievement"
    },
    'action': function (req,res) {
        res.send('Like achievementId successful!');
    }
};
