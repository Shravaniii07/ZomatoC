/**
 * Simple Filter JavaScript for Zomato Clone
 * Beginner-friendly filter and category functionality using data attributes
 */

document.addEventListener('DOMContentLoaded', function () {
    setupFilters();
    setupCategoryNavbar();
});

let currentFilter = 'all';
let currentCategory = 'all';

/**
 * Setup filter buttons (Rating, Veg, etc.)
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.restaurant-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const filterType = this.getAttribute('data-filter');

            // Toggle functionality: if already active, reset to 'all'
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                currentFilter = 'all';
                // Find and activate the 'All' button if it exists
                const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
                if (allBtn) allBtn.classList.add('active');
            } else {
                // Remove active class from others
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = filterType;
            }

            applyAllFilters();
        });
    });
}

/**
 * Setup Category Navbar (Pizza, Burger, etc.)
 */
function setupCategoryNavbar() {
    const categoryCards = document.querySelectorAll('.food-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Category toggle: if clicking active category, reset to all
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                currentCategory = 'all';
            } else {
                categoryCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                currentCategory = category;
            }

            applyAllFilters();
        });
    });
}

/**
 * Unified function to apply both filter and category
 */
function applyAllFilters() {
    const cards = document.querySelectorAll('.restaurant-card');

    cards.forEach(card => {
        let showByFilter = true;
        let showByCategory = true;

        // 1. Check Filter
        if (currentFilter !== 'all') {
            if (currentFilter === 'rating4') {
                showByFilter = parseFloat(card.getAttribute('data-rating')) >= 4.0;
            } else if (currentFilter === 'pureveg') {
                showByFilter = card.getAttribute('data-veg') === 'true';
            } else if (currentFilter === 'opennow') {
                showByFilter = card.getAttribute('data-open') === 'true';
            } else if (currentFilter === 'pricelow') {
                // For "pricelow", we just show all and then sort (sorting is optional but requested)
                showByFilter = true;
            }
        }

        // 2. Check Category
        if (currentCategory !== 'all') {
            showByCategory = card.getAttribute('data-category') === currentCategory;
        }

        // Show card only if both match
        if (showByFilter && showByCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Special case for sorting by price
    if (currentFilter === 'pricelow') {
        sortByPrice();
    }
}

/**
 * Sort restaurant cards by price (low to high)
 */
function sortByPrice() {
    const container = document.querySelector('.restaurant-list');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.restaurant-card'));

    cards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price')) || 0;
        const priceB = parseInt(b.getAttribute('data-price')) || 0;
        return priceA - priceB;
    });

    cards.forEach(card => container.appendChild(card));
}
