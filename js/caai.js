/*
 * caai.js
 *
 * Author:      WenyanLiu, Kai Chen, dozed，Frank Lee (Jiang Li)
 * Website:     https://lijfrank.github.io/
 * Repository:  https://github.com/lijfrank-open/CAAI-Rank-Display/
 * License:     MIT License
*/

const caai = {};

const checkConsecutiveWords = (key, targetWords, requiredCount) => {
  const stopWords = new Set(["ON", "IN", "OF", "TO", "FOR", "A", "AN", "PROCEEDINGS"]);
  const keyWords = key.split(/[\s\-_]+/).map(w => w.toUpperCase()).filter(word => !stopWords.has(word));
  const targetSegments = targetWords.split(/[\s,]+/).map(w => w.toUpperCase()).filter(word => !stopWords.has(word));
  // console.log("key: ", key);
  // console.log("targetWords: ", targetWords);
  // console.log("keyWords: ", keyWords);
  // console.log("targetSegments: ", targetSegments);
  return targetSegments.length >= requiredCount && Array.from({ length: targetSegments.length - requiredCount + 1 }, (_, i) => {
    const segment = targetSegments.slice(i, i + requiredCount).join(' ');
    return keyWords.join(' ').includes(segment);
  }).some(Boolean);
};

caai.getRankInfo = function (refine, type) {
  let rankInfo = {
    ranks: [],
    info: ""
  };
  let rank = "none";
  let url = "";

  if (type === "url") {
    url = refine;
    rank = caai.rankUrl[url] || "none";
  } else if (type === "abbr") {
    if (refine === undefined) {
      rankInfo.info += "Not Found\n";
    } else {
      let full = caai.abbrFull[refine];
      if (full === undefined) {
        let refineTrimmed = refine.substring(0, refine.length - 1);
        // let refineTrimmed = refine.substring(0, refine.length);
        // console.log("refineTrimmed: ", refineTrimmed);
        // let res = Object.keys(caai.fullUrl).find(k => k.startsWith(refineTrimmed.toUpperCase()));
        let res;
        if (refineTrimmed.split(/\s+/).length > 5){
          // console.log("refineTrimmed.split: ", refineTrimmed.split(/\s+/));
          res = Object.keys(caai.fullUrl).find(k => checkConsecutiveWords(k, refineTrimmed, 4));
        }
        else {
          res = Object.keys(caai.fullUrl).find(k => k.toUpperCase().startsWith(refineTrimmed.toUpperCase())); // 不区分大小写
        }
        // console.log("res: ", res);
        url = res ? caai.fullUrl[res] : "";
      } else {
        url = caai.fullUrl[full] || "";
      }
      rank = caai.rankUrl[url] || "none";
    }
  } else if (type === "meeting") {
    let full = caai.abbrFull[refine];
    url = caai.fullUrl[full] || "";
    rank = caai.rankUrl[url] || "none";
  } else {
    url = caai.fullUrl[refine] || "";
    rank = caai.rankUrl[url] || "none";
  }

  if (rank === "none") {
    rankInfo.info += "Not Found\n";
  } else {
    rankInfo.info += caai.rankFullName[url] || "";
    let abbrname = caai.rankAbbrName[url] || "";
    if (abbrname) {
      rankInfo.info += ` (${abbrname})`;
    }
    if (rank === "E") {
      rankInfo.info += ": Expanded\n";
    } else if (rank === "P") {
      rankInfo.info += ": Preprint\n";
    } else {
      rankInfo.info += `: CAAI-${rank}\n`;
    }
  }

  rankInfo.ranks.push(rank);
  return rankInfo;
};

caai.getRankClass = function (ranks) {
  const rankOrder = ["A", "B", "C", "E", "P"];
  for (let rank of rankOrder) {
    if (ranks.includes(rank)) {
      return `caai-${rank.toLowerCase()}`;
    }
  }
  return "caai-none";
};

caai.getRankSpan = function (refine, type) {
  let rankInfo = caai.getRankInfo(refine, type);
  // console.log("refine: ", refine);
  // console.log("type: ", type);
  // console.log("rankInfo: ", rankInfo);
  let span = $("<span>")
    .addClass("caai-rank")
    .addClass(caai.getRankClass(rankInfo.ranks));

  if (rankInfo.ranks[0] === "E") {
    span.text("Expanded");
  } else if (rankInfo.ranks[0] === "P") {
    span.text("Preprint");
  } else if (rankInfo.ranks[0] === "none") {
    span.text("CAAI-None");
  } else {
    span.text(`CAAI-${rankInfo.ranks.join("/")}`);
  }

  if (rankInfo.info) {
    span
      .addClass("caai-tooltip")
      .append($("<pre>").addClass("caai-tooltiptext").text(rankInfo.info));
  }

  return span;
};