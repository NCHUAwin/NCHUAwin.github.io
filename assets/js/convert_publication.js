document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById("filter-select");
  const sortSelect = document.getElementById("sort-select");
  const container = document.getElementById("journal-container");

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
      
      function drawChart(years, journalData, conferenceData, mode = "separate") {
        if (chartInstance) chartInstance.destroy(); // Destroy existing chart before redraw
      
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
            plugins: {
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
                }
              }
            }
          }
        });
      }
      
      // After fetching data and preparing journalCounts / conferenceCounts:
      const allYears = Array.from(new Set([
        ...Object.keys(journalCounts),
        ...Object.keys(conferenceCounts),
      ])).sort((a, b) => a - b);
      
      const journalData = allYears.map(year => journalCounts[year] || 0);
      const conferenceData = allYears.map(year => conferenceCounts[year] || 0);
      
      // Initial chart
      drawChart(allYears, journalData, conferenceData, "separate");
      
      // Toggle chart mode on button click
      document.getElementById("toggle-chart-mode").addEventListener("click", () => {
        // console.log("Toggle button clicked");
        isCombinedMode = !isCombinedMode;
      
        drawChart(allYears, journalData, conferenceData, isCombinedMode ? "combined" : "separate");
      
        const btn = document.getElementById("toggle-chart-mode");
        btn.textContent = isCombinedMode ? "Switch to Separate View" : "Switch to Combined View";
      });
      
      function displayPublications(filteredPublications) {
        container.innerHTML = "";

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        filteredPublications.forEach((entry, index) => {
          const journalDiv = document.createElement("div");
          journalDiv.classList.add("resume-item","col-12", "col-md-6","px-3","pb-5");

          const authors = entry.authors || "No authors listed";

          let tagHtml = '';
          if (Array.isArray(entry.tag) && entry.tag.includes("represent")) {
            tagHtml = '<p><strong>Representive Publication</strong></p>';
            journalDiv.classList.add("representative-publication");
          }

          journalDiv.innerHTML = `
            <h4><a href=${entry.doi}>${entry.title}</a></h4>
            <p>
            <em>${entry.year} ${entry.journal}</em> 
                ${entry.volume} ${entry.page}   
                ${authors}
                <a href=${entry.doi}>DOI</a>
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

        if (filteredPublications.length % 2 !== 0) {
          container.appendChild(rowDiv);
        }
      }

      function updatePublications() {
        const selectedFilter = filterSelect.value;
        const selectedSort = sortSelect.value;
        let filteredPublications = [...publications];
      
        // Apply filtering
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
      
        // Apply sorting
        if (selectedSort === "title") {
          filteredPublications.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === "year") {
          filteredPublications.sort((a, b) => b.year - a.year);
        }
      
        displayPublications(filteredPublications);
      }
      
      // Unified event listeners
      filterSelect.addEventListener("change", updatePublications);
      sortSelect.addEventListener("change", updatePublications);
      
      // Initial load
      updatePublications();
      
    })
    .catch(error => console.error("Error loading JSON:", error));
});
