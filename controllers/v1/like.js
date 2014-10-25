var db = require('./database');

// Models
var User = db.models.User;
var Session = db.models.Session;
var DreamLike = db.models.DreamLike;

module.exports = function (router) {
	router.post('/like/dream', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.dreamId) {
			res.status(400).send('dreamId missing!');
		} else {
			var value = req.body.value || true;
			Session
				.find({ where: { id: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						User
							.find({ where: { id: session.UserId }})
							.then(function (user) {
								DreamLike
									.findOrCreate({
										UserId: user.id,
										DreamId: req.body.dreamId
									}, { value: value })
									.then(function (dreamLike, created) {
										if (!created) {
											dreamLike.value = value;
											dreamLike.save();
										}
										res.status(200).send('Success!');
									}, function (err) {
										res.status(400).send(err);
									});
							}, function (err) {
								res.status(400).send(err);
							});
					}
				}, function (err) {
					res.status(400).send(err);
				});
		}
	});

	router.post('/like/achievement', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.achievementId) {
			res.status(400).send('achievementId missing!');
		} else {
			var value = req.body.value || true;
			Session
				.find({ where: { id: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						User
							.find({ where: { id: session.UserId }})
							.then(function (user) {
								AchievementLike
									.findOrCreate({
										UserId: user.id,
										AchievementId: req.body.achievementId
									}, { value: value })
									.then(function (achievementLike, created) {
										if (!created) {
											achievementLike.value = value;
											achievementLike.save();
										}
										res.status(200).send('Success!');
									}, function (err) {
										res.status(400).send(err);
									})
							}, function (err) {
								res.status(400).send(err);
							});
					}
				}, function (err) {
					res.status(400).send(err);
				});
		}
	});
}