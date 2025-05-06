// Header functionality
export function initHeader() {
  const selectHeader = document.querySelector("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    document.addEventListener("scroll", headerScrolled);
  }
}

export function initHeaderToggle() {
  console.log("Initializing header toggle");
  const toggleButton = document.getElementById("header-toggle-btn");

  if (toggleButton) {
    console.log("Toggle button found with ID");

    // Remove existing event listeners if any
    const newButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newButton, toggleButton);

    // Add new click event listener
    newButton.addEventListener("click", function (e) {
      console.log("Toggle button clicked (from ID handler)");
      e.preventDefault();
      e.stopPropagation();
      headerToggle();
    });
  } else {
    // Fallback to class selector
    const toggleButtonByClass = document.querySelector(".header-toggle");
    if (toggleButtonByClass) {
      console.log("Toggle button found by class");

      // Remove existing event listeners if any
      const newButton = toggleButtonByClass.cloneNode(true);
      toggleButtonByClass.parentNode.replaceChild(
        newButton,
        toggleButtonByClass
      );

      // Add new click event listener
      newButton.addEventListener("click", function (e) {
        console.log("Toggle button clicked (from class handler)");
        e.preventDefault();
        e.stopPropagation();
        headerToggle();
      });
    } else {
      console.warn("Header toggle button not found in DOM");
    }
  }
}

export function initHeaderScroll() {
  const selectHeader = document.querySelector("#header");
  const selectBody = document.querySelector("body");
  const selectNavMenu = document.querySelector("#navmenu");

  function headerScroll() {
    if (window.scrollY > 100) {
      selectHeader.classList.add("header-scrolled");
    } else {
      selectHeader.classList.remove("header-scrolled");
    }
  }

  window.addEventListener("load", headerScroll);
  document.addEventListener("scroll", headerScroll);
}

// Export the headerToggle function for use in other modules
export function headerToggle() {
  console.log("Header toggle function called");
  const selectHeader = document.querySelector("#header");
  const selectBody = document.querySelector("body");
  const selectHeaderToggle = document.querySelector(".header-toggle");
  const selectNavMenu = document.querySelector("#navmenu");

  if (!selectHeader || !selectBody || !selectHeaderToggle || !selectNavMenu) {
    console.warn("Some elements not found:", {
      headerMissing: !selectHeader,
      bodyMissing: !selectBody,
      toggleMissing: !selectHeaderToggle,
      navMenuMissing: !selectNavMenu,
    });
    return; // Stop execution if any element is missing
  }

  // Get current state
  const isMenuOpen = selectHeader.classList.contains("header-show");
  console.log("Current menu state - open:", isMenuOpen);

  if (isMenuOpen) {
    // Close menu
    console.log("Closing menu");
    selectHeader.classList.remove("header-show");
    selectBody.classList.remove("header-show");
    selectNavMenu.classList.remove("header-show");

    // Clear and set hamburger icon
    console.log("Setting hamburger icon");
    selectHeaderToggle.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "bi bi-list";
    selectHeaderToggle.appendChild(icon);
  } else {
    // Open menu
    console.log("Opening menu");
    selectHeader.classList.add("header-show");
    selectBody.classList.add("header-show");
    selectNavMenu.classList.add("header-show");

    // Clear and set X icon
    console.log("Setting X icon");
    selectHeaderToggle.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "bi bi-x";
    selectHeaderToggle.appendChild(icon);
  }
}
