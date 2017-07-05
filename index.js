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

var _date = process.argv.slice(2)[0]; //自定义时间 20170101,长度为8
var today = new Date();
today.setTime(today - 24 * 60 * 60 * 1000);
var day = JSON.stringify(today.getDate()).length < 2 ? "0" + today.getDate() : today.getDate();
var month = JSON.stringify(today.getMonth() + 1).length < 2 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1;
var year = today.getFullYear();
var date = _date || year + month + day;

//set cookie and save it.when some page need cookie,use it.
fs.exists("cookie/pixiv.txt", function(exists) {
    if (exists) {
        //var cookie = fs.readFileSync("cookie/pixiv.txt", "utf-8");
        fs.readFile("cookie/pixiv.txt", "utf-8", function(err, res) {

            cookie = res;
            console.log(cookie + "\n");

            var picture_path = fs.existsSync("./picture");
            if (!picture_path) {
                fs.mkdirSync("./picture");
            }

            if (date.length == 8) {
                daily_rank(cookie, date);
            } else {
                console.log("输入的日期格式不正确");
            }


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