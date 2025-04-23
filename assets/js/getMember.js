document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/data/members.json") // Load the JSON file
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("members-container");

      // Clear container before adding new members
      container.innerHTML = '';

      // Iterate over both studying and graduated members
      Object.keys(data).forEach(category => {
        // Sort members by `grade` in descending order (highest grade first)
        data[category].sort((a, b) => (b.grade || 0) - (a.grade || 0));

        data[category].forEach((member) => {
          // Ensure required data exists
          if (!member) {
            return;
          }

          const memberDiv = document.createElement("div");
          memberDiv.classList.add("col-12" ,"col-md-6","p-2", "mb-3", "isotope-item", `filter-${category}`, `filter-${member.degree}`);

          // Convert keyword array to a string if it exists
          const keywords = member.keyword ? member.keyword.map(k => `<span class="badge bg-secondary me-1">${k}</span>`).join(' ') : '';

          memberDiv.innerHTML = `
              <div class="card shadow-sm h-auto d-flex flex-row align-items-center">
                <div class="col-4 d-flex justify-content-center">
                ${member.img 
                  ? `<img src="${member.img}" class="card-img img-fluid p-3" alt="${member.name}" loading="lazy"/>`
                  : `<div class="card-img bg-light d-flex justify-content-center align-items-center">
                      <i class="bi bi-person-exclamation text-secondary person-icon"></i>
                    </div>`
                }
              </div>

                <div class="col-8 card-body">
                  <h5 class="card-title">${member.grade ? member.grade + '級 ' : ''}${member.name}</h5>
                  
                  ${member.title ? `<p class="card-text">${category !== "studying" ? '現職：' + member.title : member.title}</p>` : ''}

                  <p class="card-text card-description">${member.description ? member.description : ''}</p>

                  ${keywords ? `<p class="mt-2">${keywords.split(' ').map(keyword => `#${keyword}`).join(' ')}</p>` : ''}
                  
                  <div class="align-content-start pt-2">
                    ${member.fblinks ? `<a href="${member.fblinks}" class="btn btn-light btn-sm" title="Contact">
                      <i class="bi bi-person-lines-fill"></i>
                    </a>` : ''}
                    
                    ${member.email ? `<a href="mailto:${member.email}" class="btn btn-light btn-sm" title="Email">
                      <i class="bi bi-envelope"></i>
                    </a>` : ''}

                    ${member.ghlinks ? `<a href="${member.ghlinks}" class="btn btn-light btn-sm" title="GitHub">
                      <i class="bi bi-github"></i>
                    </a>` : ''}

                    ${member.ytlinks ? `<a href="${member.ytlinks}" class="btn btn-light btn-sm" title="YouTube"> 
                      <i class="bi bi-youtube"></i>
                    </a>` : ''}

                    ${member.blinks ? `<a href="${member.blinks}" class="btn btn-light btn-sm" title="Book"> 
                      <i class="bi bi-link"></i>
                    </a>` : ''}
                  </div>
                </div>
              </div>
            `;

          container.appendChild(memberDiv);
        });
      });

      // Initialize Isotope AFTER members are loaded
      let iso = new Isotope('.isotope-container', {
        itemSelector: '.isotope-item',
        layoutMode: 'fitRows',
        filter: '.filter-studying' // Default filter to show only "studying" members
      });

      // Force Isotope to relayout after content is loaded
      iso.layout();

      // Filtering Logic
      document.querySelectorAll('.member-filters li').forEach(filterBtn => {
        filterBtn.addEventListener("click", function () {
          document.querySelector('.filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          let filterValue = this.getAttribute('data-filter');
          iso.arrange({ filter: filterValue }); // Ensure the 'iso' instance is accessible here
        });
      });

    })
    .catch(error => console.error("Error loading JSON:", error));
});
