var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session;

module.exports = function (swagger) {

    // Get all users (for testing only)
    swagger.addGet({
        'spec': {
            nickname: 'getAllUsers',
            path: '/admin/users',
            summary: 'Get the information of all user (for testing only)',
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
                    throw raise.success(users);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Get all sessions (for testing only)
    swagger.addGet({
        'spec': {
            nickname: 'getAllSessions',
            path: '/admin/sessions',
            summary: 'Get the information of all sessions (for testing only)',
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
                    throw raise.success(users);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    swagger.configureDeclaration('admin', {
        description : 'Operations for Admin / Testing',
        produces: ['application/json']
    });
}