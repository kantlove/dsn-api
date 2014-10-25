var db     	  = require('./database'),
	sequelize = require('sequelize'),
	moment    = require('moment');

// Models
var User = db.models.User;
var Session = db.models.Session;

module.exports = function (router) {
	// Create a new session
	router.post('/auth', function (req, res) {
		User
			.find({
				where: sequelize.and({ password: req.body.password },
					sequelize.or(
						{ email: req.body.email },
						{ username: req.body.username }
					))
			})
			.success(function (user) {
				if (!user) {
					res.status(400).send('Invalid information, cannot create new session!');
				} else {
					Session.create({
						expire: moment().utc().add(3, 'days').toDate(),
						UserId: user.values.id
					})
					.success(function (session) {
						res.status(200).send({ sessionId: session.values.id });
					})
					.error(function (err) {
						res.status(400).send(err);
					});
				}
			})
			.error(function (err) {
				res.status(400).send(err);
			});
	});
}