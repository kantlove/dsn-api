var sw      = require("../../swagger/"), 
    param   = require("../lib/paramTypes.js"), 
    url     = require("url"),
    methods = require(appRoot + '/controllers/v1/dream.js');
var swe = sw.errors;

exports.createDream = {
    'spec': {
        path : "/dream",
        notes : "Create a new dream",
        summary : "create a new dream from data. Returns successful message or error.",
        method: "POST",    
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("text", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('text')],
        nickname : "createDream"
    },
    'action': function (req,res) {
        res.send('Create new dream successful!');
    }
};

exports.updateDream = {
    'spec': {
        path : "/dream",
        notes : "Update an existing dream",
        summary : "Update an existing dream. Returns successful message or error.",
        method: "PUT",    
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("dreamId", "", "string", true),
                      param.query("text", "", "string", true)],
        type : "string",
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('dreamId'),
                            swe.notFound('text')],
        nickname : "updateDream"
    },
    'action': function (req,res) {
        res.send('Update dream successful!');
    }
};

exports.comment = {
    'spec': {
        path : "/dream/comment",
        notes : "Add comment to a dream",
        summary : "Add comment to a dream",
        method: "POST",
        parameters : [param.body("param1", "Example param 1", "string")],
        responseMessages : [swe.invalid('param1')],
        nickname : "comment"
    },  
    'action': function(req, res) {
        res.send('Comment successful!');
    }
};

exports.deleteDream = {
    'spec': {
        path : "/dream",
        notes : "Delete an existing dream",
        summary : "Delete an existing dream",
        method: "DELETE",
        parameters : [param.query("sessionId", "", "string", true),
                      param.query("dreamId", "", "string", true)],
        responseMessages : [swe.notFound('sessionId'),
                            swe.notFound('dreamId')],
        nickname : "deleteDream" 
    },  
    'action': function(req, res) {
        res.send('Delete dream successful!');
    }
};
