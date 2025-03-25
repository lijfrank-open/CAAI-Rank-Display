const scopus = {};

scopus.rankSpanList = [];

scopus.run = function () {
  let url = window.location.pathname;
  if (url.startsWith("/authid/")) {
    scopus.appendRank();
    scopus.observeCitation();
  } else if (url.startsWith("/results/")) {
    scopus.appendRanks();
    scopus.observeCitations();
  }
};

scopus.observeCitation = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        scopus.appendRank();
      }
    }
  });
  const targetNode = document.querySelector(".Stack-module__tT3r4.Stack-module___CTfk.ViewType-module__nDSGx");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

scopus.observeCitations = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        scopus.appendRanks();
      }
    }
  });
  const targetNode = document.querySelector(".document-results-list-layout");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

// /authid/
scopus.appendRank = function () {
  // let elements = $(".ViewType-module__egPVa");
  let elements = $('[data-testid="results-list-item"]');
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find(".Typography-module__lVnit.Typography-module__Nfgvc.Button-module__Imdmt");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find('[data-testid="author-list"]');
      let yearNode = element.find("span.Typography-module__lVnit.Typography-module__fRnrd.Typography-module__Nfgvc");
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
        fetchRank(titleNode, title, author, year, scopus);
      }, 100 * index);
    }
  });
};

// /results/
scopus.appendRanks = function () {
  let elements = $(".TableItems-module_m0Z0b.TableItems-module__A6xTk");
  // console.log("elements: ", elements);
  elements.each(function (index) {
    let element = $(this);
    let titleNode = element.find("span.Typography-module__lVnit.Typography-module__Nfgvc.Button-module_Imdmt");
    if (!titleNode.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      let authorNode = element.find('[data-testid="author-list"]');
      let yearNode = element.find("span.Typography-module__lVnit.Typography-module__Cv8mo.Typography-module__JqXS9.Typography-module__Nfgvc");
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
        fetchRank(titleNode, title, author, year, scopus);
      }, 100 * index);
    }
  });
};