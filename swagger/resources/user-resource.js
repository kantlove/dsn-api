var lib     = require('../lib'),
    db      = require('../database'),
    utils   = require('./_utils'),
    Promise = require('bluebird');

var param = lib.params,
    raise = lib.errors;

var User         = db.models.User,
    Session      = db.models.Session,
    Dream        = db.models.Dream,
    Relationship = db.models.Relationship;

module.exports = function (swagger) {

    // Get user information
    swagger.addGet({
        'spec': {
            nickname: 'getUserInfo',
            path: '/user',
            summary: 'Get the information of a given user',
            notes: 'Return an user based on id',
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

            Promise
                .all([
                    utils.queryUserBySessionId(req.query.session_id),
                    utils.queryUserByUserId(req.query.user_id)
                ])
                .spread(function (userA, userB) {
                    throw raise.success({
                        id: userB.id,
                        username: userB.id,
                        email: userB.email
                    })
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

    // Delete an user
    swagger.addDelete({
        'spec': {
            nickname: 'deleteUser',
            path: '/user',
            summary: 'Delete a given user',
            notes: 'Delete an user based on id',
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
                            throw raise.success({ result: true });
                        });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Follow an user
    swagger.addPost({
        'spec': {
            nickname: 'followUser',
            path: '/user/follow',
            summary: 'Follow another user from the given data',
            notes: 'Follow another user',
            method: 'POST',
            produces: ['application/json'],
            parameters: [
                param.body('body', 'An object that describe the follow request', 'FollowPost',
                    JSON.stringify({ session_id: '0', user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.user_id)
                throw raise.notFound('user_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryUserByUserId(req.body.user_id)
                ])
                .spread(function (userA, userB) {
                    return Promise.all([userA, userB, utils.checkConnection(userA, userB)])
                })
                .spread(function (userA, userB, result) {
                    if (!result) return false;
                    return Relationship
                        .create({
                            following: userA.id,
                            follower: userB.id
                        })
                        .then(function (rel) {
                            if (!rel) return true;
                            return false;
                        });
                })
                .then(function (result) {
                    throw raise.success({ result: result });
                })
                .catch(function (err) {
                    throw raise.send(err, res);
                });
        }
    });

    // Unfollow an user
    swagger.addDelete({
        'spec': {
            nickname: 'unfollowUser',
            path: '/user/follow',
            summary: 'Unollow another user from the given data',
            notes: 'Unfollow another user',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'An object that describe the follow request', 'Unfollow',
                    JSON.stringify({ session_id: '0', user_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryUserByUserId(req.body.user_id)
                ])
                .spread(function (userA, userB) {
                    return Promise.all([userA, userB, utils.checkConnection(userA, userB)])
                })
                .spread(function (userA, userB, result) {
                    if (!result) return false;
                    return Relationship
                        .find({ where: { following: userA.id, follower: userB.id } })
                        .then(function (rel) {
                            return rel.destroy();
                        })
                        .then(function () {
                            return true;
                        });
                })
                .then(function (result) {
                    throw raise.success({ result: result });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    })

    // Get all dreams of user
    swagger.addGet({
        'spec': {
            nickname: 'getAllDreamsOfUser',
            path:'/user/dreams',
            summary: 'Get all dreams of a user',
            notes: 'Return dreams from user_id',
            method: 'GET',
            produces: ['application/json'],
            type: 'array',
            items: {
                $ref: 'Dream'
            },
            parameters: [
                param.query('session_id', 'Session unique identifier', 'integer', true),
                param.query('user_id', 'User unique identifier', 'integer', true),
                param.query('offset', 'The number of dreams you want to skip', 'integer', false),
                param.query('limit', 'The number of dreams you want to get', 'integer', false)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');
            if (!req.query.user_id)
                throw raise.notFound('user_id');
            var offset = req.query.offset || 0, limit = req.query.limit || 1000000;
            
            Dream
                .findAll({
                    where: { user_id: req.query.user_id },
                    offset: offset,
                    limit: limit
                }).then(function (dreams) {
                    throw raise.success(dreams);
                })
                .catch(function(err) {
                    res.send(err, res);
                });
        }
    });

    // Get news feed
    swagger.addGet({
        'spec': {
            nickname: 'getNewsFeed',
            path:'/user/newsfeed',
            summary: 'Get news feed of a user',
            notes: 'Return a list of dreams',
            method: 'GET',
            produces: ['application/json'],
            type: 'array',
            items: {
                $ref: 'Dream'
            },
            parameters: [
                param.query('session_id', 'Session unique identifier', 'integer', true),
                param.query('offset', 'The number of dreams you want to skip', 'integer', false),
                param.query('limit', 'The number of dreams you want to get', 'integer', false)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');
            var offset = req.query.offset || 0, limit = req.query.limit || 1000000;
            
            utils
                .queryUserBySessionId(req.query.session_id)
                .then(function (user) {
                    return Relationship.findAll({ where: { following: user.id } });
                })
                .then(function (users) {
                    var user_ids = [];
                    for (var user in users)
                        user_ids.push(user.id);
                    return Dream.findAll({
                        where: { user_id: user_ids },
                        offset: offset,
                        limit: limit
                    });
                })
                .then(function (dreams) {
                    throw raise.success(dreams);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    swagger.configureDeclaration('user', {
        description : 'Operations about Users',
        produces: ['application/json']
    });
}