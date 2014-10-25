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
				res.send('Success!');
    		})
    		.error(function (err) {
    			res.status(400).send(err);
    		});
    });

    // Get user details
    // /user?sessionId=NUM&userId=NUM
    router.get('/user', function (req, res) {
    	if (!req.query.sessionId) {
    		res.status(400).send('sessionId missing!');
    	} else if (!req.query.userId) {
    		res.status(400).send('userId missing!');
    	} else {
	    	User
				.find({ where: { id: req.query.userId }})
				.success(function (user) {
                    if (!user) {
                        res.status(400).send('Invalid user!');
                    } else {
					   res.status(200).send(user.values);
                    }
				})
				.error(function (err) {
					res.status(400).send(err);
				});
		}
    });
}