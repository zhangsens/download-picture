var request = require("request");
var fs = require("fs");

function save(urls) {
    var jar = request.jar();
    var rcookie = "";
    fs.exists("../picture/", function(exists) {
        if (!exists) {
            fs.mkdir("../picture/", function(err) {
                if (err) throw err;
            });
        }
        for (var index in urls) {
            jar.setCookie(rcookie, urls[index]);
            request({
                url: urls[index],
                headers: {
                    'Referer': "http://www.pixiv.net",
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
                },
                jar: jar
            }, function(err, res, body) {}).pipe(fs.createWriteStream('picture/' + index + '.png'));
        }
    })
}

module.exports = save;