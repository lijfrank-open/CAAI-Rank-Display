const scholar = {};

scholar.rankSpanList = [];

scholar.run = function () {
  let url = window.location.pathname;
  if (url == "/scholar") {
    scholar.appendRank();
  } else if (url == "/citations") {
    scholar.appendRanks();
    scholar.observeCitations();
  }
};

// dblp
scholar.appendRank = function () {
  let elements = $("#gs_res_ccl_mid > div > div.gs_ri");
  elements.each(function (index) {
    let node = $(this).find("h3 > a");
    if (!node.next().hasClass("caai-rank")) {
      // let title = node.text();
      let title = node.text().replace(/\+/g, '-')
      // console.log("titles: ", title);
      let data = $(this)
        .find("div.gs_a")
        .text()
        .replace(/[\†\‡\※\*\…\,\-]/g, "")
        .split(" ");
      let author = data[1];
      let year = data.slice(-3)[0];
      setTimeout(function () {
        // console.log("node: ", node);
        // console.log("title: ", title);
        // console.log("author: ", author);
        // console.log("year: ", year);
        // console.log("scholar: ", scholar);
        fetchRank(node, title, author, year, scholar);
      }, 100 * index);
    }
  });
};

scholar.observeCitations = function () {
  console.debug("Start citations ...");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        scholar.appendRanks();
      }
    }
  });
  const targetNode = document.getElementById("gsc_a_b");
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
  }
};

// page
scholar.appendRanks = function () {
  let elements = $(".gsc_a_tr");
  elements.each(function () {
    let element = $(this);
    let sourceNode = element.find("div.gs_gray:last-child");
    let source = sourceNode.text().trim();
    // console.log("source: ", source);

    source = source.split(',')[0]
                        .trim()
                        .replace(/\s*\d+[a-zA-Z]*\s*/g, " ")
                        .replace(/\s*\([^)]*\)\s*/g, " ")
                        .replace(/[.:…]/g, "")
                        .replace(/\barXiv preprint arXiv\b/g, "arXiv")
                        .trim();
    // console.log("source: ", source);

    if (source.length > 0 && !element.next().hasClass("caai-rank")) {
      for (let getRankSpan of scholar.rankSpanList) {
        element.after(getRankSpan(source, "abbr"));
      }
    }
  });
};