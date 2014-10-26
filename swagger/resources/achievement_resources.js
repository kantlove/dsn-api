var sw      = require("../../swagger/"), 
    param   = require("../lib/paramTypes.js"), 
    url     = require("url"),
    methods = require(appRoot + '/controllers/v1/achievement.js')
var swe = sw.errors;

exports.createAchievement = {
    'spec': {
        path : "/achievement",
        notes : "Create a new achievement",
        summary : "create a new achievement from data.",
        method: "POST",    
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("dreamId", "", "string", true),
                      param.query("text", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('dreamId'),
                            swe.notFound('text')],
        nickname : "createAchievement"
    },
    'action': function (req,res) {
        res.send('Create new achievement successful!');
    }
};

exports.updateAchievement = {
    'spec': {
        path : "/achievement",
        notes : "Update an existing achievement",
        summary : "Update an existing achievement. Returns successful message or error.",
        method: "PUT",    
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("achievementId", "", "string", true),
                      param.query("text", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('achievementId'),
                            swe.notFound('text')],
        nickname : "updateAchievement"
    },
    'action': function (req,res) {
        res.send('Update achievement successful!');
    }
};

exports.deleteAchievement = {
    'spec': {
        path : "/achievement",
        notes : "Delete an existing achievement",
        summary : "Delete an existing achievement",
        method: "DELETE",
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("achievementId", "", "string", true)],
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('achievementId')],
        nickname : "deleteAchievement" 
    },  
    'action': function(req, res) {
        res.send('Delete achievement successful!');
    }
};
