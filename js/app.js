// Dream Deals: small, readable interactions using arrays, functions and events.

const homes = [
  { id: 1, title: "The Willow House", location: "East Austin, TX", type: "sale", price: "$485,000", detail: "3 beds · 2 baths · 1,820 sq ft", image: "img/pexels-photo-1396122.webp", alt: "Contemporary home beneath mature trees", tag: "Just listed", keywords: "garden bright willow austin" },
  { id: 2, title: "Sunday Morning", location: "Crestview, TX", type: "rent", price: "$2,450 / mo", detail: "2 beds · 2 baths · 1,240 sq ft", image: "img/pexels-photo-259588.jpeg", alt: "Warm modern home with a leafy garden", tag: "For rent", keywords: "garden rental sunday austin" },
  { id: 3, title: "Casa Sol", location: "South Lamar, TX", type: "sale", price: "$629,000", detail: "4 beds · 3 baths · 2,105 sq ft", image: "img/pexels-photo-1396132.jpeg", alt: "Inviting home with modern architecture", tag: "Open this week", keywords: "modern family lamar bright" }
];

const propertyGrid = document.querySelector("#property-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#home-search");
const savedCount = document.querySelector("#saved-count");
let selectedFilter = "all";
let savedHomes = readSavedHomes();

function readSavedHomes() {
  try {
    return JSON.parse(localStorage.getItem("dreamDealsSavedHomes")) || [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem("dreamDealsSavedHomes", JSON.stringify(savedHomes));
  savedCount.textContent = savedHomes.length;
}

function makeHomeCard(home) {
  const isSaved = savedHomes.includes(home.id);
  return `
    <article class="property-card">
      <div class="property-image">
        <img src="${home.image}" alt="${home.alt}" loading="lazy">
        <span class="listing-tag">${home.tag}</span>
        <button class="favorite-btn ${isSaved ? "is-saved" : ""}" data-home-id="${home.id}" aria-label="${isSaved ? "Remove" : "Save"} ${home.title} ${isSaved ? "from" : "to"} favorites" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
      </div>
      <div class="property-info">
        <p class="property-location">${home.location}</p>
        <h3 class="property-title">${home.title}</h3>
        <div class="property-meta"><span>${home.detail}</span></div>
        <div class="property-price"><strong>${home.price}</strong><a href="Contact.html">Ask about it ↗</a></div>
      </div>
    </article>`;
}

function showHomes() {
  if (!propertyGrid) return;
  const searchText = searchInput.value.trim().toLowerCase();
  const visibleHomes = homes.filter(function (home) {
    const matchesType = selectedFilter === "all" || home.type === selectedFilter;
    const searchableText = `${home.title} ${home.location} ${home.keywords}`.toLowerCase();
    return matchesType && searchableText.includes(searchText);
  });
  propertyGrid.innerHTML = visibleHomes.map(makeHomeCard).join("");
  emptyState.hidden = visibleHomes.length > 0;
  savedCount.textContent = savedHomes.length;
}

if (propertyGrid) {
  showHomes();
  searchInput.addEventListener("input", showHomes);
  document.querySelectorAll(".filter-chip").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelector(".filter-chip.active").classList.remove("active");
      button.classList.add("active");
      selectedFilter = button.dataset.filter;
      showHomes();
    });
  });
  propertyGrid.addEventListener("click", function (event) {
    const favoriteButton = event.target.closest(".favorite-btn");
    if (!favoriteButton) return;
    const homeId = Number(favoriteButton.dataset.homeId);
    if (savedHomes.includes(homeId)) {
      savedHomes = savedHomes.filter(function (id) { return id !== homeId; });
    } else {
      savedHomes.push(homeId);
    }
    saveFavorites();
    showHomes();
  });
}

// A small image slider: arrow buttons and dots work alongside timed rotation.
const heroSlider = document.querySelector("#hero-slider");
if (heroSlider) {
  const slides = [
    { image: "img/pexels-photo-106399.jpeg", alt: "Sunlit modern home surrounded by greenery" },
    { image: "img/istockphoto-1026205392-1024x1024.jpg", alt: "A bright home in a leafy neighborhood" },
    { image: "img/large-home-residential-house-architecture-53610.jpeg", alt: "A welcoming house with a spacious front porch" },
    { image: "img/pexels-photo-3555615.jpeg", alt: "A calm and inviting modern home" }
  ];
  const slideImage = heroSlider.querySelector(".hero-slide-image");
  const slideCounter = heroSlider.querySelector(".hero-index");
  const dotsContainer = heroSlider.querySelector(".slider-dots");
  let currentSlide = 0;
  let sliderTimer;

  function showSlide(slideNumber) {
    currentSlide = (slideNumber + slides.length) % slides.length;
    slideImage.classList.add("is-changing");
    window.setTimeout(function () {
      slideImage.src = slides[currentSlide].image;
      slideImage.alt = slides[currentSlide].alt;
      slideImage.classList.remove("is-changing");
    }, 180);
    slideCounter.textContent = `0${currentSlide + 1} / 0${slides.length}`;
    dotsContainer.querySelectorAll("button").forEach(function (dot, index) {
      dot.classList.toggle("active", index === currentSlide);
      dot.setAttribute("aria-current", index === currentSlide ? "true" : "false");
    });
  }

  slides.forEach(function (slide, index) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Show featured home ${index + 1}`);
    dot.addEventListener("click", function () {
      showSlide(index);
      restartSlider();
    });
    dotsContainer.append(dot);
  });

  function restartSlider() {
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(function () { showSlide(currentSlide + 1); }, 5000);
  }

  heroSlider.querySelector(".slider-previous").addEventListener("click", function () {
    showSlide(currentSlide - 1);
    restartSlider();
  });
  heroSlider.querySelector(".slider-next").addEventListener("click", function () {
    showSlide(currentSlide + 1);
    restartSlider();
  });
  showSlide(0);
  restartSlider();
}

// The menu button works with a mouse, touch screen or keyboard.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

// This front-end demo validates the form and shows a confirmation; it has no server.
const contactForm = document.querySelector("#contact-form-element");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = document.querySelector("#form-message");
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      message.textContent = "Please check each field and try again.";
      return;
    }
    const visitorName = contactForm.elements.name.value.trim();
    message.textContent = `Thanks, ${visitorName}! Your note is ready. This demo does not send it to a server.`;
    contactForm.reset();
  });
}
