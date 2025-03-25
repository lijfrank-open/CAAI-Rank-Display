const aminer = {};

aminer.rankSpanList = [];

aminer.run = function () {
  let url = window.location.pathname;
  if (url == "/") {
    aminer.appendRank();
    aminer.observeCitation();
  } else if (url.startsWith("/profile/")) {
    aminer.appendRanks();
    aminer.observeCitations();
  }
  else if (url.startsWith("/search/pub")) {
    aminer.appendRankss();
    aminer.observeCitationss();
  }
};

aminer.observeCitation = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        aminer.appendRank();
      }
    }
  });
  const targetNode = document.querySelector("a-aminer-components-pub-publication-list-aminerPaperList");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

aminer.observeCitations = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        aminer.appendRanks();
      }
    }
  });
  const targetNode = document.querySelector("a-aminer-components-pub-publication-list-aminerPaperList");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

aminer.observeCitationss = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        aminer.appendRankss();
      }
    }
  });
  const targetNode = document.querySelector("a-aminer-components-pub-publication-list-aminerPaperList");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

// 
aminer.appendRank = function () {
  let elements = $(".paper-item");
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find("span.paper-title");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find("div.authors");
      let yearNode = element.find("div.source");
      let title = titleNode.text().replace(/\+/g, '-').trim();
      // console.log("title: ", title);
      let author = authorNode.text().trim()
      .split(/,\s*/)[0]
      .split(/\s+/).pop();
      // console.log("authorNode: ", authorNode.text());
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, aminer);
      }, 100 * index);
    }
  });
};

// /profile/
aminer.appendRanks = function () {
  let elements = $(".paper-item");
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find("span.paper-title");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find("div.authors");
      let yearNode = element.find("div.venue-link");
      let title = titleNode.text().replace(/\+/g, '-').trim();
      // console.log("title: ", title);
      let author = authorNode.text().trim()
      .split(/,\s*/)[0]
      .split(/\s+/).pop();
      // console.log("authorNode: ", authorNode.text());
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, aminer);
      }, 100 * index);
    }
  });
};

// /search/pub
aminer.appendRankss = function () {
  let elements = $(".paper-item");
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find("span.paper-title");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find("div.authors");
      let yearNode = element.find("div.venue-link");
      let title = titleNode.text().replace(/\+/g, '-').trim();
      // console.log("title: ", title);
      let author = authorNode.text().trim()
      .split(/,\s*/)[0]
      .split(/\s+/).pop();
      // console.log("authorNode: ", authorNode.text());
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, aminer);
      }, 100 * index);
    }
  });
};