var https = require("https");
var fs = require("fs");
var path = require("path");
var request = require("request");
var io = require("cheerio");

var login = require("./lib/login.js");
var save = require("./lib/save.js");

var imgHead = "https://i.pximg.net/img-original";

var pixiv_url = "https://www.pixiv.net/";

fs.exists("cookie/pixiv.txt", function(exists) {
    if (exists) {
        //var cookie = fs.readFileSync("cookie/pixiv.txt", "utf-8");
        fs.readFile("cookie/pixiv.txt", "utf-8", function(err, res) {
            var cookie = res;
            console.log(cookie);
            var jar = request.jar();
            jar.setCookie(cookie, "https://www.pixiv.net/");
            request({
                url: pixiv_url,
                headers: {
                    'Referer': "https://www.pixiv.net",
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
                },
                jar: jar
            }, function(err, res, body) {
                fs.writeFile("./log/pixiv.html", body, "utf-8", function() {});
            });
        });
    } else {
        login();
    }
})


https.get("https://www.pixiv.net/ranking.php?mode=daily&content=illust", function(res) {
    var html = "";
    res.on("data", function(chunk) {
        html += chunk;
    });
    res.on("end", function(res) {
        var $ = io.load(html);
        var content = $("section h2 a");
        //var urls = getImgUrl($, content);
        // var urls = [
        //     "https://i.pximg.net/img-original/img/2017/05/15/00/26/54/62906806_p0.png",
        //     "https://i.pximg.net/img-original/img/2017/05/15/02/29/54/62908861_p0.jpg"
        // ];
        // save(urls);
    })
})

function getImgUrl($, content) {
    var img_url = {};
    content.each(function(index, title) {
        img_url[index] = title.attribs.href.match(/illust_id.[0-9]*/g);
        https.get("https://www.pixiv.net/member_illust.php?mode=medium&" + img_url[index], function(res) {
            let _html = "";

            res.on("data", function(chunk) {
                _html += chunk;
            });
            res.on("end", function() {
                let $ = io.load(_html);
                let imgUrl = $(".img-container img").attr("src");
                let name = $(".img-container img").attr("src").match(/[0-9]*_[a-z][0-9]*/g);
                img_url[index] = imgHead + imgUrl.match(/\/img\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*_[a-z][0-9]*/g) + ".png";
                save(img_url[index], name);
            })
        })
    });
}