/*
 * fetchRank.js
 *
 * Author:      WenyanLiu, FlyingFog, mra42, dozed, Frank Lee (Jiang Li)
 * Website:     https://lijfrank.github.io/
 * Repository:  https://github.com/lijfrank-open/CAAI-Rank-Display/
 * License:     MIT License
*/

function fetchRank(node, title, authorA, year, site) {
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;

  let query_url =
    "https://dblp.org/search/publ/api?q=" +
    encodeURIComponent(title + "  author:" + authorA) +
    "&format=json&app=CAAIrank4dblp_" +
    version;

  let cached = apiCache.getItem(query_url);
  if (cached) fetchFromCache(cached, node, title, authorA, year, site);
  else fetchFromDblpApi(query_url, node, title, authorA, year, site);
}

function fetchFromCache(cached, node, title, authorA, year, site) {
  console.debug('fetch from cache: %s (%s) "%s"', authorA, year, title);

  let dblp_url = cached.dblp_url;
  let resp = cached.resp;
  let resp_flag = cached.flag;

  // console.log("dblp_url: ", dblp_url);
  processDblpUrl(dblp_url, resp, resp_flag, node, site);
}

function fetchFromDblpApi(query_url, node, title, authorA, year, site) {
  console.debug('fetch from API: %s (%s) "%s"', authorA, year, title);
  console.debug("query url: %s", query_url);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", query_url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var dblp_url = "";
      var resp = JSON.parse(xhr.responseText).result.hits;
      var resp_flag = true;
      if (resp["@total"] == 0) {
        resp_flag = false;
      } else if (resp["@total"] == 1) {
        url = resp.hit[0].info.url;
        dblp_url = url.substring(
          url.indexOf("/rec/") + 4,
          url.lastIndexOf("/"),
        );
      } else {
        for (var h = 0; h < resp["@sent"]; h++) {
          info = resp.hit[h].info;

          var cur_venue = info.type;
          if (cur_venue == "Informal Publications") continue;

          if (Array.isArray(info.authors.author)) {
            author_1st = info.authors.author[0].text;
          } else {
            author_1st = info.authors.author.text;
          }
          year_fuzzy = info.year;
          year_last_check = 0;
          if (
            Math.abs(Number(year) - year_fuzzy) <= 1 &&
            author_1st.toLowerCase().split(" ").indexOf(authorA.toLowerCase()) != -1 &&
            year_fuzzy != year_last_check
          ) {
            year_last_check = year_fuzzy;
            url = resp.hit[h].info.url;
            if (url.includes('/corr')) {
              continue;
            }
            dblp_url_last_check = url.substring(
              url.indexOf("/rec/") + 4,
              url.lastIndexOf("/"),
            );
            // console.log("dblp_url_last_check: ", dblp_url_last_check);
            if (year_fuzzy == year + 1) {
              dblp_url = dblp_url_last_check;
            } else if (year_fuzzy == year) {
              dblp_url = dblp_url_last_check;
              break;
            } else {
              if (dblp_url == "") {
                dblp_url = dblp_url_last_check;
              }
            }
          }
        }
      }
      // console.log("dblp_url: ", dblp_url);
      dblp_url = caai.rankDb[dblp_url];
      apiCache.setItem(query_url, {
        dblp_url: dblp_url,
        resp: resp,
        flag: resp_flag,
      });

      processDblpUrl(dblp_url, resp, resp_flag, node, site);
    }
  };
  xhr.send();
}

function processDblpUrl(dblp_url, resp, resp_flag, node, site) {
  if (typeof dblp_url == "undefined" && resp_flag != false) {
    // dblp_abbr = resp.hit[0].info.number;
    dblp_abbr = resp?.hit?.[0]?.info?.number ?? null;
    if (typeof dblp_abbr != "undefined" && isNaN(dblp_abbr)) {
    } else {
      dblp_abbr = resp.hit[0].info.venue;
    }

    if (dblp_url == "/journals/pacmpl/pacmpl") {
      let number_raw = resp.hit[0]?.info?.number;
      let number = number_raw ? number_raw.toString().toLowerCase() : "";

      if (number == "") {
        for (let i = 0; i < resp["@sent"]; i++) {
          let number_raw = resp.hit[i]?.info?.number;
          if (number_raw) {
            number = number_raw.toString().toLowerCase();
            break;
          }
        }
      }

      if (number == "oopsla1" || number == "oopsla2") {
        dblp_url = "/conf/oopsla/oopsla";
      } else if (number == "popl") {
        dblp_url = "/conf/popl/popl";
      } else if (number == "pldi") {
        dblp_url = "/conf/pldi/pldi";
      } else if (number == "icfp") {
        dblp_url = "/conf/icfp/icfp";
      }
    }

    for (let getRankSpan of site.rankSpanList) {
      $(node).after(getRankSpan(dblp_url || dblp_abbr, dblp_url ? "url" : "abbr"));
    }
  } else {
    for (let getRankSpan of site.rankSpanList) {
      $(node).after(getRankSpan(dblp_url, "url"));
    }
  }
}