var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User        = db.models.User,
    Dream       = db.models.Dream,
    Achievement = db.models.Achievement,
    Session     = db.models.Session;

module.exports = function (swagger) {
    // Get achievement information
    swagger.addGet({
        'spec': {
            nickname: 'getAchievementInfo',
            path: '/achievement',
            summary: 'Get the information of a given achievement',
            notes: 'Return a achievement based on id',
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

            Session
                .find({ where: { id: req.query.session_id }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('session_id');
                    Achievement
                        .find({ where: { id: req.query.achievement_id }})
                        .then(function (achievement) {
                            if (!achievement)
                                throw raise.invalid('achievement_id');
                            res.status(200).send(achievement);
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

            Session
                .find({ where: { id: req.body.session_id }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('session_id');
                    Dream
                        .find({ where: { id: req.body.dream_id }})
                        .then(function (dream) {
                            if (!dream)
                                throw raise.invalid('dream_id');
                            if (session.user_id != dream.user_id)
                                throw { code: 400, message: 'Unauthorized request!' }
                            Achievement
                                .create({
                                    dream_id: dream.id,
                                    text: req.body.text
                                })
                                .then(function (achievement) {
                                    res.status(200).send({
                                        result: 'success',
                                        achievement_id: achievement.id
                                    })
                                })
                                .catch(function (err) {
                                    res.status(400).send(err);
                                })
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

    // Delete an achievement
    swagger.addDelete({
        'spec': {
            nickname: 'deleteAchievement',
            path: '/achievement',
            summary: 'Delete a given achievement',
            notes: 'Delete a achievement based on id',
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

            Session
                .find({ where: { id: req.body.session_id }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('session_id');
                    Achievement
                        .find({ where: { id: req.body.achievement_id }})
                        .then(function (achievement) {
                            if (!achievement)
                                throw raise.invalid('achievement_id');
                            Dream
                                .find({ where: {
                                    id: achievement.dream_id,
                                    user_id: session.user_id
                                }})
                                .then(function (dream) {
                                    if (!dream)
                                        throw { code: 400, message: 'No valid related dream!' }
                                    achievement
                                        .destroy()
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
                        })
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    swagger.configureDeclaration('achievement', {
        description : 'Operations about Achievements',
        produces: ['application/json']
    });
}