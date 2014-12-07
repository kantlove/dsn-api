var lib = require('../lib'),
    db  = require('../database');

var param = lib.params,
    raise = lib.errors;

var User    = db.models.User,
    Dream   = db.models.Dream,
    Session = db.models.Session;

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

            Session
                .find({ where: { id: req.query.session_id }})
                .then(function (session) {
                    if (!session)
                        throw raise.invalid('session_id');
                    Dream
                        .find({ where: { id: req.query.dream_id }})
                        .then(function (dream) {
                            if (!dream)
                                throw raise.invalid('dream_id');
                            if (dream.user_id != session.user_id)
                                throw { code: 400, message: 'Unauthorized request!' }
                            res.status(200).send(dream);
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

            Session
                .find({ where: { id: req.body.session_id }})
                .then(function (session) {
                    Dream
                        .create({
                            user_id: session.user_id,
                            text: req.body.text
                        })
                        .then(function (dream) {
                            res.status(200).send({
                                result: 'success',
                                dream_id: dream.id
                            })
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
                                throw { err: 400, message: 'Unauthorized request!' }
                            dream
                                .destroy()
                                .then(function () {
                                    res.status(200).send(null);
                                })
                                .catch(function (err) {
                                    res.status(400).send(err);
                                });
                        });
                })
                .catch(function (err) {
                    res.status(400).send(err);
                });
        }
    });

    swagger.configureDeclaration('dream', {
        description : 'Operations about Dreams',
        produces: ['application/json']
    });
}