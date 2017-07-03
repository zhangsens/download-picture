const request = require("request");
const fs = require("fs");

function save(urls, name) {
    var jar = request.jar();
    var rcookie = "";
    for (let index in urls) {
        jar.setCookie(rcookie, urls[index]);
        let req = request({
                url: urls[index],
                headers: {
                    'Referer': "http://www.pixiv.net",
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
                },
                jar: jar
            }, function(err, res, body) {})
            .pipe(fs.createWriteStream('picture/' + name + "_" + index + '.png'))
            .on('close', function() {
                console.log(`${name}_${index} save complete!`);
            });
    }
}

module.exports = save;