const semanticscholar = {};

semanticscholar.rankSpanList = [];

semanticscholar.run = function () {
  let url = window.location.pathname;
  setInterval(function () {
    $(window).bind("popstate", function () {
      semanticscholar.appendRanks();
    });
    semanticscholar.appendRanks();
  }, 700);
};

semanticscholar.appendRanks = function () {
  let elements = $(".cl-paper-venue");
  elements.each(function () {
    let element = $(this);
    let source = element[0].innerText;
    // console.log("element: ", element);
    // console.log("source: ", source);
    if (source.length != 0 && !element.next().hasClass("caai-rank")) {
      for (let getRankSpan of semanticscholar.rankSpanList) {
        if (source.includes("(")) {
          source = source.substring(
            source.indexOf("(") + 1,
            source.indexOf(")"),
          );
        }
        // console.log("source: ", source);
        if (source.includes("'")) {
          source = source.substring(0, source.indexOf("'")).trim();
        }
        element.after(getRankSpan(source, "abbr"));
        // console.log("source: ", source);
        // console.log("getRankSpan: ", getRankSpan(source, "abbr"));
      }
    }
  });
};

semanticscholar.appendRank = function (selector) {
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
