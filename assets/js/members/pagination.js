// Pagination functionality
export function renderPaginationButtons(totalPages, currentPage, onPageChange) {
  const pagination = document.getElementById("pagination");
  if (!pagination) {
    console.warn("Pagination element not found");
    return;
  }

  pagination.innerHTML = "";

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return;

  // Create pagination container
  const paginationNav = document.createElement("nav");
  paginationNav.setAttribute("aria-label", "Member pagination");
  const paginationUl = document.createElement("ul");
  paginationUl.className = "pagination justify-content-center";
  paginationNav.appendChild(paginationUl);

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  const prevBtn = document.createElement("button");
  prevBtn.className = "page-link";
  prevBtn.innerHTML = "&laquo; Previous";
  prevBtn.addEventListener("click", () => onPageChange(currentPage - 1));
  prevLi.appendChild(prevBtn);
  paginationUl.appendChild(prevLi);

  // Number buttons - only show 5 pages with ellipsis for large sets
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust if we're at the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  // First page button if not starting from page 1
  if (startPage > 1) {
    const firstLi = document.createElement("li");
    firstLi.className = "page-item";
    const firstBtn = document.createElement("button");
    firstBtn.className = "page-link";
    firstBtn.textContent = "1";
    firstBtn.addEventListener("click", () => onPageChange(1));
    firstLi.appendChild(firstBtn);
    paginationUl.appendChild(firstLi);

    // Add ellipsis if there's a gap
    if (startPage > 2) {
      const ellipsisLi = document.createElement("li");
      ellipsisLi.className = "page-item disabled";
      const ellipsisSpan = document.createElement("span");
      ellipsisSpan.className = "page-link";
      ellipsisSpan.innerHTML = "&hellip;";
      ellipsisLi.appendChild(ellipsisSpan);
      paginationUl.appendChild(ellipsisLi);
    }
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    const btn = document.createElement("button");
    btn.className = "page-link";
    btn.textContent = i;
    btn.addEventListener("click", () => onPageChange(i));
    if (i === currentPage) {
      btn.setAttribute("aria-current", "page");
    }
    li.appendChild(btn);
    paginationUl.appendChild(li);
  }

  // Add ellipsis and last page if not ending at last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsisLi = document.createElement("li");
      ellipsisLi.className = "page-item disabled";
      const ellipsisSpan = document.createElement("span");
      ellipsisSpan.className = "page-link";
      ellipsisSpan.innerHTML = "&hellip;";
      ellipsisLi.appendChild(ellipsisSpan);
      paginationUl.appendChild(ellipsisLi);
    }

    const lastLi = document.createElement("li");
    lastLi.className = "page-item";
    const lastBtn = document.createElement("button");
    lastBtn.className = "page-link";
    lastBtn.textContent = totalPages;
    lastBtn.addEventListener("click", () => onPageChange(totalPages));
    lastLi.appendChild(lastBtn);
    paginationUl.appendChild(lastLi);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  const nextBtn = document.createElement("button");
  nextBtn.className = "page-link";
  nextBtn.innerHTML = "Next &raquo;";
  nextBtn.addEventListener("click", () => onPageChange(currentPage + 1));
  nextLi.appendChild(nextBtn);
  paginationUl.appendChild(nextLi);

  pagination.appendChild(paginationNav);
}
