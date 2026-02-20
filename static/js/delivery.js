/**
 * Zomato Clone - Delivery Page JavaScript (delivery.html)
 * Handles category filtering, restaurant display, and navigation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeDeliveryPage();
});

/**
 * Initialize all functionality for the delivery page
 */
function initializeDeliveryPage() {
    // setupCategoryFiltering(); // Handled by filters.js
    setupRestaurantCards();
    // loadAndFilterRestaurants(); // We want to use static HTML for simple toggle behavior
    setupCityFiltering();
}

/**
 * Setup food category filtering
 */
function setupCategoryFiltering() {
    const foodCards = document.querySelectorAll('.food-card');

    foodCards.forEach(card => {
        // Get category from the text content
        const categoryText = card.querySelector('p').textContent.trim();

        // Set data-category attribute if not already set
        if (!card.hasAttribute('data-category')) {
            card.setAttribute('data-category', categoryText);
        }

        // Add click handler
        card.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all cards
            foodCards.forEach(c => c.classList.remove('active'));

            // Add active class to clicked card
            card.classList.add('active');

            // Filter restaurants by category
            const category = card.getAttribute('data-category');
            filterRestaurantsByCategory(category);

            // Save selected category
            localStorage.setItem('selectedCategory', category);
        });
    });

    // Load saved category or search query
    const savedCategory = localStorage.getItem('selectedCategory');
    const searchQuery = localStorage.getItem('searchQuery');

    if (searchQuery) {
        // Find matching category from search
        const matchingCard = Array.from(foodCards).find(card => {
            const category = card.getAttribute('data-category') || card.querySelector('p').textContent.trim();
            return category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                searchQuery.toLowerCase().includes(category.toLowerCase());
        });

        if (matchingCard) {
            matchingCard.classList.add('active');
            filterRestaurantsByCategory(matchingCard.getAttribute('data-category') || matchingCard.querySelector('p').textContent.trim());
        }

        // Clear search query after use
        localStorage.removeItem('searchQuery');
    } else if (savedCategory) {
        // Activate saved category
        const matchingCard = Array.from(foodCards).find(card => {
            const category = card.getAttribute('data-category') || card.querySelector('p').textContent.trim();
            return category === savedCategory;
        });

        if (matchingCard) {
            matchingCard.classList.add('active');
            filterRestaurantsByCategory(savedCategory);
        }
    }
}

/**
 * Filter restaurants by category
 * @param {string} category - Category name
 */
function filterRestaurantsByCategory(category) {
    const restaurantList = document.querySelector('.restaurant-list');
    if (!restaurantList) return;

    // Get selected city
    const selectedCity = localStorage.getItem('selectedCity') || 'Pune';

    // Filter restaurants
    let filteredRestaurants = restaurants.filter(r => r.city === selectedCity);

    if (category && category !== 'All') {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.category === category ||
            r.cuisine.toLowerCase().includes(category.toLowerCase())
        );
    }

    // Display filtered restaurants
    displayRestaurants(filteredRestaurants, restaurantList);
}

/**
 * Setup restaurant card click handlers
 */
function setupRestaurantCards() {
    const restaurantCards = document.querySelectorAll('.restaurant-card');

    restaurantCards.forEach(card => {
        // Find restaurant data by matching name or image
        const restaurantName = card.querySelector('h3')?.textContent.trim();
        const restaurantLink = card.querySelector('a')?.getAttribute('href');

        if (restaurantName) {
            // Find matching restaurant in data
            const restaurant = restaurants.find(r =>
                r.name === restaurantName ||
                r.page === restaurantLink
            );

            if (restaurant) {
                // Override default link behavior
                const link = card.querySelector('a');
                if (link) {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        navigateToRestaurant(restaurant);
                    });
                }
            }
        }
    });
}

/**
 * Navigate to restaurant detail page
 * @param {Object} restaurant - Restaurant object
 */
function navigateToRestaurant(restaurant) {
    // Save restaurant data to localStorage
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));

    // Navigate to restaurant page
    // Navigate to restaurant page
    window.location.href = `/restaurant/${restaurant.id}`;
}

/**
 * Load and filter restaurants based on city and category
 */
function loadAndFilterRestaurants() {
    const restaurantList = document.querySelector('.restaurant-list');
    if (!restaurantList) return;

    // Get selected city
    const selectedCity = localStorage.getItem('selectedCity') || 'Pune';

    // Get active category
    const activeCard = document.querySelector('.food-card.active');
    const selectedCategory = activeCard ?
        (activeCard.getAttribute('data-category') || activeCard.querySelector('p').textContent.trim()) :
        null;

    // Filter restaurants
    let filteredRestaurants = restaurants.filter(r => r.city === selectedCity);

    if (selectedCategory) {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.category === selectedCategory ||
            r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
        );
    }

    // Display restaurants
    displayRestaurants(filteredRestaurants, restaurantList);

    // Update section title
    updateSectionTitle(selectedCity);
}

/**
 * Display restaurants in the container
 * @param {Array} restaurantArray - Array of restaurant objects
 * @param {HTMLElement} container - Container element
 */
function displayRestaurants(restaurantArray, container) {
    // Clear existing content
    container.innerHTML = '';

    if (restaurantArray.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No restaurants found. Try a different category or city.</p>';
        return;
    }

    restaurantArray.forEach(restaurant => {
        const card = createRestaurantCard(restaurant);
        container.appendChild(card);
    });
}

/**
 * Create a restaurant card element
 * @param {Object} restaurant - Restaurant object
 * @returns {HTMLElement} Restaurant card element
 */
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.setAttribute('data-restaurant-id', restaurant.id);

    card.innerHTML = `
        <a href="/restaurant/${restaurant.id}">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.cuisine}</p>
                <span>⭐ ${restaurant.rating}</span>
            </div>
        </a>
    `;

    // Add click handler to save restaurant data
    const link = card.querySelector('a');
    link.addEventListener('click', function (e) {
        e.preventDefault();
        navigateToRestaurant(restaurant);
    });

    return card;
}

/**
 * Update section title with city name
 * @param {string} city - City name
 */
function updateSectionTitle(city) {
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle && sectionTitle.textContent.includes('Pune')) {
        sectionTitle.textContent = `Delivery Restaurants in ${city}`;
    }
}

/**
 * Setup city filtering (sync with city dropdown if it exists)
 */
function setupCityFiltering() {
    // Check if there's a city selector on this page
    const citySelect = document.querySelector('select');

    if (citySelect) {
        // Load saved city
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity) {
            citySelect.value = savedCity;
        }

        // Update on change
        citySelect.addEventListener('change', function () {
            const selectedCity = citySelect.value;
            localStorage.setItem('selectedCity', selectedCity);
            loadAndFilterRestaurants();
        });
    }
}

// Make filterRestaurants function available globally for main.js
window.filterRestaurants = function () {
    loadAndFilterRestaurants();
};
