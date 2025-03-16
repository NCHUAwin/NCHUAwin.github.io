document.addEventListener("DOMContentLoaded", function () {
  fetch("publications.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("journal-container");

      // Access publications data directly
      const publications = data.publications;  // Data is inside 'publications' array

      // Create a new row for the entries to be inserted in two columns
      let rowDiv = document.createElement("div");
      rowDiv.classList.add("row");

      // Iterate over the publications and create HTML elements
      publications.forEach((entry, index) => {
        const journalDiv = document.createElement("div");
        journalDiv.classList.add("resume-item", "pb-0", "col-12", "col-md-6");  // Keep resume-item and pb-0, plus col for grid

        // Ensure 'authors' and 'indexers' are arrays before calling .join()
        const authors = Array.isArray(entry.authors) ? entry.authors.join(", ") : "No authors listed";
        
        // Check if 'indexers' is an array and has values, otherwise skip this <li>
        let indexersHtml = '';
        if (Array.isArray(entry.indexers) && entry.indexers.length > 0) {
          const indexers = entry.indexers.join(", ");
          indexersHtml = `<li><strong>Indexers:</strong> ${indexers}</li>`;
        }

        journalDiv.innerHTML = `
          <h4>${entry.title}</h4>
          <p><em>${entry.month} ${entry.year}</em></p>
          <ul>
            <li><strong>Authors:</strong> ${authors}</li>
            <li><strong>Journal:</strong> ${entry.journal}</li>
            <li><strong>Volume:</strong> ${entry.volume}</li>
            <li><strong>Pages:</strong> ${entry.pages}</li>
            ${indexersHtml}  <!-- Only append the Indexers <li> if it's not empty -->
          </ul>
        `;

        // Add the journal entry to the row
        rowDiv.appendChild(journalDiv);

        // After every 2nd entry (or every two publications), insert a new row
        if ((index + 1) % 2 === 0) {
          container.appendChild(rowDiv);
          rowDiv = document.createElement("div");  // Create a new row for the next set of entries
          rowDiv.classList.add("row");
        }
      });

      // If the number of publications is odd, append the last row
      if (publications.length % 2 !== 0) {
        container.appendChild(rowDiv);
      }
    })
    .catch(error => console.error("Error loading JSON:", error));
});
