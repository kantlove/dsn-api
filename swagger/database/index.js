/* Sample config.json file content:
---------------------------
{
    "dialect": "mysql",
    "username": "root",
    "password": "",
    "host": "localhost",
    "port": "3306",
    "database": "dsn"
}
---------------------------
*/

var config = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'config.json'), 'utf8'));
var connectionString =
    config.dialect + '://' + config.username + ':' + config.password
    + '@' + config.host + ':' + config.port + '/' + config.database;

/* Create a new client */
var sequelize = require("sequelize");
var client = new sequelize(connectionString, {
    // more options here
    // http://sequelizejs.com/docs/1.7.8/usage#options
    logging: false
});

/* Models */

var User = client.define('User', {
    fullname: {
        type: sequelize.STRING,
        allowNull: false,
        validate: { notNull:true, notEmpty: true }
    },
    username: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notNull:true, notEmpty: true }
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
        validate: { notNull:true, notEmpty: true }
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { notNull:true, isEmail: true }
    }
}, { underscored: true });

var Dream = client.define('Dream', {
    text: { type: sequelize.TEXT, allowNull: false }
}, { underscored: true });

var DreamLike = client.define('DreamLike', {
    value: { type: sequelize.BOOLEAN, allowNull: false, defaultValue: true }
}, { underscored: true });

var DreamComment = client.define('DreamComment', {
    text: { type: sequelize.TEXT, allowNull: false }
}, { underscored: true });

var Achievement = client.define('Achievement', {
    text: { type: sequelize.TEXT, allowNull: false }
}, { underscored: true });

var AchievementLike = client.define('AchievementLike', {
    value: { type: sequelize.BOOLEAN, allowNull: false, defaultValue: true }
}, { underscored: true });

var AchievementComment = client.define('AchievementComment', {
    text: { type: sequelize.TEXT, allowNull: false }
}, { underscored: true });

var Session = client.define('Session', {
    expire: { type: sequelize.DATE, allowNull: false }
}, { underscored: true });

/* Relations */

Dream.belongsTo(User);
Dream.hasMany(Achievement);
Dream.hasMany(DreamLike, { as: 'Likes'});
Dream.hasMany(DreamComment, { as: 'Comments' });

DreamLike.belongsTo(User);
DreamLike.belongsTo(Dream);

DreamComment.belongsTo(User);
DreamComment.belongsTo(Dream);

Achievement.hasMany(AchievementLike, { as: 'Likes' });
Achievement.hasMany(AchievementComment, { as: 'Comments' });

AchievementLike.belongsTo(User);
AchievementLike.belongsTo(Achievement);

AchievementComment.belongsTo(User);
AchievementComment.belongsTo(Achievement);

Session.belongsTo(User);

/* Execute */

client
    .sync({ force: false })
    .complete(function (err) {
        if (err) {
            console.log('An error occurred while creating the table:', err)
        } else {
            console.log('It worked!')
        }
    });

/* Exports */

module.exports.client = client;
module.exports.models = {
    User: User,
    Dream: Dream,
    DreamLike: DreamLike,
    DreamComment: DreamComment,
    Achievement: Achievement,
    AchievementLike: AchievementLike,
    AchievementComment: AchievementComment,
    Session: Session
}