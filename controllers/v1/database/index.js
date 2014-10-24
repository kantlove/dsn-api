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
});

/* Models */

var User = client.define('User', {
    fullname: { type: sequelize.STRING, allowNull: false },
    username: { type: sequelize.STRING, allowNull: false },
    password: { type: sequelize.STRING, allowNull: false },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
    }
});

var Dream = client.define('Dream', {
    text: { type: sequelize.TEXT, allowNull: false }
});

var DreamLike = client.define('DreamLike', {
    
});

var DreamComment = client.define('DreamComment', {
    text: { type: sequelize.TEXT, allowNull: false }
});

var Achievement = client.define('Achievement', {
    text: { type: sequelize.TEXT, allowNull: false }
});

var AchievementLike = client.define('AchievementLike', {
    
});

var AchievementComment = client.define('AchievementComment', {
    text: { type: sequelize.TEXT, allowNull: false }
});

/* Relations */

Dream.belongsTo(User);
Dream.hasMany(DreamLike, { as: 'Likes'});
Dream.hasMany(DreamComment, { as: 'Comments' });

DreamLike.belongsTo(User);
DreamLike.belongsTo(Dream);

DreamComment.belongsTo(User);
DreamComment.belongsTo(Dream);

Achievement.belongsTo(User);
Achievement.hasMany(AchievementLike, { as: 'Likes' });
Achievement.hasMany(AchievementComment, { as: 'Comments' });

AchievementLike.belongsTo(User);
AchievementLike.belongsTo(Achievement);

AchievementComment.belongsTo(User);
AchievementComment.belongsTo(Achievement);

/* Execute */

client
    .sync({ force: true })
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
    AchievementComment: AchievementComment
}