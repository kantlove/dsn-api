module.exports.attach = function (swagger) {
    require('fs').readdirSync(__dirname).forEach(function (file) {
        if (file == "index.js" || file[0] == '_') return;
        var pos = file.indexOf('.js');
        if (pos > 0) {
            var name = file.substr(0, file.indexOf('.'));
            require('./' + name)(swagger);
        }
    });
}