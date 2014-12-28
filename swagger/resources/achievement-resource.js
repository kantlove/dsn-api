var lib     = require('../lib'),
    db      = require('../database'),
    utils   = require('./_utils'),
    Promise = require('bluebird'),
    sequelize = require("sequelize");

var param = lib.params,
    raise = lib.errors;

var User               = db.models.User,
    Dream              = db.models.Dream,
    Achievement        = db.models.Achievement,
    Session            = db.models.Session,
    AchievementLike    = db.models.AchievementLike,
    AchievementComment = db.models.AchievementComment;

module.exports = function (swagger) {

    // Get achievement information
    swagger.addGet({
        'spec': {
            nickname: 'getAchievementInfo',
            path: '/achievement',
            summary: 'Get the information of a given achievement',
            notes: 'Return an achievement based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'Achievement',
            parameters: [
                param.query('session_id', 'Session unique identifier', 'integer', true),
                param.query('achievement_id', 'Achievement unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.session_id)
                throw raise.notFound('session_id');
            if (!req.query.achievement_id)
                throw raise.notFound('achievement_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.query.session_id),
                    utils.queryAchievementByAchievementId(req.query.achievement_id)
                ])
                .spread(function (user, achievement) {
                    throw raise.success(achievement);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Post a new achievement
    swagger.addPost({
        'spec': {
            nickname: 'createAchievement',
            path: '/achievement',
            summary: 'Create a new achievement from a given data',
            notes: 'Create a new achievement',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Achievement object that need to be added', 'AchievementPost',
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
                    utils.findUserBySessionId(req.body.session_id),
                    utils.findDreamByDreamId(req.body.dream_id),
                ])
                .spread(function (user, dream) {
                    if (user.id != dream.user_id)
                        throw raise.unauthorized();
                    return Achievement
                        .create({
                            dream_id: dream.id,
                            text: req.body.text
                        });
                })
                .then(function (achievement) {
                    throw raise.success({ achivement_id: achievement.id });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Delete an achievement
    swagger.addDelete({
        'spec': {
            nickname: 'deleteAchievement',
            path: '/achievement',
            summary: 'Delete a given achievement',
            notes: 'Delete an achievement based on id',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Achievement that need to be deleted', 'AchievementDelete',
                    JSON.stringify({ session_id: '0', achievement_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.achievement_id)
                throw raise.notFound('achievement_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByAchievementId(req.body.achievement_id),
                    utils.queryAchievementByAchievementId(req.body.achivement_id)
                ])
                .spread(function (user, dream, achievement) {
                    if (user.id != dream.user_id)
                        throw raise.unauthorized();
                    achievement
                        .destroy()
                        .then(function() {
                            throw raise.success({ result: true });
                        });
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Post a new like
    swagger.addPost({
        'spec': {
            nickname: 'addAchievementLike',
            path: '/achievement/like',
            summary: 'Create a new achievement like from a given data',
            notes: 'Create a new achievement like',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Achievement like object that need to be added', 'AchievementLikePost',
                    JSON.stringify({ session_id: '0', achievement_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.achievement_id)
                throw raise.notFound('achievement_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryAchievementByAchievementId(req.body.achievement_id)
                ])
                .spread(function (user, achievement) {
                    return Promise.all([
                        user, achievement,
                        AchievementLike.find({
                            where: sequelize.and(
                                { user_id: user.id },
                                { achievement_id: achievement.id }
                            )})
                    ]);
                })
                .spread(function (user, dream, achievementLike) {
                    if (!achievementLike) {
                        return AchievementLike.create({
                            user_id: user.id,
                            achievement_id: achievement.id
                        });
                    } else {
                        if (!achievementLike.value) {
                            achievementLike.value = true;
                            achievementLike.save();
                        }
                        return achievementLike;
                    }
                })
                .then(function (achievementLike) {
                    throw raise.success(achievementLike);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    // Unlike
    swagger.addDelete({
        'spec': {
            nickname: 'deleteAchievementLike',
            path: '/achievement/like',
            summary: 'Delete an achievement like from a given data',
            notes: 'Delete an achievement like',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Achievement like object that need to be added', 'AchievementUnlike',
                    JSON.stringify({ session_id: '0', achievement_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.achievement_id)
                throw raise.notFound('achievement_id');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryAchievementByAchievementId(req.body.achievement_id)
                ])
                .spread(function (user, achievement) {
                    return Promise.all([
                        user, achievement,
                        AchievementLike.find({
                            where: sequelize.and(
                                { user_id: user.id },
                                { achievement_id: achievement.id }
                            )})
                    ]);
                })
                .spread(function (user, dream, achievementLike) {
                    if (!achievementLike) {
                        throw raise.success({ result: true });
                    } else {
                        if (achievementLike.value) {
                            achievementLike.value = false;
                            achievementLike.save();
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
            nickname: 'addAchievementComment',
            path: '/achievement/comment',
            summary: 'Create a new achievement comment from a given data',
            notes: 'Create a new achievement comment',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Achievement comment object that need to be added', 'AchievementCommentPost',
                    JSON.stringify({ session_id: '0', achievement_id: '0', text: 'text' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.achievement_id)
                throw raise.notFound('achievement_id');
            if (!req.body.text)
                throw raise.notFound('text');

            Promise
                .all([
                    utils.queryUserBySessionId(req.body.session_id),
                    utils.queryDreamByDreamId(req.body.achievement_id)
                ])
                .spread(function (user, dream) {
                    return AchievementComment.create({
                        user_id: user.id,
                        achievement_id: dream.id,
                        text: text
                    });
                })
                .then(function (achievementComment) {
                    throw raise.success(achievementComment);
                })
                .catch(function (err) {
                    raise.send(err, res);
                });
        }
    });

    swagger.configureDeclaration('achievement', {
        description : 'Operations about Achievements',
        produces: ['application/json']
    });
}