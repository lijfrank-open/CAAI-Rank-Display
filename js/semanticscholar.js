const semanticscholar = {};

semanticscholar.rankSpanList = [];

semanticscholar.run = function () {
  let url = window.location.pathname;
  if (url.startsWith("/me/research")) {
    semanticscholar.appendRank();
    semanticscholar.observeCitation();
  } else if (url.startsWith("/paper/")) {
    semanticscholar.appendRanks();
    semanticscholar.observeCitations();
  }
  else if (url.startsWith("/search")) {
    semanticscholar.appendRankss();
    semanticscholar.observeCitationss();
  }
};

semanticscholar.observeCitation = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        semanticscholar.appendRank();
      }
    }
  });
  const targetNode = document.querySelector("research-list__content");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

semanticscholar.observeCitations = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        semanticscholar.appendRanks();
      }
    }
  });
  const targetNode = document.getElementById("main-content");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

semanticscholar.observeCitationss = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        semanticscholar.appendRankss();
      }
    }
  });
  const targetNode = document.getElementById("main-content");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

// me/research
semanticscholar.appendRank = function () {
  let elements = $(".cl-paper-row");
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find(".cl-paper-title");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find(".cl-paper-authors span").first();
      let yearNode = element.find(".cl-paper-pubdates span");
      let title = titleNode.text().replace(/\+/g, '-').trim();
      // console.log("title: ", title);
      let author = authorNode.text().replace(/[\†\‡\※\*\…\,\-]/g, "")
      .split(" ").pop().trim();
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, semanticscholar);
      }, 100 * index);
    }
  });
};

//paper
semanticscholar.appendRanks = function () {
  let element = $(".fresh-paper-detail-page__header");
  let titleNode = element.find("h1[data-test-id='paper-detail-title']");
  if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
    let authorNode = element.find(".author-list span").first();
    let yearNode = element.find("span[data-test-id='paper-year']");
    let title = titleNode.text().replace(/\+/g, '-').trim();
    // console.log("title: ", title);
    let author = authorNode.text().replace(/[\†\‡\※\*\…\,\-]/g, "")
    .split(" ").pop().trim();
    // console.log("author: ", author);
    let year = yearNode.text().match(/\d{4}/);
    year = year ? year[0].trim() : "";
    // console.log("year: ", year);
    element.addClass("caai-ranked");
    // if (title && author && year && !element.hasClass("caai-ranked")) {
    fetchRank(titleNode, title, author, year, semanticscholar);
    // }
  }
  let elements = $(".cl-paper-row");
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find(".cl-paper-title");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find(".cl-paper-authors span").first();
      let yearNode = element.find(".cl-paper-pubdates span");

      let title = titleNode.text().replace(/\+/g, '-').trim();
      // console.log("title: ", title);
      let author = authorNode.text().replace(/[\†\‡\※\*\…\,\-]/g, "")
      .split(" ").pop().trim();
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, semanticscholar);
      }, 100 * index);
    }
  });
  // let elements_ = $(".cl-container");
  // elements_.each(function (index) {
  //   let element = $(this);
  //   let titleNode = element.find(".cl-paper-title");
  //   if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
  //     let authorNode = element.find(".cl-paper-authors span").first();

  //     let title = titleNode.text().replace(/\+/g, '-').trim();
  //     // console.log("title_: ", title);
  //     let author = authorNode.text().replace(/[\†\‡\※\*\…\,\-]/g, "")
  //     .split(" ").pop().trim();
  //     // console.log("author_: ", author);
  //     let year = "";
  //     console.log("year_: ", year);
  //     // element.addClass("caai-ranked");
  //     setTimeout(function () {
  //       fetchRank(titleNode, title, author, year, semanticscholar);
  //     }, 100 * index);
  //   }
  // });
};

// search
semanticscholar.appendRankss = function () {
  let elements = $(".cl-paper-row");
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    // console.log("element: ", element);
    let titleNode = element.find(".cl-paper-title");
    // console.log("title: ", title);
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find(".cl-paper-authors span").first();
      let yearNode = element.find(".cl-paper-pubdates span");
      let title = titleNode.text().replace(/\+/g, '-').replace(/\s+/g, ' ').trim();
      // console.log("title: ", title);
      let author = authorNode.text().replace(/[\†\‡\※\*\…\,\-]/g, "")
      .split(" ").pop().trim();
      // console.log("author: ", author);
      let year = yearNode.text().match(/\d{4}/);
      year = year ? year[0].trim() : "";
      // console.log("year: ", year);
      element.addClass("caai-ranked");
      setTimeout(function () {
        fetchRank(titleNode, title, author, year, semanticscholar);
      }, 100 * index);
    }
  });
};