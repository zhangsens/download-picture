var https = require("https");
var fs = require("fs");
var path = require("path");
var request = require("request");

var login = require("./lib/login.js");
var save = require("./lib/save.js");

fs.exists("cookie/pixiv.txt", function(exists) {
    if (exists) {
        //var cookie = fs.readFileSync("cookie/pixiv.txt", "utf-8");
        fs.readFile("cookie/pixiv.txt", "utf-8", function(err, res) {
            var cookie = res;
            console.log(cookie);
        });
    } else {
        login();
    }
})

var urls = [
    "https://i.pximg.net/img-original/img/2017/05/15/00/26/54/62906806_p0.png",
    "https://i.pximg.net/img-original/img/2017/05/15/02/29/54/62908861_p0.jpg"
];
save(urls);