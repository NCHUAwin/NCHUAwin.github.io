document.addEventListener("DOMContentLoaded", function () {
  // Ensure the select elements exist
  const filterSelect = document.getElementById("filter-select");
  const sortSelect = document.getElementById("sort-select");

  if (!filterSelect || !sortSelect) {
    console.error("Filter or Sort elements not found in the DOM!");
    return;
  }

  fetch("publications.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("journal-container");
      const publications = data.publications;

      // Function to display publications
      function displayPublications(filteredPublications) {
        container.innerHTML = ""; // Clear the container before rendering

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        filteredPublications.forEach((entry, index) => {
          const journalDiv = document.createElement("div");
          journalDiv.classList.add("resume-item", "pb-0", "col-12", "col-md-6", "p-3");

          const authors = Array.isArray(entry.authors) ? entry.authors.join(", ") : "No authors listed";
          let indexersHtml = '';
          if (Array.isArray(entry.indexers) && entry.indexers.length > 0) {
            const indexers = entry.indexers.join(", ");
            indexersHtml = `<li><strong>Indexers:</strong> ${indexers}</li>`;
          }

          // Add a special class or text for representative publications
          let tagHtml = '';
          if (entry.tag === "represent") {
            tagHtml = '<p><strong>Represented Publication</strong></p>';
            journalDiv.classList.add("representative-publication"); // Optional: add a special class for styling
          }

          journalDiv.innerHTML = `
            <h4>${entry.title}</h4>
            <p><em>${entry.month} ${entry.year}</em></p>
            <ul>
              <li><strong>Authors:</strong> ${authors}</li>
              <li><strong>Journal:</strong> ${entry.journal}</li>
              <li><strong>Volume:</strong> ${entry.volume}</li>
              <li><strong>Pages:</strong> ${entry.pages}</li>
              ${indexersHtml}
            </ul>
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

      // Function to filter publications based on the selected filter
      function filterPublications() {
        const selectedFilter = filterSelect.value;
        let filteredPublications = publications;

        if (selectedFilter === "represent") {
          filteredPublications = publications.filter(entry => entry.tag === "represent");
        } else if (selectedFilter === "recent") {
          const currentYear = new Date().getFullYear();
          filteredPublications = publications.filter(entry => entry.year >= (currentYear - 5));
        }

        displayPublications(filteredPublications);
      }

      // Function to sort publications
      function sortPublications() {
        const selectedSort = sortSelect.value;
        let sortedPublications = [...publications];

        if (selectedSort === "title") {
          sortedPublications.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === "year") {
          sortedPublications.sort((a, b) => b.year - a.year);
        }

        displayPublications(sortedPublications);
      }

      // Event listeners for the filter and sort selectors
      filterSelect.addEventListener("change", function() {
        filterPublications();
        sortPublications();
      });

      sortSelect.addEventListener("change", function() {
        sortPublications();
        filterPublications();
      });

      // Initialize with all publications
      filterPublications();
    })
    .catch(error => console.error("Error loading JSON:", error));
});
