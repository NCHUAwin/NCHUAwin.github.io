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
      const publications = data;
      const journalCounts = {};
      const conferenceCounts = {};

      data.forEach(entry => {
        const year = Number(entry.year);
        if (!year) return;

        const isConference = Array.isArray(entry.tag) && entry.tag.includes("conference");

        if (isConference) {
          conferenceCounts[year] = (conferenceCounts[year] || 0) + 1;
        } else {
          journalCounts[year] = (journalCounts[year] || 0) + 1;
        }
      });

      let chartInstance = null;

      function drawChart(years, journalData, conferenceData) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        const ctx = document.getElementById("publication-trend-chart").getContext("2d");

        const data = {
          labels: years,
          datasets: []
        };
        
        data.datasets.push(
          {
            label: "Conference",
            data: conferenceData,
            backgroundColor: "#cddc39",
            // barPercentage: 0.4,
            // categoryPercentage: 0.6
          },
          {
            label: "Journal",
            data: journalData,
            backgroundColor: "#80cbc4",
            // barPercentage: 0.4,
            // categoryPercentage: 0.6
          }
        );
        
        chartInstance = new Chart(ctx, {
          type: "bar",
          data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                display: true,
                text:"Annual Publication Trend (Journal vs. Conference)"
              },
              legend: {
                display: true,
                position: "bottom"
              }
            },
            scales: {
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: "Publications"
                },
                ticks: {
                  stepSize: 1, // Ensures steps are in integers
                  callback: function(value) {
                    return Number(value).toFixed(0); 
                  }
                }
              },
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: "Year"
                }
              }
            }
          }
        });
      }

      const allYears = Array.from(new Set([
        ...Object.keys(journalCounts),
        ...Object.keys(conferenceCounts)
      ].map(Number))).sort((a, b) => a - b);

      const journalData = allYears.map(year => journalCounts[year] || 0);
      const conferenceData = allYears.map(year => conferenceCounts[year] || 0);

      // console.log("Years:", allYears);
      // console.log("Journal Data:", journalData);
      // console.log("Conference Data:", conferenceData);
      
      // Initial chart (pass full data, but limit the view)
      drawChart(allYears, journalData, conferenceData); 
      
      // const sampleYears = [2020, 2021, 2022];
      // const sampleJournalData = [5, 10, 15];
      // const sampleConferenceData = [3, 7, 12];

      // drawChart(sampleYears, sampleJournalData, sampleConferenceData);
      
      // Logic for pagination and filtering unchanged
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
