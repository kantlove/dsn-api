var lib     = require('../lib'),
    db      = require('../database'),
    Promise = require('bluebird');

var raise = lib.errors;

var User         = db.models.User,
    Session      = db.models.Session,
    Dream        = db.models.Dream,
    Achievement  = db.models.Achievement,
    Relationship = db.models.Relationship;

module.exports.queryUserByUserId = function (user_id) {
    return User.find({ where: { id: user_id} })
        .then(function (user) {
            if (!user)
                throw raise.invalid('user_id');
            return user;
        });
}

module.exports.querySessionBySessionId = function (session_id) {
    return Session
        .find({ where: { id: session_id } })
        .then(function (session) {
            if (!session)
                throw raise.invalid('session_id');
            return session;
        });
}

module.exports.queryUserBySessionId = function (session_id) {
    return Session
        .find({ where: { id: session_id } })
        .then(function (session) {
            if (!session)
                throw raise.invalid('session_id');
            return User.find({ where: { id: session.user_id } })
                .then(function (user) {
                    if (!user)
                        throw raise.invalid('user_id');
                    return user;
                });
        });
}

module.exports.queryDreamByDreamId = function (dream_id) {
    return Dream
        .find({ where: { id: dream_id } })
        .then(function (dream) {
            if (!dream)
                throw raise.invalid('dream_id');
            return dream;
        });
}

module.exports.queryDreamByAchievementId = function (achievement_id) {
    return this.queryAchievementByAchievementId(achievement_id)
        .then(function (achievement) {
            return Dream
                .find({ where: { id: dream_id } })
                .then(function (dream) {
                    if (!dream)
                        throw raise.invalid('dream_id');
                    return dream;
                });
        });
}

module.exports.queryAchievementByAchievementId = function (achievement_id) {
    return Achievement
        .find({ where: { id: achievement_id} })
        .then(function (achievement) {
            if (!achievement)
                throw raise.invalid('achievement_id');
            return achievement;
        })
}

module.exports.checkConnectionById = function (idA, idB) {
    if (idA == idB) {
        return false;
    } else {
        return Promise
            .all([
                this.queryUserBySessionId(idA),
                this.queryUserByUserId(idB)
            ])
            .spread(function (userA, userB) {
                return Relationship
                    .find({ where: { following: userA.id, follower: userB.id} })
                    .then(function (rel) {
                        if (!rel) return false;
                        else return true;
                    });
            });
    }
}

module.exports.checkConnection = function (userA, userB) {
    if (userA.id == userB.id) {
        return false;
    } else {
        return Relationship
            .find({ where: { following: userA.id, follower: userB.id} })
            .then(function (rel) {
                if (!rel) return false;
                else return true;
            });
    }
}