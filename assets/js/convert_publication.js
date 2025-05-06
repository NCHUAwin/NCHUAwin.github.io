import { createChartManager } from "./publications/chartManager.js";
import { createPaginationControls } from "./publications/pagination.js";
import { createDisplayManager } from "./publications/displayManager.js";

document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById("filter-select");
  const sortSelect = document.getElementById("sort-select");
  const container = document.getElementById("journal-container");
  const ITEMS_PER_PAGE = 10;

  if (!filterSelect || !sortSelect || !container) {
    console.error("Filter, Sort, or container elements not found in the DOM!");
    return;
  }

  const chartManager = createChartManager();
  const displayManager = createDisplayManager(container, ITEMS_PER_PAGE);

  fetch("assets/data/journal_list.json")
    .then((response) => response.json())
    .then((data) => {
      const publications = data;
      let currentPage = 1;
      let lastFilteredPublications = [];

      // Initialize chart
      const stats = chartManager.calculatePublicationStats(publications);
      chartManager.drawChart(
        stats.years,
        stats.journalData,
        stats.conferenceData
      );

      function updatePublications() {
        const selectedFilter = filterSelect.value;
        const selectedSort = sortSelect.value;

        lastFilteredPublications = displayManager.filterAndSortPublications(
          publications,
          selectedFilter,
          selectedSort
        );

        currentPage = 1;
        const { totalItems } = displayManager.displayPublications(
          lastFilteredPublications,
          currentPage
        );
        createPaginationControls(totalItems, currentPage, (page) => {
          currentPage = page;
          displayManager.displayPublications(lastFilteredPublications, page);
        });
      }

      // Event listeners
      filterSelect.addEventListener("change", updatePublications);
      sortSelect.addEventListener("change", updatePublications);

      // Initial load
      updatePublications();
    })
    .catch((error) => console.error("Error loading JSON:", error));
});
