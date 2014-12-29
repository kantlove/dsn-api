var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var Hashtag    = db.models.Hashtag,
    Achievement = db.models.Achievement,
    AchievementComment = db.models.AchievementComment,
    Dream   = db.models.Dream,
    DreamComment = db.models.DreamComment;

module.exports = function (swagger) {
    // Get a hashtag information
    swagger.addGet({
        'spec': {
            nickname: 'getHashtag',
            path: '/hashtag',
            summary: 'Get the information of a given hashtag',
            notes: 'Return a hashtag based on id',
            method: 'GET',
            produces : ['application/json'],
            type: 'Hashtag',
            parameters: [
                param.query('hashtag_id', 'Hashtag unique identifier', 'integer', true)
            ]
        },
        'action': function (req, res) {
            if (!req.query.hashtag_id)
                throw raise.notFound('hashtag_id');
            Hashtag
                .find({ where: { id: req.query.hashtag_id }})
                .then(function (hashtag) {
                if (!hashtag)
                    throw raise.invalid('hashtag_id');
                res.status(200).send(hashtag);
            })
            .catch(function (err) {
                res.status(400).send(err);
            })
        }
    });

    // Create a new hashtag
    swagger.addPost({
        'spec': {
            nickname: 'createHashtag',
            path: '/hashtag',
            summary: 'Create a new hashtag from a given data',
            notes: 'Create a new hashtag',
            method: 'POST',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Hashtag object that need to be added', 'HashtagPost', JSON.stringify({
                    text: 'hashtag text'
                }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.text)
                throw raise.notFound('text');
            // Hashtag can only contain a-zA-Z0-9
            if (!(/^(\w+)$/.test(req.body.text)))
                res.status(400).send({ message: 'Invalid text. Hashtag can only contain a-zA-Z0-9' });
            else {
                Hashtag.create(req.body)
                .then(function (hashtag) {
                    res.status(200).send({
                        result: 'success',
                        hashtag_id: hashtag.id
                    });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
            }
        }
    });

    // Delete a hashtag
    swagger.addDelete({
        'spec': {
            nickname: 'deleteHashtag',
            path: '/hashtag',
            summary: 'Delete a created hashtag',
            notes: 'Delete a hashtag based on id',
            method: 'DELETE',
            produces : ['application/json'],
            parameters: [
                param.body('body', 'Id of the hashtag that need to be deleted', 'HashtagDelete',
                    JSON.stringify({ session_id: '0', hashtag_id: '0' }, null, 4))
            ]
        },
        'action': function (req, res) {
            if (!req.body.session_id)
                throw raise.notFound('session_id');
            if (!req.body.hashtag_id)
                throw raise.notFound('hashtag_id');

            Hashtag
                .find({ where: { id: req.body.hashtag_id }})
                .then(function (hashtag) {
                    if (!hashtag)
                        throw raise.invalid('invalid hashtag_id');
                    hashtag.destroy()
                        .then(function () {
                        res.status(200).send({ 
                            message: 'deleted!',
                            hashtag: hashtag.text
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

    // Get all hashtags
    swagger.addGet({
        'spec': {
            nickname: 'getAllHashtag',
            path:'/hashtag/all',
            summary: 'Get all hashtags',
            notes: 'Return all hashtags available',
            method: 'GET',
            produces: ['application/json'],
            type: 'array',
            items: {
                $ref: 'Hashtag'
            },
            parameters: [
                param.query('offset', 'The number of hashtags you want to skip. Default = 0', 'integer', false),
                param.query('limit', 'The number of hashtags you want to get. Default = INFINITE', 'integer', false)
            ]
        },
        'action': function (req, res) {
            var offset = req.query.offset || 0, limit = req.query.limit || 1000000;

            Hashtag.findAll({
                offset: offset,
                limit: limit
            }).then(function (hashtags) {
                res.status(200).send(hashtags);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
        }
    });

    swagger.configureDeclaration('hashtag', {
        description : 'Operations about Hashtags',
        produces: ['application/json']
    });
}