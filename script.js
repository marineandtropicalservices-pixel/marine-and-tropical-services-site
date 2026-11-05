const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
    const isShown = navLinks.classList.toggle('show');
    if (isShown) {
        navbar.style.borderRadius = '20px 20px 0 0';
    } else {
        navbar.style.borderRadius = '20px';
    }
});

const navLinkItems = navLinks.querySelectorAll('a');
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        navbar.style.borderRadius = '20px';
    });
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Results gallery expand/collapse
const resultsGallery = document.getElementById('resultsGallery');
const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');

if (resultsGallery && toggleGalleryBtn) {
    const galleryItems = Array.from(resultsGallery.querySelectorAll('.results-image-container'));
    let galleryExpanded = false;

    function getVisibleGalleryCount() {
        if (window.innerWidth <= 533) return 3;
        if (window.innerWidth <= 900) return 4;
        return 6;
    }

    function updateGallery() {
        const visibleCount = galleryExpanded ? galleryItems.length : getVisibleGalleryCount();

        galleryItems.forEach((item, index) => {
            item.hidden = index >= visibleCount;
        });

        toggleGalleryBtn.textContent = galleryExpanded ? 'Show Less' : 'Show More';
        toggleGalleryBtn.setAttribute('aria-expanded', String(galleryExpanded));
        toggleGalleryBtn.hidden = galleryItems.length <= getVisibleGalleryCount();
    }

    toggleGalleryBtn.addEventListener('click', () => {
        galleryExpanded = !galleryExpanded;
        updateGallery();
    });

    window.addEventListener('resize', updateGallery);
    updateGallery();
}

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -5% 0px'
});

revealElements.forEach((element) => {
    const delay = Number(element.dataset.delay || 0);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    revealObserver.observe(element);
});

// work slider track
const track = document.querySelector('.slider-track');
if (track) {
    const slots = Array.from(track.querySelectorAll('.slider-slot'));
    const slider = track.closest('.work-slider') || track.parentElement;
    const leftBtn = slider.querySelector('.arrow.left');
    const rightBtn = slider.querySelector('.arrow.right');

    const imageSources = [
        'antranias-landscaper-401880_1920.jpg',
        'antranias-landscaper-409147_1920.jpg',
        'javallma-garden-2218786_1920.jpg',
        'antranias-landscaper-409147_1920.jpg',
        'javallma-garden-2218786_1920.jpg',
        'antranias-landscaper-401880_1920.jpg'
    ];

    let index = 0;
    const total = imageSources.length;

    slots.forEach(slot => {
        const img = slot.querySelector('img');
        img.classList.add('slider-image');
    });

    function applyImages() {
        slots.forEach((slot, slotIndex) => {
            const img = slot.querySelector('img');
            const nextSrc = imageSources[(index + slotIndex) % total];
            const currentSrc = img.getAttribute('data-current');

            if (currentSrc === nextSrc) {
                return;
            }

            img.style.opacity = '0';
            img.setAttribute('data-current', nextSrc);

            requestAnimationFrame(() => {
                img.src = nextSrc;
                img.style.opacity = '1';
            });
        });
    }

    function goNext() {
        index = (index + 1) % total;
        applyImages();
    }

    function goPrev() {
        index = (index - 1 + total) % total;
        applyImages();
    }

    if (leftBtn && rightBtn) {
        rightBtn.addEventListener('click', goNext);
        leftBtn.addEventListener('click', goPrev);
    }

    setInterval(goNext, 4000);
    applyImages();
}

// Phone Number Input
const input = document.getElementById('phone')
const PREFIX = '+44 '

input.addEventListener('focus', () => {
    if (!input.value.startsWith(PREFIX)) {
        input.value = PREFIX;
    }

    setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
});

input.addEventListener('keydown', (e) => {
    const start = input.selectionStart;
    const end = input.selectionEnd;

    if ((e.key === 'Backspace' && start <= PREFIX.length) ||
    (e.key === 'Delete' && start < PREFIX.length)) {
        e.preventDefault();
    }
});

input.addEventListener('input', () => {
    if (!input.value.startsWith(PREFIX)) {
        input.value = PREFIX;
    }

    let digits = input.value.slice(PREFIX.length).replace(/\D/g, '');

    digits = digits.slice(0, 10);

    let formatted = '';
    const first = digits.slice(0, 4);
    const rest = digits.slice(4);

    if (first) {
        formatted = first;
    }
    if (rest) {
        formatted += ' ' + rest;
    }

    input.value = PREFIX + formatted;

    input.setSelectionRange(input.value.length, input.value.length);
});

// Capital letter inputs
document.querySelectorAll('input#capInput, textarea#capInput').forEach((inputField) => {
    inputField.addEventListener('input', function(e) {
        const value = e.target.value;
        if (value.length > 0) {
            e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
        }
    });
});

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
let renderTimeout = null;
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

    display.style.setProperty("--carousel-columns", perPage);
    display.style.opacity = 0;

    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        display.innerHTML = "";
        images.slice(start, end).forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Water testing equipment";
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

// ============ Popup window ============
document.addEventListener("DOMContentLoaded", () => {
    const popupOverlay = document.getElementById("popupOverlay");
    const closeBtn = document.getElementById("closeBtn");
    const actionBtn = document.getElementById("actionBtn");

    if (!popupOverlay || !closeBtn || !actionBtn) return;
    const popupShownKey = "referralPopupShown";

    if (localStorage.getItem(popupShownKey) === "true") return;

    localStorage.setItem(popupShownKey, "true");
    popupOverlay.classList.add("show");
    popupOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();

    const closePopup = () => {
        popupOverlay.classList.remove("show");
        popupOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closePopup);
    actionBtn.addEventListener("click", closePopup);

    popupOverlay.addEventListener("click", (event) => {
        if (event.target === popupOverlay) {
            closePopup();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && popupOverlay.classList.contains("show")) {
            closePopup();
        }
    });
});

const banner = document.getElementById('banner');
const targetUrl = 'referral.html';

banner.addEventListener('click', () => {
    window.location.href = targetUrl;
});

banner.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = targetUrl
    }
});
