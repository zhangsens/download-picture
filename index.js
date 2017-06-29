var https = require("https");
var fs = require("fs");
var path = require("path");
var request = require("request");
var io = require("cheerio");

var login = require("./lib/login.js");
var save = require("./lib/save.js");

var imgHead = "https://i.pximg.net/img-original";

var pixiv_url = "https://www.pixiv.net/";

var cookie;

//set cookie and save it.when some page need cookie,use it.
fs.exists("cookie/pixiv.txt", function(exists) {
    if (exists) {
        //var cookie = fs.readFileSync("cookie/pixiv.txt", "utf-8");
        fs.readFile("cookie/pixiv.txt", "utf-8", function(err, res) {
            cookie = res;
            console.log(cookie);

            //test cookie
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

            daily_rank();
        });
    } else {
        cookie = login();
        console.log(cookie);
        console.log("cookie已建立，关闭再次运行开始正常操作XD");
    }
})

//get daily rank
function daily_rank() {
    https.get("https://www.pixiv.net/ranking.php?mode=daily&content=illust", function(res) {
        var html = "";
        res.on("data", function(chunk) {
            html += chunk;
        });
        res.on("end", function(res) {
            var $ = io.load(html);
            var content = $("section h2 a");
            getImgUrl($, content);
        })
    })
}

//
function getImgUrl($, content) {

    var img_url = {};
    var jar = request.jar();
    jar.setCookie(cookie, "https://www.pixiv.net/");
    content.each(function(index, title) {
        img_url[index] = title.attribs.href.match(/illust_id.[0-9]*/g);
        request({
            url: "https://www.pixiv.net/member_illust.php?mode=medium&" + img_url[index],
            headers: {
                'Referer': "https://www.pixiv.net",
                'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
            },
            jar: jar
        }, function(err, res, body) {
            fs.writeFile("./log/pixiv_" + index + ".html", body, "utf-8", function() {});
        });

        // https.get("https://www.pixiv.net/member_illust.php?mode=medium&" + img_url[index], function(res) {
        //     let _html = "";

        //     res.on("data", function(chunk) {
        //         _html += chunk;
        //     });
        //     res.on("end", function() {
        //         let $ = io.load(_html);
        //         let imgUrl = $(".img-container img").attr("src");
        //         let name = $(".img-container img").attr("src").match(/[0-9]*_[a-z][0-9]*/g);
        //         img_url[index] = imgHead + imgUrl.match(/\/img\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*\/[0-9]*_[a-z][0-9]*/g) + ".png";
        //         console.log(img_url[index]);
        //         //save(img_url[index], name);
        //     })
        // })
    });
}