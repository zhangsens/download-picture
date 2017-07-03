const https = require("https");
const fs = require("fs");
const path = require("path");
const request = require("request");
const io = require("cheerio");

const login = require("./lib/login.js");
const daily_rank = require("./lib/daily_rank.js");

const imgHead = "https://i.pximg.net/img-original";
const pixiv_url = "https://www.pixiv.net/";

var cookie;

//set cookie and save it.when some page need cookie,use it.
fs.exists("cookie/pixiv.txt", function(exists) {

    if (exists) {
        //var cookie = fs.readFileSync("cookie/pixiv.txt", "utf-8");
        fs.readFile("cookie/pixiv.txt", "utf-8", function(err, res) {

            cookie = res;
            console.log(cookie);

            var picture_path = fs.existsSync("./picture");
            if (!picture_path) {
                fs.mkdirSync("./picture");
            }

            daily_rank(cookie);


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

        });
    } else {
        cookie = login();
        console.log(cookie);
        console.log("cookie已建立，再次运行开始正常操作XD");
    }
})