/*
 * connectedpapers.js
 *
 * Author:      Frank Lee (Jiang Li)
 * Website:     https://lijfrank.github.io/
 * Repository:  https://github.com/lijfrank-open/CAAI-Rank-Display/
 * License:     MIT License
*/

const connectedpapers = {};

connectedpapers.rankSpanList = [];

connectedpapers.run = function () {
  let url = window.location.pathname;
  window.onload = function () {
      if (url.indexOf("/main") != -1) {
        setInterval(function () {
          connectedpapers.appendRanks();
          connectedpapers.observeCitations();
        }, 700);
      }
  };
};

connectedpapers.observeCitations = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        connectedpapers.appendRanks();
      }
    }
  });
  const targetNode = document.querySelector("items-list");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

connectedpapers.appendRanks = function () {
  let elements = $(".list-group-item-mod");
  elements.each(function (index) {
    let node = $(this).find(".horizontal-flexbox h5").first();
    if (!node.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let titleNode = $(this).find(".searchable-text").first();
      let metadataNode = $(this).find(".horizontal-flexbox.metadata-item");
      let authorNode = metadataNode.find(".searchable-text.authors");
      let yearNode = metadataNode.find("div:not(.searchable-text)");
      // let title = titleNode.text();
      let title = titleNode.text().replace(/\+/g, '-')
      // console.log("titles: ", title);
      // let author = authorNode.text().split(',')[0].split(' ')[1];
      // let author = authorNode[0]
      //   .innerText.replace(/[\†\‡\※\*\…\,\-]/g, "")
      //   .split(" ")[1];
      let author = authorNode[0]
        .innerText.split(", ")[0]
        .replace(/[\†\‡\※\*\…\,\-]/g, "")
        .split(" ").pop();
      // console.log("authors: ", author);
      let year = yearNode.text();
      // console.log("years: ", year);
      $(this).addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(node, title, author, year, connectedpapers);
      }, 100 * index);
    }
  });
};