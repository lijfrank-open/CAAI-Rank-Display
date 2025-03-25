dblp.rankSpanList.push(caai.getRankSpan);
scholar.rankSpanList.push(caai.getRankSpan);
connectedpapers.rankSpanList.push(caai.getRankSpan);
semanticscholar.rankSpanList.push(caai.getRankSpan);
aminer.rankSpanList.push(caai.getRankSpan);
// scopus.rankSpanList.push(caai.getRankSpan);

if (window.location.hostname.startsWith("dblp")) {
  dblp.run();
} else if (window.location.hostname.startsWith("scholar.google")) {
  scholar.run();
} else if (window.location.hostname.includes("connectedpaper")) {
  connectedpapers.run();
} else if (window.location.hostname.includes("semanticscholar")) {
  semanticscholar.run();
} else if (window.location.hostname.includes("aminer")) {
  aminer.run();
}
// else if (window.location.hostname.includes("scopus")) {
//   scopus.run();
// }
filter.init();
