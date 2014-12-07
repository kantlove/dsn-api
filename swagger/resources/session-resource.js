var lib       = require('../lib'),
    db        = require('../database'),
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

            Session
            .find({ where: { id: req.query.session_id }})
            .then(function (session) {
                if (!session)
                    throw raise.invalid('session_id');
                res.status(200).send(session);
            })
            .catch(function (err) {
                res.status(400).send(err);
            })
        }
    });

    // Create a new session
    swagger.addPost({
        'spec': {
            nickname: 'createSession',
            path: '/session',
            summary: 'Create a new session from a given data',
            notes: 'Create a new session',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Contains all required information to create a new session',
                           'SessionPost', JSON.stringify({ user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.user_id)
                throw raise.notFound('user_id');

            Session
            .create({
                user_id: req.body.user_id,
                expire: moment.utc().add(3, 'days').toDate()
            })
            .then(function (session) {
                res.status(200).send({
                    result: 'success',
                    session_id: session.id,
                    expire: session.expire
                })
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
        }
    });

    // Create session or Sign in with username and password
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
                           'SessionPost2', JSON.stringify({email: 'email', username: 'username', password: 'password'}, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.username && !req.body.email)
                throw raise.notFound('username || email');
            if (!req.body.password)
                throw raise.notFound('password');

            var result = false;
            // check the user info
            User
            .find({where: sequelize.or({username: req.body.username}, {email: req.body.email})})
            .then(function (user) {
                if (user.password == req.body.password) {
                    Session
                    .create({
                        user_id: user.id,
                        expire: moment.utc().add(3, 'days').toDate()
                    })
                    .then(function (session) {
                        res.status(200).send({
                            result: 'success',
                            session_id: session.id,
                            expire: session.expire
                        })
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
                }
                else {
                    res.status(400).send({message: 'Invalid password!'});
                }
            })
            .catch(function(err) {
                res.status(400).send({message: 'Username not found!'});  // user not found
            });
        }
    });

    swagger.configureDeclaration('session', {
        description : 'Operations about Sessions',
        produces: ['application/json']
    });
}