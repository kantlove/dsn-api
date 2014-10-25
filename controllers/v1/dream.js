var db = require('./database');

// Models
var User = db.models.User;
var Dream = db.models.Dream;
var Session = db.models.Session;

module.exports = function (router) {
	// Create new dream
	router.post('/dream', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.text) {
			res.status(400).send('text missing!');
		} else {
			Session
				.find({ where: { sessionId: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
						Dream.create({
							text: req.body.text,
							UserId: session.UserId
						}).then(function (dream) {
							res.status(200).send('Success!');
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
	router.put('/dream', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.dreamId) {
			res.status(400).send('dreamId missing!');
		} else if (!req.body.text) {
			res.status(400).send('text missing!');
		} else {
			Session
				.find({ where: { sessionId: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
					 	Dream
					 		.find({ where: { dreamId: req.body.dreamId }})
					 		.then(function (dream) {
					 			if (dream.UserId != session.UserId) {
					 				res.status(400).send('Unauthorized!');
					 			} else {
						 			dream.text = req.body.text;
						 			dream.save().then(function () {
					 					res.status(200).send('Success!');
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
	router.delete('/dream', function (req, res) {
		if (!req.body.sessionId) {
			res.status(400).send('sessionId missing!');
		} else if (!req.body.dreamId) {
			res.status(400).send('dreamId missing!');
		} else {
			Session
				.find({ where: { sessionId: req.body.sessionId }})
				.then(function (session) {
					if (!session) {
						res.status(400).send('Invalid sessionId!');
					} else {
					 	Dream
					 		.find({ where: { dreamId: req.body.dreamId }})
					 		.then(function (dream) {
					 			if (dream.UserId != session.UserId) {
					 				res.status(400).send('Unauthorized!');
					 			} else {
						 			dream.destroy().then(function () {
					 					res.status(200).send('Success!');
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