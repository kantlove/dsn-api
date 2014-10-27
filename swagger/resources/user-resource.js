var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {
    // Get user information
    swagger.addGet({
        'spec': {
            nickname: 'getUserInfo',
            path: '/user',
            summary: 'Get the information of a given user',
            notes: 'Return a user based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'User',
            parameters: [
                param.query('sessionId', 'Session unique identifier', 'integer', true),
                param.query('userId', 'User unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.sessionId)
                throw raise.notFound('sessionId');
            if (!req.query.userId)
                throw raise.notFound('userId');

            Session
                .find({ where: { id: req.query.sessionId }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('sessionId');
                    User.find({ where: { id: req.query.userId }})
                        .then(function (user) {
                            if (!user)
                                throw raise.invalid('userId');
                            res.status(200).send(user);
                        })
                        .catch(function (err) {
                            res.status(400).send(err);
                        });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                })
        }
    });

    // Register a new user
    swagger.addPost({
        'spec': {
            nickname: 'createUser',
            path: '/user',
            summary: 'Create a new user from a given data',
            notes: 'Register a new user',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'User object that need to be added', 'UserPost', JSON.stringify({
                    username: 'username',
                    email: 'email',
                    password: 'password',
                    fullname: 'fullname'
                }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.username)
                throw raise.notFound('username');
            if (!req.body.email)
                throw raise.notFound('email');
            if (!req.body.password)
                throw raise.notFound('password');
            if (!req.body.fullname)
                throw raise.notFound('fullname');

            User.create(req.body)
                .then(function (user) {
                    res.status(200).send({
                        result: 'success',
                        user_id: user.id
                    });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    // Delete a user
    swagger.addDelete({
        'spec': {
            nickname: 'deleteUser',
            path: '/user',
            summary: 'Delete a given user',
            notes: 'Delete a user based on id',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Id of the user that need to be deleted', 'UserDelete',
                    JSON.stringify({ session_id: '0', user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.user_id)
                throw raise.notFound('user_id');

            Session
                .find({ where: { id: req.body.session_id }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('session_id');
                    User.find({ where: { id: req.body.user_id }})
                        .then(function (user) {
                            if (!user)
                                throw raise.invalid('user_id');
                            if (session.user_id != user.id)
                                throw { err: 400, message: 'Unauthorized request!' }
                            user.destroy()
                                .then(function () {
                                    res.status(200).send(null);
                                })
                                .catch(function (err) {
                                    res.status(400).send(err);
                                });
                        })
                        .catch(function (err) {
                            res.status(400).send(err);
                        });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    swagger.configureDeclaration('user', {
        description : 'Operations about Users',
        produces: ['application/json']
    });
}