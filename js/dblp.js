/*
 * dblp.js
 *
 * Author:      WenyanLiu, FlyingFog
 * License:     MIT License
*/

const dblp = {};

dblp.rankSpanList = [];

dblp.run = function () {
  let url = window.location.pathname;
  if (url.includes("/pid/")) {
    dblp.appendRanks();
  } else if (url.includes("/db/")) {
    if (url.includes("/index.html")) {
      dblp.appendRank("h1");
    } else {
      dblp.appendRank("#breadcrumbs > ul > li > span:nth-child(3) > a > span");
    }
  } else {
    setInterval(function () {
      let message = $("#completesearch-publs > div > p.waiting");
      if (message.css("display") == "none") {
        $(window).bind("popstate", function () {
          dblp.appendRanks();
        });
        dblp.appendRanks();
      }
    }, 700);
  }
};

dblp.appendRanks = function () {
  let elements = $("cite > a");
  elements.each(function () {
    let element = $(this);
    let source = element.attr("href");
    if (source.length != 0 && !element.next().hasClass("caai-rank")) {
      for (let getRankSpan of dblp.rankSpanList) {
        let issueName = element.find("span[itemprop=issueNumber]").text();
        if (issueName.length != 0 && isNaN(issueName)) {
          var abbrName = caai.abbrFull[issueName];
          if (typeof abbrName != "undefined") {
            element.after(getRankSpan(issueName, "abbr"));
            continue;
          }
        }

        let urls = source.substring(
          source.indexOf("/db/") + 3,
          source.lastIndexOf(".html"),
        );
        var pattern = /[0-9]{1,4}(-[0-9]{1,4})?$/;
        if (pattern.test(urls)) {
          urls = urls.replace(pattern, "");
        } else {
          urls = "";
        }
        element.after(getRankSpan(urls, "url"));
      }
    }
  });
};

dblp.appendRank = function (selector) {
  let element = $(selector);
  let headline = window.location.pathname;
  if (headline.length != 0) {
    for (let getRankSpan of dblp.rankSpanList) {
      let urls = headline.substring(
        headline.indexOf("/db/") + 3,
        headline.lastIndexOf("/"),
      );
      url = caai.rankDb[urls];
      element.after(getRankSpan(url, "url"));
    }
  }
};
