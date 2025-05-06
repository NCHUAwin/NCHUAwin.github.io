// Member card creation functionality
export function createMemberCard(member, category) {
  const memberDiv = document.createElement("div");
  memberDiv.classList.add(
    "col-12",
    "col-md-6",
    "p-2",
    "isotope-item",
    `filter-${category}`,
    `filter-${member.degree || ""}`
  );
  memberDiv.style.width = "50%";

  // Convert keyword array to a string if it exists
  const keywords = member.keyword
    ? member.keyword
        .map((k) => `<span class="badge bg-secondary me-1">${k}</span>`)
        .join(" ")
    : "";

  memberDiv.innerHTML = `
    <div class="card shadow-sm">
      <div class="row no-gutters w-100 d-flex justify-content-center align-items-center">
        <div class="col-12 col-sm-4">
          <img
            src="${
              member.img
                ? member.img
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&background=ffff&rounded=true&size=200`
            }"
            class="card-img p-2"
            alt="${member.name}"
            loading="lazy"
            data-original-src="${
              member.img
                ? member.img
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&background=ffff&rounded=true&size=200`
            }"
          >
        </div>

        <div class="col-12 col-sm-8">
          <div class="card-body">
            <h5 class="card-title">
              ${member.grade ? member.grade + "級 " : ""}
              ${
                member.thesis
                  ? `<a href="${member.thesis}">${member.name}</a>`
                  : member.name
              }
            </h5>

            ${
              member.title
                ? `<p class="card-text">${
                    category !== "studying"
                      ? "現職：" + member.title
                      : member.title
                  }</p>`
                : ""
            }

            <p class="card-text card-description d-none d-xl-block">
              ${member.description || ""}
            </p>

            ${
              keywords
                ? `<p class="mt-2 keyword d-none d-xl-block">${keywords
                    .split(" ")
                    .map((k) => `#${k}`)
                    .join(" ")}</p>`
                : ""
            }

            <div class="pt-2">
              ${
                member.SocialLink
                  ? `<a href="${member.SocialLink}" class="btn btn-light btn-sm mr-1" title="Contact">
                    <i class="bi bi-person-lines-fill"></i>
                  </a>`
                  : ""
              }
              ${
                member.email
                  ? `<a href="mailto:${member.email}" class="btn btn-light btn-sm mr-1" title="Email">
                    <i class="bi bi-envelope"></i>
                  </a>`
                  : ""
              }
              ${
                member.GithubLink
                  ? `<a href="${member.GithubLink}" class="btn btn-light btn-sm mr-1" title="GitHub">
                    <i class="bi bi-github"></i>
                  </a>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return memberDiv;
}
