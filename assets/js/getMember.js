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
          memberDiv.classList.add("col-12" ,"col-md-6","p-2", "isotope-item", `filter-${category}`, `filter-${member.degree}`);

          // Convert keyword array to a string if it exists
          const keywords = member.keyword ? member.keyword.map(k => `<span class="badge bg-secondary me-1">${k}</span>`).join(' ') : '';

          memberDiv.innerHTML = `
          <div class="card shadow-sm">
            <div class="row no-gutters w-100 d-flex justify-content-center align-items-center">

                <div class="col-12 col-sm-4 ">
                <img
                  src="${member.img
                    ? member.img
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name[0])}&background=ffff&rounded=true&size=200`}"
                  class="card-img p-2"
                  alt="${member.name}"
                  loading="lazy"
                >
              </div>

              <div class="col-12 col-sm-8">
                <div class="card-body">
                  <h5 class="card-title">
                    ${member.grade ? member.grade + '級 ' : ''}
                    ${member.thesis
                      ? `<a href="${member.thesis}">${member.name}</a>`
                      : member.name}
                  </h5>

                  ${member.title
                    ? `<p class="card-text">${category !== "studying"
                        ? '現職：' + member.title
                        : member.title
                      }</p>`
                    : ''}

                  <p class="card-text card-description d-none d-sm-block">
                    ${member.description || ''}
                  </p>

                  ${keywords
                    ? `<p class="mt-2 keyword">${keywords
                        .split(' ')
                        .map(k => `#${k}`)
                        .join(' ')
                      }</p>`
                    : ''}

                  <div class="pt-2">
                    ${member.fblinks
                      ? `<a href="${member.fblinks}" class="btn btn-light btn-sm mr-1" title="Contact">
                          <i class="bi bi-person-lines-fill"></i>
                        </a>`
                      : ''}
                    ${member.email
                      ? `<a href="mailto:${member.email}" class="btn btn-light btn-sm mr-1" title="Email">
                          <i class="bi bi-envelope"></i>
                        </a>`
                      : ''}
                    ${member.ghlinks
                      ? `<a href="${member.ghlinks}" class="btn btn-light btn-sm mr-1" title="GitHub">
                          <i class="bi bi-github"></i>
                        </a>`
                      : ''}
                    ${member.ytlinks
                      ? `<a href="${member.ytlinks}" class="btn btn-light btn-sm mr-1" title="YouTube">
                          <i class="bi bi-youtube"></i>
                        </a>`
                      : ''}
                    ${member.blinks
                      ? `<a href="${member.blinks}" class="btn btn-light btn-sm" title="Book">
                          <i class="bi bi-link"></i>
                        </a>`
                      : ''}
                  </div>
                </div>
              </div>

            </div>  <!-- .row -->
          </div>    <!-- .card -->
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
