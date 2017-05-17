var https = require("https");
var fs = require("fs");
var querystring = require("querystring");

function get_cookie(login, cookie) {
    var set_cookie;
    var login_data = querystring.stringify(login);
    var options = {
        host: "accounts.pixiv.net",
        path: "/api/login?lang=zh",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": login_data.length,
            "Accept": "text/html, application/xhtml+xml, */*",
            "Accept-Language": "zh-CN",
            "Cache-Control": "no-cache",
            "Connection": "Keep-Alive",
            "Host": "accounts.pixiv.net",
            "Referer": "https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index",
            "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)",
            "Cookie": cookie
        }
    };


    var req = https.request(options, function(res) {
        set_cookie = res.headers["set-cookie"];
        fs.writeFile("../cookie/pixiv.txt", set_cookie, "utf-8", function() {})
    });
    req.write(login_data);
    req.end();
}

module.exports = get_cookie;