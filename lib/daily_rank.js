//get daily rank
const https = require("https");
const fs = require("fs");
const io = require("cheerio");

const getImgUrl = require("./getImgUrl.js")

function daily_rank(cookie, date) {

    https.get("https://www.pixiv.net/ranking.php?mode=daily&content=illust&date=" + date, function(res) {

        var html = "";
        fs.exists("./picture/" + date, function(exists) {
            if (!exists) {
                fs.mkdir("./picture/" + date);
            }
        })

        res.on("data", function(chunk) {
            html += chunk;
        });

        res.on("end", function(res) {
            var $ = io.load(html);
            var content = $("section h2 a");
            getImgUrl(content, cookie, date);
        })

    })

}

module.exports = daily_rank;