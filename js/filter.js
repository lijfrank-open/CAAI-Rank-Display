const filter = {
  currentFilter: "ALL",
  processedEntries: new Set(),

  init() {
    if (!window.location.hostname.startsWith("dblp")) {
      return;
    }

    this.createFilterButtons();
    this.bindEvents();
    this.setupInfiniteScrollHandler();
  },

  createFilterButtons() {
    const filterDiv = document.createElement("div");
    filterDiv.className = "caai-filter";
    filterDiv.innerHTML = `
      <button data-rank="ALL" class="active">ALL</button>
      <button data-rank="A">CAAI-A</button>
      <button data-rank="B">CAAI-B</button>
      <button data-rank="C">CAAI-C</button>
    `;
    document.body.appendChild(filterDiv);
  },

  setupInfiniteScrollHandler() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.applyFilter(true);
        }
      });
    });

    const trigger = document.querySelector("#completesearch-publs");
    if (trigger) {
      observer.observe(trigger);
    }

    window.addEventListener(
      "scroll",
      this.debounce(() => {
        this.applyFilter(true);
      }, 200),
    );
  },

  applyFilter(preserveExisting = false) {
    const entries = document.querySelectorAll(
      "#completesearch-publs > div > ul > li",
    );
    entries.forEach((entry) => {
      const entryId = entry.querySelector("a")?.href || entry.innerHTML;
      if (this.processedEntries.has(entryId) && preserveExisting) {
        return;
      }

      this.processedEntries.add(entryId);

      const hasCAAIC = entry.textContent.includes("CAAI-C");
      const hasCAAIB = entry.textContent.includes("CAAI-B");
      const hasCAAIA = entry.textContent.includes("CAAI-A");

      let shouldShow = false;

      if (this.currentFilter === "ALL") {
        shouldShow = true;
      } else if (this.currentFilter === "C" && hasCAAIC) {
        shouldShow = true;
      } else if (this.currentFilter === "B" && hasCAAIB) {
        shouldShow = true;
      } else if (this.currentFilter === "A" && hasCAAIA) {
        shouldShow = true;
      }

      const currentlyVisible = entry.style.display !== "none";
      if (currentlyVisible !== shouldShow || !preserveExisting) {
        entry.style.display = shouldShow ? "" : "none";
      }
    });
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  bindEvents() {
    document.querySelector(".caai-filter").addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        document.querySelectorAll(".caai-filter button").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");

        this.currentFilter = e.target.dataset.rank;
        this.applyFilter(false);
      }
    });
  },
};
