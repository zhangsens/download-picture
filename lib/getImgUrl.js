//get the pictures' url
const request = require("request");
const io = require("cheerio");

const save = require("./save");

const pixiv_url = "https://www.pixiv.net/";

function getImgUrl(content, cookie) {

    var img_url = [];
    var name, href;
    var jar = request.jar();
    jar.setCookie(cookie, "https://www.pixiv.net/");
    for (var i = 0; i < content.length; i++) {
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
        if (index < 5) {
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

module.exports = getImgUrl;