import { calculateMemberStats, animateCount } from "./members/statistics.js";
import { createMemberCard } from "./members/cardCreator.js";
import { renderPaginationButtons } from "./members/pagination.js";

document.addEventListener("DOMContentLoaded", function () {
  // Add CSS to ensure proper grid layout
  const style = document.createElement("style");
  style.textContent = `
    .isotope-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .isotope-item {
      width: 50%;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      .isotope-item {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  fetch("assets/data/members_thesis.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("members-container");
      const MEMBERS_PER_PAGE = 8;
      let allMemberElements = [];
      let currentFilter = ".filter-studying";

      // Calculate member statistics
      const { alumniCount, phdCount } = calculateMemberStats(data);

      // Update statistics in the DOM
      const alumniTextElement = document.getElementById("total-alumni-text");
      const phdTextElement = document.getElementById("total-phd-text");

      if (alumniTextElement) {
        animateCount(alumniTextElement, 0, alumniCount, 2000);
      }
      if (phdTextElement) {
        animateCount(phdTextElement, 0, phdCount, 2000);
      }

      // Clear container before adding new members
      container.innerHTML = "";

      // Create a cache for member elements
      const memberElementCache = [];

      // Process members
      Object.entries(data).forEach(([category, members]) => {
        members.sort((a, b) => (b.grade || 0) - (a.grade || 0));

        members.forEach((member) => {
          if (!member) return;

          const memberDiv = createMemberCard(member, category);
          memberElementCache.push(memberDiv.cloneNode(true));
          allMemberElements.push(memberDiv);
        });
      });

      // Pagination logic
      function renderPage(pageIndex = 1) {
        const filteredMembers = allMemberElements.filter((el) => {
          if (currentFilter === "*") return true;
          return el.matches(currentFilter);
        });

        const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);

        // Clear container content
        container.innerHTML = "";

        // Create a row wrapper
        const rowWrapper = document.createElement("div");
        rowWrapper.className = "row w-100 m-0";
        container.appendChild(rowWrapper);

        const start = (pageIndex - 1) * MEMBERS_PER_PAGE;
        const end = start + MEMBERS_PER_PAGE;
        const visibleMembers = filteredMembers.slice(start, end);

        // Render visible members
        visibleMembers.forEach((memberEl, index) => {
          const cachedElement =
            memberElementCache[allMemberElements.indexOf(memberEl)];
          if (!cachedElement) return;

          const clone = cachedElement.cloneNode(true);
          const delayClass = `animate-delay-${(index % 6) + 1}`;
          clone.classList.add(delayClass);
          clone.style.width = "";
          rowWrapper.appendChild(clone);

          const img = clone.querySelector("img");
          if (img && img.getAttribute("data-original-src")) {
            img.src = img.getAttribute("data-original-src");
          }
        });

        // Update Isotope
        setTimeout(() => {
          if (iso) {
            iso.destroy();
            iso = new Isotope(".isotope-container", {
              itemSelector: ".isotope-item",
              layoutMode: "fitRows",
              percentPosition: true,
              filter: currentFilter,
              transitionDuration: "0.5s",
            });

            imagesLoaded(container, function () {
              iso.layout();
            });
          }
        }, 50);

        renderPaginationButtons(totalPages, pageIndex, renderPage);
      }

      // Initialize Isotope
      let iso = new Isotope(".isotope-container", {
        itemSelector: ".isotope-item",
        layoutMode: "fitRows",
        percentPosition: true,
        filter: currentFilter,
      });

      // Force Isotope to relayout after images are loaded
      imagesLoaded(container, function () {
        iso.layout();
      });

      // Filtering Logic
      document.querySelectorAll(".member-filters li").forEach((filterBtn) => {
        filterBtn.addEventListener("click", function () {
          document
            .querySelector(".filter-active")
            .classList.remove("filter-active");
          this.classList.add("filter-active");
          currentFilter = this.getAttribute("data-filter");
          container.innerHTML = "";
          iso.arrange({ filter: currentFilter });
          setTimeout(() => renderPage(1), 50);
        });
      });

      // Initial render
      renderPage(1);
    })
    .catch((error) => console.error("Error loading JSON:", error));
});
