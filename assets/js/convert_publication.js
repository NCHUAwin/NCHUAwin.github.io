document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById("filter-select");
  const sortSelect = document.getElementById("sort-select");
  const container = document.getElementById("journal-container");

  document.getElementById("reset-zoom").addEventListener("click", () => {
    if (chartInstance) chartInstance.resetZoom();
  });

  if (!filterSelect || !sortSelect || !container) {
    console.error("Filter, Sort, or container elements not found in the DOM!");
    return;
  }

  fetch("assets/data/journal_list.json")
    .then(response => response.json())
    .then(data => {
      const publications = data; // Fix: since the root is an array
      const journalCounts = {};
      const conferenceCounts = {};
      
      data.forEach(entry => {
        const year = entry.year;
        if (!year) return;
      
        const isConference = Array.isArray(entry.tag) && entry.tag.includes("conference");
      
        if (isConference) {
          conferenceCounts[year] = (conferenceCounts[year] || 0) + 1;
        } else {
          journalCounts[year] = (journalCounts[year] || 0) + 1;
        }
      });

      let isCombinedMode = false; // Start in separate mode
      let chartInstance = null;
      
      function drawChart(years, journalData, conferenceData, mode = "separate", minX = null, maxX = null) {
        if (chartInstance) chartInstance.destroy();
      
        const ctx = document.getElementById("publication-trend-chart").getContext("2d");
      
        const data = {
          labels: years,
          datasets: []
        };
      
        if (mode === "combined") {
          const combinedData = years.map((y, i) => (journalData[i] || 0) + (conferenceData[i] || 0));
          data.datasets.push({
            label: "All Publications",
            data: combinedData,
            backgroundColor: "#59a14f",
            borderColor: "#59a14f",
            tension: 0.3,
            pointRadius: 4
          });
        } else {
          data.datasets.push(
            {
              label: "Journal",
              data: journalData,
              backgroundColor: "#4e79a7",
              borderColor: "#4e79a7",
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: "Conference",
              data: conferenceData,
              backgroundColor: "#f28e2b",
              borderColor: "#f28e2b",
              tension: 0.3,
              pointRadius: 4
            }
          );
        }
      
        chartInstance = new Chart(ctx, {
          type: "line",
          data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'x',
                  modifierKey: 'ctrl'
                },
                zoom: {
                  wheel: { enabled: true },
                  pinch: { enabled: true },
                  mode: 'x',
                }
              },
              title: {
                display: true,
                text: mode === "combined"
                  ? "Annual Combined Publications"
                  : "Annual Publication Trend (Journal vs. Conference)"
              },
              legend: {
                display: true,
                position: "bottom"
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Publications"
                }
              },
              x: {
                title: {
                  display: true,
                  text: "Year"
                },
                min: minX,
                max: maxX,
              }
            }
          }
        });
      }
      
      
      // After fetching data and preparing journalCounts / conferenceCounts:
      const allYears = Array.from(new Set([
        ...Object.keys(journalCounts),
        ...Object.keys(conferenceCounts),
      ]))
        .map(y => parseInt(y))
        .sort((a, b) => a - b);
      
      // Get the last 10 years
      const journalData = allYears.map(year => journalCounts[year] || 0);
      const conferenceData = allYears.map(year => conferenceCounts[year] || 0);
      
      // Find the last 10 years range
      const recentYears = allYears.slice(-10);
      const minYear = recentYears[0];
      const maxYear = recentYears[recentYears.length - 1];
      
      // Initial chart (pass full data, but limit the view)
      drawChart(recentYears, journalData, conferenceData, "separate", minYear, maxYear);
      
      
      // Initial chart
      drawChart(recentYears, journalData, conferenceData, "separate");
      
      // Toggle chart mode on button click
      document.getElementById("toggle-chart-mode").addEventListener("click", () => {
        isCombinedMode = !isCombinedMode;
        drawChart(recentYears, journalData, conferenceData, isCombinedMode ? "combined" : "separate", minYear, maxYear);

        const btn = document.getElementById("toggle-chart-mode");
        btn.textContent = isCombinedMode ? "Switch to Separate View" : "Switch to Combined View";
      });

      const itemsPerPage = 10;
      function createPaginationControls(totalItems, currentPage) {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = "";
      
        const totalPages = Math.ceil(totalItems / itemsPerPage);
      
        if (totalPages <= 1) return; // no need for pagination
      
        const createButton = (text, page) => {
          const btn = document.createElement("button");
          btn.textContent = text;
          btn.classList.add("btn", "btn-sm", "mx-1", "btn-outline-primary");
          if (page === currentPage) btn.classList.add("active");
          btn.addEventListener("click", () => {
            currentPage = page;
            displayPublications(lastFilteredPublications, page);
          });
          return btn;
        };
      
        if (currentPage > 1) {
          paginationContainer.appendChild(createButton("Prev", currentPage - 1));
        }
      
        for (let i = 1; i <= totalPages; i++) {
          paginationContainer.appendChild(createButton(i, i));
        }
      
        if (currentPage < totalPages) {
          paginationContainer.appendChild(createButton("Next", currentPage + 1));
        }
      }
      

      
      function displayPublications(filteredPublications, page = 1) {
        container.innerHTML = "";
      
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredPublications.slice(startIndex, endIndex);
      
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
      
        pageItems.forEach((entry, index) => {
          const journalDiv = document.createElement("div");
          journalDiv.classList.add("resume-item","col-12", "col-md-6","px-3","pb-5");
      
          const authors = entry.authors || "No authors listed";
          let tagHtml = '';
          if (Array.isArray(entry.tag) && entry.tag.includes("represent")) {
            tagHtml = '<p><strong>Representative Publication</strong></p>';
            journalDiv.classList.add("representative-publication");
          }
      
          journalDiv.innerHTML = `
            <h4><a href="${entry.doi}">${entry.title}</a></h4>
            <p>
              <em>${entry.year} ${entry.journal}</em> 
              ${entry.volume} ${entry.page}   
              ${authors}
              <a href="${entry.doi}">DOI</a>
            </p>
            ${tagHtml}
          `;
      
          rowDiv.appendChild(journalDiv);
      
          if ((index + 1) % 2 === 0) {
            container.appendChild(rowDiv);
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
          }
        });
      
        if (pageItems.length % 2 !== 0) {
          container.appendChild(rowDiv);
        }
      
        createPaginationControls(filteredPublications.length, page);
      }
      

      let lastFilteredPublications = [];

      function updatePublications() {
        const selectedFilter = filterSelect.value;
        const selectedSort = sortSelect.value;
        let filteredPublications = [...publications];

        // Filter logic...
        if (selectedFilter === "Represent") {
          filteredPublications = filteredPublications.filter(entry =>
            Array.isArray(entry.tag) && entry.tag.includes("represent")
          );
        } else if (selectedFilter === "Recent") {
          const currentYear = new Date().getFullYear();
          filteredPublications = filteredPublications.filter(entry => entry.year >= (currentYear - 5));
        } else if (selectedFilter === "Conference") {
          filteredPublications = filteredPublications.filter(entry =>
            Array.isArray(entry.tag) && entry.tag.includes("conference")
          );
        }

        // Sort logic...
        if (selectedSort === "title") {
          filteredPublications.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === "year") {
          filteredPublications.sort((a, b) => b.year - a.year);
        }

        lastFilteredPublications = filteredPublications;
        currentPage = 1;
        displayPublications(filteredPublications, currentPage);
      }

      
      // Unified event listeners
      filterSelect.addEventListener("change", updatePublications);
      sortSelect.addEventListener("change", updatePublications);
      
      // Initial load
      updatePublications();
      
    })
    .catch(error => console.error("Error loading JSON:", error));
});
