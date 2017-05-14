var http = require("http");
var https = require("https");
var fs = require("fs");
var io = require("cheerio");
var express = require("express");
var superagent = require("superagent");
var jQuery = require("jquery");

var target_url = "https://www.pixiv.net/ranking.php?mode=daily&content=illust";

var fileNum = Math.floor(Math.random() * 100);

https.get(target_url, function(res) {
    var date = new Date();
    var day = date.getDate();
    var mouth = date.getMonth() + 1;
    var year = date.getFullYear();
    var html = "";

    res.on("data", function(chunk) {
        html += chunk;
    });

    res.on("end", function() {
        var $ = io.load(html);
        var content = $("section h2 a");
        var picture_href = pictureHref($, content);

        fs.writeFile("log/pixiv_rank" + year + mouth + day + "_" + fileNum + ".txt", JSON.stringify(picture_href), "utf-8", function(err) {
            if (err) throw err;
        });
    });
})

function pictureHref($, content) {
    var pics = {};
    content.each(function(index, tag) {
        pics[index] = {
            "title": tag.children[0].data,
            "href": "https://www.pixiv.net/" + tag.attribs.href
        };
    });
    return pics;
}

function savePicture($, src) {
    https.get(src, function(res) {
        var data = "";

        res.setEncoding("binary");
        res.on("data", function(chunk) {
            data += chunk;
        }).on("end", function() {
            fs.writeFile("picture/test.jpg", data, "binary", function(err) {
                if (err) throw err;
            });
        })
    })
}

function saveText($, src) {
    https.get(src, function(res) {
        var data = "";

        res.on("data", function(chunk) {
            data += chunk;
        }).on("end", function() {
            fs.writeFile("data/text.txt", data, "utf-8", function(err) {
                if (err) throw err;
            });
        });
    })
}