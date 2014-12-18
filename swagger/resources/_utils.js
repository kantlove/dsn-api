var lib   = require('../lib'),
    db    = require('../database');

var raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session,
    Dream   = db.models.Dream;

module.exports.queryUserByUserId = function (user_id) {
	return User.find({ where: { id: user_id }})
		.then(function (user) {
            if (!user)
                throw raise.invalid('user_id');
            return user;
        });
}

module.exports.querySessionBySessionId = function (session_id) {
	return Session.find({ where: { id: session_id }})
		.then(function (session) {
			if (!session)
				throw raise.invalid('session_id');
			return session;
		});
}

module.exports.queryUserBySessionId = function (session_id) {
	return this.querySessionBySessionId(session_id)
		.then(function (session) {
			return this.queryUserByUserId(session.user_id);
		});
}