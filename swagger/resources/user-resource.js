var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {
    swagger.configureDeclaration('user', {
        description : 'Operations about Users',
        produces: ['application/json']
    });

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
            res.status(200).send(null);
        }
    });

    // Register a new user
    swagger.addPost({
        'spec': {
            nickname: 'register',
            path: '/user',
            summary: 'Create a new user from a given data',
            notes: 'Register a new user',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'User object that need to be added', 'User', JSON.stringify({
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
                        'result': 'success',
                        'user-id': user.id
                    });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    })
}