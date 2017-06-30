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
            jar.setCookie(cookie, pixiv_url);
            request({
                url: pixiv_url,
                headers: {
                    'Referer': pixiv_url,
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
                },
                jar: jar
            }, function(err, res, body) {
                fs.writeFile("./log/pixiv.html", body, "utf-8", function() {});
            });

            var picture_path = fs.existsSync("./picture");
            if (!picture_path) {
                fs.mkdirSync("./picture");
            }

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
            getImgUrl(content);
        })
    })
}

//解析前50名页面
function getImgUrl(content) {

    var img_url = [];
    var name, href;
    var jar = request.jar();
    jar.setCookie(cookie, "https://www.pixiv.net/");
    for (var i = 0; i < 5; i++) {
        img_url[i] = {};
        name = content[i].children[0].data;
        href = /illust_id.([0-9]*)/g.exec(content[i].attribs.href);
        img_url[i].name = name;
        img_url[i].href = href[0];
        img_url[i].id = href[1];
    };
    var index = 0;

    //逐个获取
    function httprequest() {
        if (index < 1) {
            request({
                url: "https://www.pixiv.net/member_illust.php?mode=medium&" + img_url[index].href,
                headers: {
                    'Referer': "https://www.pixiv.net",
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.3; rv:27.0) Gecko/20100101 Firefox/27.0",
                },
                jar: jar
            }, function(err, res, body) {
                var querySelector = io.load(body);
                var arr = [];
                var img = querySelector(".works_display");
                if (!img.find("a")[1]) {
                    //单张
                    arr.push(querySelector(".wrapper img")[0].attribs["data-src"]);
                    save(arr, img_url[index].id);
                } else {
                    //一次多张作品
                    arr.push(pixiv_url + img.find("a")[1].attribs.href);
                    console.log(arr, img_url[index].id);
                };
                index++;
                return httprequest();
            });
        } else {
            return false;
        }
    }
    httprequest();
}