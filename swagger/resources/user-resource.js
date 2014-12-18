var lib   = require('../lib'),
    db    = require('../database'),
    utils = require('./_utils');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Session = db.models.Session,
    Dream   = db.models.Dream;

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
                param.query('session_id', 'Session unique identifier', 'integer', true),
                param.query('user_id', 'User unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');
            if (!req.query.user_id)
                throw raise.notFound('user_id');

            utils
                .queryUserBySessionId(req.query.session_id)
                .then(function (user) {
                    var other = utils.queryUserByUserId(req.query.user_id).value();
                    throw raise.success({
                        id: other.id,
                        username: other.username,
                        fullname: other.fullname
                    });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
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
                    raise.success({ user_id: user.id }, res);
                })
                .catch(function (err) {
                    raise.send(err, res);
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

            utils
                .queryUserBySessionId(req.body.session_id)
                .then(function (user) {
                    if (user.id != req.body.user_id)
                        throw raise.unauthorized();
                    user.destroy()
                        .then(function () {
                            throw raise.success();
                        });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });
    
    // Get all dreams of user
    // swagger.addGet({
    //     'spec': {
    //         nickname: 'getAllDreamsOfUser',
    //         path:'/user/dreams',
    //         summary: 'Get all dreams of a user',
    //         notes: 'Return dreams from user_id',
    //         method: 'GET',
    //         produces: ['application/json'],
    //         type: 'array',
    //         items: {
    //             $ref: 'Dream'
    //         },
    //         parameters: [
    //             param.query('session_id', 'Session unique identifier', 'integer', true),
    //             param.query('user_id', 'User unique identifier', 'integer', true),
    //             param.query('offset', 'The number of dreams you want to skip', 'integer', false),
    //             param.query('limit', 'The number of dreams you want to get', 'integer', false)
    //         ]
    //     },
    //     'action': function (req, res) {
    //         if (!req.query.session_id)
    //             throw raise.notFound('session_id');
    //         if (!req.query.user_id)
    //             throw raise.notFound('user_id');
    //         var offset = req.query.offset || 0, limit = req.query.limit || 1000000;
 
    //         Dream
    //             .findAll({
    //                 where: { user_id: req.query.user_id },
    //                 offset: offset,
    //                 limit: limit
    //             }).then(function (dreams) {
    //                 res.status(200).send(dreams);
    //             })
    //             .catch(function(err) {
    //                 res.status(400).send(err);
    //             });
    //     }
    // });

    // Follow a user
    // swagger.addPost({
    //     'spec': {
    //         nickname: 'followUser',
    //         path: '/user/follow',
    //         summary: 'Follow another user from the given data',
    //         notes: 'Follow another user',
    //         method: 'POST',
    //         produces : ['application/json'],
    //         parameters: [
    //             param.body('body', 'An object that describe the follow request', 'FollowPost', JSON.stringify({
    //                 session_id: 'session_id',
    //                 user_id: 'user_id'
    //             }, null, 4))
    //         ]
    //     },
    //     'action': function (req, res) {
    //         if (!req.body.session_id)
    //             throw raise.notFound('session_id');
    //         if (!req.body.user_id)
    //             throw raise.notFound('user_id');

    //         Session
    //             .find({ where: { id: req.body.session_id }})
    //             .then(function (session) {
    //                 if (!session)
    //                     throw raise.invalid('session_id');
    //                 User.find({ where: { id: session.user_id }})
    //                     .then(function (userA) {
    //                         if (!userA)
    //                             throw raise.invalid('user_id of session_id');
    //                         User.find({ where : { id: req.body.user_id }})
    //                             .then(function (userB) {
    //                                 if (!userB)
    //                                     throw raise.invalid('user_id');
    //                                 userA
    //                                     .addFollowing(userB)
    //                                     .then(function () {
    //                                         userB
    //                                             .addFollower(userA)
    //                                             .then(function () {
    //                                                 res.status(200).send(null);
    //                                             })
    //                                             .catch(function (err) {
    //                                                 res.status(400).send(err);
    //                                             });
    //                                     })
    //                                     .catch(function (err) {
    //                                         res.status(400).send(err);
    //                                     });
    //                             })
    //                             .catch(function (err) {
    //                                 res.status(400).send(err);
    //                             });
    //                     })
    //                     .catch(function (err) {
    //                         res.status(400).send(err);
    //                     });
    //             })
    //             .catch(function (err) {
    //                 res.status(400).send(err);
    //             });
    //     }
    // });

    swagger.configureDeclaration('user', {
        description : 'Operations about Users',
        produces: ['application/json']
    });
}