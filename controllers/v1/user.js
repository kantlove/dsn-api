var db     = require('./database'),
    moment = require('moment');

// Models
var User = db.models.User;
var Session = db.models.Session;

module.exports = function (router) {
    // Register new user
    router.post('/user', function (req, res) {
    	User
    		.create(req.body)
			.success(function (user) {
				res.send('Success !');
    		})
    		.error(function (err) {
    			res.status(400).send(err);
    		});
    });

    // Get user details
    router.get('/user/:sessionId', function (req, res) {
    	console.log(sessionId);
    	send(200);
    });
}