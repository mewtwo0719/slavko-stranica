// JavaScript Document

/*

TemplateMo 609 Crypto Vault

https://templatemo.com/tm-609-crypto-vault

*/

// Navigation scroll effect
const navbar = document.getElementById("navbar");
const movableAction = document.getElementById("movable-action");
const movableLogo = document.getElementById("movable-logo");

function toggleScrollState() {
  const shouldShrink = window.scrollY > window.innerHeight / 3;
  if (navbar) navbar.classList.toggle("scrolled", shouldShrink);
  if (movableAction) movableAction.classList.toggle("scrolled", shouldShrink);
  if (movableLogo) movableLogo.classList.toggle("scrolled", shouldShrink);
}

window.addEventListener("scroll", toggleScrollState);
window.addEventListener("load", toggleScrollState);

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");
let lastFocusedElement = null;

function getFocusableElements() {
  if (!mobileMenu) return [];
  return Array.from(
    mobileMenu.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function openMobileMenu() {
  if (!mobileMenu || !mobileMenuOverlay || !mobileMenuBtn) return;
  lastFocusedElement = document.activeElement;
  mobileMenu.classList.add("open");
  mobileMenuOverlay.classList.add("open");
  mobileMenuBtn.classList.add("active");
  document.body.classList.add("menu-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenuBtn.setAttribute("aria-expanded", "true");

  const focusable = getFocusableElements();
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

function closeMobileMenu() {
  if (!mobileMenu || !mobileMenuOverlay || !mobileMenuBtn) return;
  mobileMenu.classList.remove("open");
  mobileMenuOverlay.classList.remove("open");
  mobileMenuBtn.classList.remove("active");
  document.body.classList.remove("menu-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
if (mobileMenuOverlay)
  mobileMenuOverlay.addEventListener("click", closeMobileMenu);

// Close mobile menu when clicking a link
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// Close mobile menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

// Focus trap when mobile menu is open
document.addEventListener("keydown", (e) => {
  if (!mobileMenu || !mobileMenu.classList.contains("open")) return;
  if (e.key !== "Tab") return;
  const focusable = getFocusableElements();
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Active menu highlighting on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav .nav-links a");

function highlightNavOnScroll() {
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      // Desktop nav
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + sectionId) {
          link.classList.add("active");
        }
      });
      // Mobile nav
      mobileNavLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + sectionId) {
          link.classList.add("active");
        }
      });
    }
  });

  // Remove active if at top of page
  if (window.scrollY < 100) {
    navLinks.forEach((link) => link.classList.remove("active"));
    mobileNavLinks.forEach((link) => link.classList.remove("active"));
  }
}

window.addEventListener("scroll", highlightNavOnScroll);

// Product tabs
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".products-tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");

    // Remove active from all buttons
    tabBtns.forEach((b) => b.classList.remove("active"));
    // Add active to clicked button
    btn.classList.add("active");

    // Hide all tab contents
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    // Show selected tab content
    const activeContent = document.getElementById("tab-" + tabId);
    if (activeContent) {
      activeContent.classList.add("active");
    }
  });
});

// Testimonial Slider
const testimonialsTrack = document.getElementById("testimonialsTrack");
const testimonialDots = document.querySelectorAll("#testimonialDots .dot");
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
const totalTestimonials = testimonialDots.length;
let currentTestimonial = 0;

function goToTestimonial(index) {
  if (index < 0) index = totalTestimonials - 1;
  if (index >= totalTestimonials) index = 0;

  currentTestimonial = index;
  testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentTestimonial);
  });
}

testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goToTestimonial(index);
  });
});

testimonialPrev.addEventListener("click", () => {
  goToTestimonial(currentTestimonial - 1);
});

testimonialNext.addEventListener("click", () => {
  goToTestimonial(currentTestimonial + 1);
});

// Auto-advance testimonials every 6 seconds
let testimonialAutoPlay = setInterval(() => {
  goToTestimonial(currentTestimonial + 1);
}, 6000);

// Pause auto-play on hover
document
  .querySelector(".testimonials-wrapper")
  .addEventListener("mouseenter", () => {
    clearInterval(testimonialAutoPlay);
  });

document
  .querySelector(".testimonials-wrapper")
  .addEventListener("mouseleave", () => {
    testimonialAutoPlay = setInterval(() => {
      goToTestimonial(currentTestimonial + 1);
    }, 6000);
  });

// Form submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Thank you for your inquiry! Our team will contact you within 24 hours.",
  );
  contactForm.reset();
});

// Simulate live price updates (for demo purposes)
function updatePrices() {
  const priceElement = document.querySelector(".price-value");
  const changeElement = document.querySelector(".price-change");

  // Random price fluctuation for demo
  const basePrice = 4285.5;
  const fluctuation = (Math.random() - 0.5) * 10;
  const newPrice = (basePrice + fluctuation).toFixed(2);

  // This is just for visual effect - in production, connect to real API
}

// Update prices every 30 seconds (demo)
setInterval(updatePrices, 30000);
