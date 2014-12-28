var lib     = require('../lib'),
    db      = require('../database'),
    utils   = require('./_utils'),
    Promise = require('bluebird'),
    sequelize = require("sequelize");

var param = lib.params,
    raise = lib.errors;

var User         = db.models.User,
    Dream        = db.models.Dream,
    Session      = db.models.Session,
    DreamLike    = db.models.DreamLike,
    DreamComment = db.models.DreamComment;

module.exports = function (swagger) {

    // Get dream information
    swagger.addGet({
        'spec': {
            nickname: 'getDreamInfo',
            path: '/dream',
            summary: 'Get the information of a given dream',
            notes: 'Return a dream based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'Dream',
            parameters: [
                param.query('session_id', 'Session unique identifier', 'integer', true),
                param.query('dream_id', 'Dream unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');
            if (!req.query.dream_id)
                throw raise.notFound('dream_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.query.session_id),
                    utils.queryDreamByDreamId(req.query.dream_id)
                ])
                .spread(function (user, dream) {
                    throw raise.success(dream);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Post a new dream
    swagger.addPost({
        'spec': {
            nickname: 'createDream',
            path: '/dream',
            summary: 'Create a new dream from a given data',
            notes: 'Create a new dream',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream object that need to be added', 'DreamPost',
                    JSON.stringify({ session_id: '0', text: 'text' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.text)
                throw raise.notFound('text');

            utils
                .queryUserBySessionId(req.body.session_id)
                .then(function (user) {
                    return Dream
                        .create({
                            user_id: user.id,
                            text: req.body.text
                        });
                })
                .then(function (dream) {
                    throw raise.success({ dream_id: dream.id });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Delete a dream
    swagger.addDelete({
        'spec': {
            nickname: 'deleteDream',
            path: '/dream',
            summary: 'Delete a given dream',
            notes: 'Delete a dream based on id',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream that need to be deleted', 'DreamDelete',
                    JSON.stringify({ session_id: '0', dream_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.dream_id)
                throw raise.notFound('dream_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByDreamId(req.body.dream_id)
                ])
                .spread(function (user, dream) {
                    if (user.id != dream.id)
                        throw raise.unauthorized();
                    return dream.destroy();
                })
                .then(function () {
                    throw raise.success({ result: true });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Post a new like
    swagger.addPost({
        'spec': {
            nickname: 'addDreamLike',
            path: '/dream/like',
            summary: 'Create a new dream like from a given data',
            notes: 'Create a new dream like',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream like object that need to be added', 'DreamLikePost',
                    JSON.stringify({ session_id: '0', dream_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.dream_id)
                throw raise.notFound('dream_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByDreamId(req.body.dream_id)
                ])
                .spread(function (user, dream) {
                    return Promise.all([
                        user, dream,
                        DreamLike.find({
                            where: sequelize.and(
                                { user_id: user.id },
                                { dream_id: dream.id }
                            )})
                    ]);
                })
                .spread(function (user, dream, dreamLike) {
                    if (!dreamLike) {
                        return DreamLike.create({
                            user_id: user.id,
                            dream_id: dream.id
                        });
                    } else {
                        if (!dreamLike.value) {
                            dreamLike.value = true;
                            dreamLike.save();
                        }
                        return dreamLike;
                    }
                })
                .then(function (dreamLike) {
                    throw raise.success(dreamLike);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Unlike
    swagger.addDelete({
        'spec': {
            nickname: 'deleteDreamLike',
            path: '/dream/like',
            summary: 'Delete a dream like from a given data',
            notes: 'Delete a dream like',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream like object that need to be removed', 'DreamUnlike',
                    JSON.stringify({ session_id: '0', dream_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.dream_id)
                throw raise.notFound('dream_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByDreamId(req.body.dream_id)
                ])
                .spread(function (user, dream) {
                    return Promise.all([
                        user, dream,
                        DreamLike.find({
                            where: sequelize.and(
                                { user_id: user.id },
                                { dream_id: dream.id }
                            )})
                    ]);
                })
                .spread(function (user, dream, dreamLike) {
                    if (!dreamLike) {
                        throw raise.success({ result: true });
                    } else {
                        if (dreamLike.value) {
                            dreamLike.value = false;
                            dreamLike.save();
                        }
                        throw raise.success({ result: true });
                    }
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Post a new comment
    swagger.addPost({
        'spec': {
            nickname: 'addDreamComment',
            path: '/dream/comment',
            summary: 'Create a new dream comment from a given data',
            notes: 'Create a new dream comment',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream comment object that need to be added', 'DreamCommentPost',
                    JSON.stringify({ session_id: '0', dream_id: '0', text: 'text' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.dream_id)
                throw raise.notFound('dream_id');
            if (!req.body.text)
                throw raise.notFound('text');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByDreamId(req.body.dream_id)
                ])
                .spread(function (user, dream) {
                    return DreamComment.create({
                        user_id: user.id,
                        dream_id: dream.id,
                        text: text
                    });
                })
                .then(function (dreamComment) {
                    throw raise.success(dreamComment);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Delete an comment
    swagger.addDelete({
        'spec': {
            nickname: 'deleteDreamComment',
            path: '/dream/comment',
            summary: 'Delete a dream comment from a given data',
            notes: 'Delete a dream comment like',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Dream comment object that need to be removed', 'DreamCommentDelete',
                    JSON.stringify({ session_id: '0', dream_comment_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.dream_comment_id)
                throw raise.notFound('dream_comment_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    DreamComment.find({ where: { id: req.body.dream_comment_id } })
                ])
                .spread(function (user, dreamComment) {
                    if (user.id != dreamComment.user_id)
                        throw raise.unauthorized();
                    return dream.destroy();
                })
                .then(function () {
                    throw raise.success({ result: true });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    swagger.configureDeclaration('dream', {
        description : 'Operations about Dreams',
        produces: ['application/json']
    });
}