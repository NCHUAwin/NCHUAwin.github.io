// Publication display functionality
export function createDisplayManager(container, itemsPerPage) {
  function displayPublications(filteredPublications, page = 1) {
    container.innerHTML = "";

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredPublications.slice(startIndex, endIndex);

    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    pageItems.forEach((entry, index) => {
      const journalDiv = document.createElement("div");
      journalDiv.classList.add(
        "resume-item",
        "col-12",
        "col-md-6",
        "px-3",
        "pb-5"
      );

      const authors = entry.authors || "No authors listed";
      let tagHtml = "";
      if (Array.isArray(entry.tag) && entry.tag.includes("represent")) {
        tagHtml = "<p><strong>Representative Publication</strong></p>";
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

    return {
      totalItems: filteredPublications.length,
      currentPage: page,
    };
  }

  function filterAndSortPublications(publications, filter, sort) {
    let filteredPublications = [...publications];

    // Filter logic
    if (filter === "Represent") {
      filteredPublications = filteredPublications.filter(
        (entry) => Array.isArray(entry.tag) && entry.tag.includes("represent")
      );
    } else if (filter === "Recent") {
      const currentYear = new Date().getFullYear();
      filteredPublications = filteredPublications.filter(
        (entry) => entry.year >= currentYear - 5
      );
    } else if (filter === "Conference") {
      filteredPublications = filteredPublications.filter(
        (entry) => Array.isArray(entry.tag) && entry.tag.includes("conference")
      );
    }

    // Sort logic
    if (sort === "title") {
      filteredPublications.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "year") {
      filteredPublications.sort((a, b) => b.year - a.year);
    }

    return filteredPublications;
  }

  return {
    displayPublications,
    filterAndSortPublications,
  };
}
