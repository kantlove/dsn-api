var sw = require("../../swagger/");
var param = require("../lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

exports.createAchievement = {
  'spec': {
    path : "/achievement/createAchievement",
    notes : "Create a new achievement",
    summary : "create a new achievement from data. Returns successful message or error.",
    method: "POST",    
    parameters : [param.body("param1", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
    nickname : "createAchievement"
  },
  'action': function (req,res) {
    res.send('Create new achievement successful!');
  }
};

exports.updateAchievement = {
  'spec': {
    path : "/achievement/updateAchievement",
    notes : "Update an existing achievement",
    summary : "Update an existing achievement. Returns successful message or error.",
    method: "PUT",    
    parameters : [param.query("param1", "Example param 1", "string", true)],
    type : "string",
    responseMessages : [swe.notFound('param1')],
    nickname : "updateAchievement"
  },
  'action': function (req,res) {
    res.send('Update achievement successful!');
  }
};

exports.deleteAchievement = {
  'spec': {
    path : "/achievement/deleteAchievement",
    notes : "Delete an existing achievement",
    summary : "Delete an existing achievement",
    method: "DELETE",
    parameters : [param.query("param1", "Example param 1", "string")],
    responseMessages : [swe.invalid('param1')],
    nickname : "deleteAchievement" 
  },  
  'action': function(req, res) {
    res.send('Delete achievement successful!');
  }
};
