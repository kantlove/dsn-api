var lib       = require('../lib'),
    db        = require('../database'),
    utils     = require('./_utils'),
    moment    = require('moment'),
    sequelize = require('sequelize');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {

    // Get session information
    swagger.addGet({
        'spec': {
            nickname: 'getSessionInfo',
            path: '/session',
            summary: 'Get the information of a given session',
            notes: 'Return a session based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'Session',
            parameters: [
                param.query('session_id', 'Session unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');

            utils
                .querySessionBySessionId(req.query.session_id)
                .then(function (session) {
                    throw raise.success(session);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Create a new session (for testing only)
    swagger.addPost({
        'spec': {
            nickname: 'createSession',
            path: '/session',
            summary: 'Create a new session from a given data (for testing only)',
            notes: 'Create a new session',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Contains all required information to create a new session',
                           'SessionPost1', JSON.stringify({ user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.user_id)
                throw raise.notFound('user_id');

            utils
                .queryUserByUserId(req.body.user_id)
                .then(function (user) {
                    Session
                        .create({
                            user_id: user.id,
                            expire: moment.utc().add(3, 'days').toDate()
                        })
                        .then(function (session) {
                            throw raise.success(session);
                        })
                        .catch(function (err) {
                            raise.send(err, res);
                        });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Sign in
    swagger.addPost({
        'spec': {
            nickname: 'signIn',
            path: '/session/signin',
            summary: 'Create a new session from a given data',
            notes: 'Create a new session',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Contains all required information to create a new session',
                           'SessionPost2', JSON.stringify({ username: 'username', password: 'password' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.username)
                throw raise.notFound('username');
            if (!req.body.password)
                throw raise.notFound('password');

            User.find({ where: { username: req.body.username } })
                .then(function (user) {
                    if (!user)
                        throw raise.invalid('username');
                    if (user.password != req.body.password)
                        throw raise.invalid('password');

                    Session.create({
                        user_id: user.id,
                        expire: moment.utc().add(3, 'days').toDate()
                    })
                    .then(function (session) {
                        throw raise.success(session);
                    })
                    .catch(function (err) {
                        raise.send(err, res);
                    });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    swagger.configureDeclaration('session', {
        description : 'Operations about Sessions',
        produces: ['application/json']
    });
}