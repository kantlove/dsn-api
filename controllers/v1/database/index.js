var sequelize = require("sequelize");

/* Sample config.json file:

{
    dialect: 'mysql',
    username: 'username',
    password: 'password',
    host: 'localhost',
    port: '3306',
    database: 'dsn'
}

*/
var config = JSON.parse(require('fs').readFileSync('config.json', 'utf8'));
var connectionString =
    config.dialect + '://' + config.username + ':' + config.password
    + '@' + config.host + ':' + config.port + '/' + config.database;

var client = new sequelize(connectionString, {
    // more options here
    // see: http://sequelizejs.com/docs/1.7.8/usage#options
});

module.exports = client;
