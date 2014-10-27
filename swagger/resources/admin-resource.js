var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {
    // Get all users
    swagger.addGet({
        'spec': {
            nickname: 'getAllUsers',
            path: '/admin/users',
            summary: 'Get the information of all user',
            notes: 'Return a list of users',
            method: 'GET',
            produces : ['application/json'],
            type: 'array',
            items: {
                $ref: 'User'
            },
            parameters: [
                param.query('offset', 'The number of users you want to skip', 'integer', true, null, '0'),
                param.query('limit', 'The number of users you want to get', 'integer', true, null, '20')
            ]
        },
        'action': function (req, res) {
            if (!req.query.limit)
                throw raise.notFound('limit');
            if (!req.query.offset)
                throw raise.notFound('offset');

            User.findAll({
                    offset: req.query.offset,
                    limit: req.query.limit
                })
                .then(function (users) {
                    res.status(200).send(users);
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    // Get all sessions
    swagger.addGet({
        'spec': {
            nickname: 'getAllSessions',
            path: '/admin/sessions',
            summary: 'Get the information of all sessions',
            notes: 'Return a list of sessions',
            method: 'GET',
            produces : ['application/json'],
            type: 'array',
            items: {
                $ref: 'Session'
            },
            parameters: [
                param.query('offset', 'The number of sessions you want to skip', 'integer', true, null, '0'),
                param.query('limit', 'The number of sessions you want to get', 'integer', true, null, '20')
            ]
        },
        'action': function (req, res) {
            if (!req.query.limit)
                throw raise.notFound('limit');
            if (!req.query.offset)
                throw raise.notFound('offset');

            Session
                .findAll({
                    offset: req.query.offset,
                    limit: req.query.limit
                })
                .then(function (users) {
                    res.status(200).send(users);
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    swagger.configureDeclaration('admin', {
        description : 'Operations for Admin / Testing',
        produces: ['application/json']
    });
}