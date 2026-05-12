// Slides carousel code removed (elements not in HTML)


  // my work
// Allow tap-to-toggle overlay on mobile
document.querySelectorAll('.image-container').forEach(container => {
  container.addEventListener('click', () => {
    container.classList.toggle('active');
  });
});

// Gallery items animation for "Our Work" section
const items = document.querySelectorAll('.gallery-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.3
});

items.forEach(item => observer.observe(item));

// Gallery show/hide toggle functionality
const gallery = document.querySelector('.ba-gallery');
const toggleBtn = document.getElementById('toggleGalleryBtn');
const hiddenItems = document.querySelectorAll('.gallery-hidden-mobile, .gallery-hidden-tablet, .gallery-hidden-desktop');
let isExpanded = false;

toggleBtn.addEventListener('click', () => {
  isExpanded = !isExpanded;
  gallery.classList.toggle('expanded', isExpanded);
  toggleBtn.textContent = isExpanded ? 'Show Less' : 'Show More';

  if (isExpanded) {
    hiddenItems.forEach(item => {
      setTimeout(() => item.classList.add('show'), 20);
    });
  } else {
    hiddenItems.forEach(item => item.classList.remove('show'));
  }
});


// site scroll navigation
// Select all nav links
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// You can set a custom offset (in pixels) for when the active link should change
// Positive number = triggers earlier, Negative number = triggers later
const scrollOffset = 100; // adjust this number

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight; // supports different heights
    const scrollPosition = window.scrollY;

    // Trigger active link when scroll passes the section top minus the offset
    if (scrollPosition >= sectionTop - scrollOffset && scrollPosition < sectionTop + sectionHeight - scrollOffset) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Navbar mobile dropdown toggle
  const hamburgerImg = document.querySelector('.hamburger-img');
  const navLinksImg = document.querySelector('.nav-links-img');
  const navAnchors = document.querySelectorAll('.nav-links-img a');

  hamburgerImg.addEventListener('click', () => {
    navLinksImg.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      navLinksImg.classList.remove('active');
    });
  });




const observer2 = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer2.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

setTimeout(() => {
  document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up, .service-card, .image-container, .ba-image-item, .process-text, .process-image, .services, .work, #process, .before-and-after, .gallery-section, #contact, .ba-gallery-item').forEach(el => {
    observer2.observe(el);
  });
}, 100);

// water testing image changer
const images = [
    "test-1.png", "test-2.png", "test-3.png", "test-4.png", "test-5.png",
    "test-6.jpg", "test-7.jpg", "test-8.jpg", "test-9.jpg", "test-10.jpeg",
];

const display = document.getElementById("carouselDisplay");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselContainer = document.querySelector(".carousel-container");

let page = 0;
let autoSwitchTimer = null;
let autoPauseTimeout = null;
const AUTO_SWITCH_INTERVAL = 5000;
const AUTO_REENABLE_DELAY = 15000;

function getImagesPerPage() {
    if (window.innerWidth < 400) return 1;
    if (window.innerWidth < 600) return 2;
    if (window.innerWidth < 900) return 3;
    return 5;
}

function getTotalPages() {
    const perPage = getImagesPerPage();
    return Math.max(1, Math.ceil(images.length / perPage));
}

function normalizePage() {
    const totalPages = getTotalPages();
    if (page >= totalPages) page = totalPages - 1;
    if (page < 0) page = 0;
}

function renderImages() {
    const perPage = getImagesPerPage();
    normalizePage();
    const start = page * perPage;
    const end = start + perPage;

    display.style.opacity = 0;

    setTimeout(() => {
        display.innerHTML = "";
        images.slice(start, end).forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            display.appendChild(img);
        });
        display.style.opacity = 1;
    }, 200);
}

function advancePage() {
    const totalPages = getTotalPages();
    page = (page + 1) % totalPages;
    renderImages();
}

function previousPage() {
    const totalPages = getTotalPages();
    page = page === 0 ? totalPages - 1 : page - 1;
    renderImages();
}

function stopAutoSwitch() {
    if (autoSwitchTimer) {
        clearInterval(autoSwitchTimer);
        autoSwitchTimer = null;
    }
}

function startAutoSwitch() {
    if (autoSwitchTimer) return;
    autoSwitchTimer = setInterval(advancePage, AUTO_SWITCH_INTERVAL);
}

function disableAutoSwitchTemporarily() {
    stopAutoSwitch();
    clearTimeout(autoPauseTimeout);
    autoPauseTimeout = setTimeout(() => {
        autoPauseTimeout = null;
        startAutoSwitch();
    }, AUTO_REENABLE_DELAY);
}

nextBtn.addEventListener("click", () => {
    disableAutoSwitchTemporarily();
    advancePage();
});

prevBtn.addEventListener("click", () => {
    disableAutoSwitchTemporarily();
    previousPage();
});

if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
        stopAutoSwitch();
    });

    carouselContainer.addEventListener("mouseleave", () => {
        if (!autoPauseTimeout) {
            startAutoSwitch();
        }
    });
}

window.addEventListener("resize", () => {
    page = 0; // reset to first page on resize
    renderImages();
});

renderImages();
startAutoSwitch();

// Contact form
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const status = document.getElementById("status");

  const response = await fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  });

  if (response.ok) {
    status.style.color = "green"
    status.textContent = "Message sent successfully!";
    form.reset();
  } else {
    status.style.color = "red"
    status.textContent = "Something went wrong. Please try again.";
  }
});

// Textarea capital letter
const textarea = document.getElementById("message");

textarea.addEventListener("input", () => {
  const value = textarea.value;
  if (value.length > 0) {
    textarea.value = value.charAt(0).toUpperCase() + value.slice(1);
  }
});

// Instant navigation to contact section on page load without animation
if (window.location.hash === '#contact') {
  document.documentElement.classList.add('no-scroll-animation');
  
  window.addEventListener('load', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const navHeight = 105;
      const scrollPosition = contactSection.offsetTop - navHeight;
      window.scrollTo(0, scrollPosition);
    }
  });
  
  // Re-enable smooth scrolling after initial navigation
  setTimeout(() => {
    document.documentElement.classList.remove('no-scroll-animation');
  }, 100);
}