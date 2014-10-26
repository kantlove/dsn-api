var db = require('./database');

// Models
var User = db.models.User;
var Dream = db.models.Dream;
var Session = db.models.Session;
var Achievement = db.models.Achievement;

module.exports = function (router) {
	// Create new achievement
	router.post('/achievement', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.dreamId) {
			res.status(400).send('dreamId missing!');
		} else if (!req.body.text) {
			res.status(400).send('text missing!');
		} else {
			Session
				.find({ where: { id: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						Dream
							.find({ where: { id: req.body.dreamId }})
							.then(function (dream) {
								if (!dream) {
									res.status(400).send('Invalid dreamId!');
								} else if (dream.UserId != session.UserId) {
									res.status(400).send('Unauthorized user!');
								} else {
									Achievement.create({
										text: req.body.text,
										DreamId: dream.DreamId
									}).then(function (achievement) {
										res.status(200).send({ achievementId: achievement.id });
									}, function (err) {
										res.status(400).send(err);
									})
								}
							}, function (err) {
								res.status(400).send(err);
							});
					}
				}, function (err) {
					res.status(400).send(err);
				});
		}
	});

	// Update a dream
	router.put('/achievement', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.achievementId) {
			res.status(400).send('achievementId missing!');
		} else if (!req.body.text) {
			res.status(400).send('text missing!');
		} else {
			Session
				.find({ where: { id: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						Achievement
							.find({ where: { id: req.body.achievementId }})
							.then(function (achievement) {
								if (!achievement) {
									res.status(400).send('Invalid achievementId!')
								} else {
									Dream
										.find({ where: { id: achievement.DreamId }})
										.then(function (dream) {
											if (!dream) {
												res.status(400).send('No related dream!');
											} else if (dream.UserId != session.UserId) {
												res.status(400).send('Unauthorized user!');
											} else {
												achievement.text = req.body.text;
												achievement.save().then(function () {
													res.status(200).send('Success!');
												}, function (err) {
													res.status(400).send(err);
												})
											}
										}, function (err) {
											res.status(400).send(err);
										});
								}
							}, function (err) {
								res.status(400).send(err);
							});
					}
				}, function (err) {
					res.status(400).send(err);
				});
		}
	});

	// Delete a dream
	router.delete('/achievement', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.achievementId) {
			res.status(400).send('achievementId missing!');
		} else {
			Session
				.find({ where: { id: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						Achievement
							.find({ where: { id: req.body.achievementId }})
							.then(function (achievement) {
								if (!achievement) {
									res.status(400).send('Invalid achievementId!')
								} else {
									Dream
										.find({ where: { id: achievement.DreamId }})
										.then(function (dream) {
											if (!dream) {
												res.status(400).send('No related dream!');
											} else if (dream.UserId != session.UserId) {
												res.status(400).send('Unauthorized user!');
											} else {
												achievement.destroy().then(function () {
													res.status(200).send('Success!');
												}, function (err) {
													res.status(400).send(err);
												})
											}
										}, function (err) {
											res.status(400).send(err);
										});
								}
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