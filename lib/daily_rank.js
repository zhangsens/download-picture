//get daily rank
const https = require("https");
const io = require("cheerio");

const getImgUrl = require("./getImgUrl.js")

function daily_rank(cookie) {

    https.get("https://www.pixiv.net/ranking.php?mode=daily&content=illust", function(res) {

        var html = "";

        res.on("data", function(chunk) {
            html += chunk;
        });

        res.on("end", function(res) {
            var $ = io.load(html);
            var content = $("section h2 a");
            getImgUrl(content, cookie);
        })

    })

}

module.exports = daily_rank;