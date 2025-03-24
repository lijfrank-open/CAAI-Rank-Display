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

scholar.appendRanks = function () {
  let elements = $("tr.gsc_a_tr");
  elements.each(function (index) {
    let node = $(this).find("td.gsc_a_t > a").first();
    if (!node.next().hasClass("caai-rank") && !$(this).hasClass("caai-ranked")) {
      // let title = node.text();
      let title = node.text().replace(/\+/g, '-')
      // console.log("titles: ", title);
      let author = $(this)
        .find("div.gs_gray")[0]
        .innerText.split(", ")[0]
        .replace(/[\†\‡\※\*\…\,\-]/g, "")
        .split(" ").pop();
      let year = $(this).find("td.gsc_a_y").text();
      $(this).addClass("caai-ranked");
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