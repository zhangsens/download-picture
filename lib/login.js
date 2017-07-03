const https = require("https");
const io = require("cheerio");
const get_cookie = require("./get-cookie");
const config = require("./config");
const login = config.login;

var log = function() {
    var cookie;
    https.get("https://accounts.pixiv.net/login", function(res) {
        var html = "";
        var cookie = res.headers["set-cookie"];
        res.on("data", function(chunk) {
            html += chunk;
        });
        res.on("end", function() {
            var $ = io.load(html);
            var post_key = $("input[name=post_key]").attr("value");
            login.post_key = post_key;
            cookie = get_cookie(login, cookie.join());
            return cookie;
        });
    })
}

module.exports = log;