var sw = require("../../swagger/");
var param = require("../lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

exports.createDream = {
  'spec': {
    path : "/dream/createDream",
    notes : "Create a new dream",
    summary : "create a new dream from data. Returns successful message or error.",
    method: "POST",    
    parameters : [param.body("param1", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
    nickname : "createDream"
  },
  'action': function (req,res) {
    res.send('Create new dream successful!');
  }
};

exports.updateDream = {
  'spec': {
    path : "/dream/updateDream",
    notes : "Update an existing dream",
    summary : "Update an existing dream. Returns successful message or error.",
    method: "PUT",    
    parameters : [param.query("param1", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
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
    path : "/dream/deleteDream",
    notes : "Delete an existing dream",
    summary : "Delete an existing dream",
    method: "DELETE",
    parameters : [param.query("param1", "Example param 1", "string")],
    responseMessages : [swe.invalid('param1')],
    nickname : "deleteDream" 
  },  
  'action': function(req, res) {
    res.send('Delete dream successful!');
  }
};
