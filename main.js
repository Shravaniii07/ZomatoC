/**
 * Zomato Clone - Main Page JavaScript (index.html)
 * Handles search suggestions, city filtering, and restaurant navigation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMainPage();
});

/**
 * Initialize all functionality for the main page
 */
function initializeMainPage() {
    setupCityDropdown();
    setupSearchSuggestions();
    loadRestaurants();
}

/**
 * Setup city dropdown with localStorage persistence
 */
function setupCityDropdown() {
    const citySelect = document.getElementById('citySelect') || document.querySelector('.search-box select');
    
    if (!citySelect) return;
    
    // Load saved city from localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
        citySelect.value = savedCity;
    }
    
    // Save city selection when changed
    citySelect.addEventListener('change', function() {
        const selectedCity = citySelect.value;
        localStorage.setItem('selectedCity', selectedCity);
        
        // If on delivery page, filter restaurants
        if (window.location.pathname.includes('delivery.html')) {
            filterRestaurantsByCity(selectedCity);
        }
    });
}

/**
 * Setup live search suggestions
 */
function setupSearchSuggestions() {
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-box input');
    
    if (!searchInput) return;
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.display = 'none';
    // Append to search box container for proper positioning
    const searchBox = searchInput.closest('.search-box');
    if (searchBox) {
        searchBox.appendChild(suggestionsContainer);
    } else {
        searchInput.parentElement.appendChild(suggestionsContainer);
    }
    
    // Show suggestions on input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Get matching suggestions
        const suggestions = getSearchSuggestions(query);
        
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Display suggestions
        displaySuggestions(suggestions, suggestionsContainer, query);
        suggestionsContainer.style.display = 'block';
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Handle Enter key to search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

/**
 * Get search suggestions based on query
 * @param {string} query - Search query
 * @returns {Array} Array of suggestion objects
 */
function getSearchSuggestions(query) {
    const suggestions = [];
    const queryLower = query.toLowerCase();
    
    // Search in restaurant names
    restaurants.forEach(restaurant => {
        if (restaurant.name.toLowerCase().includes(queryLower)) {
            suggestions.push({
                type: 'restaurant',
                name: restaurant.name,
                data: restaurant
            });
        }
    });
    
    // Search in food items
    foodItems.forEach(item => {
        if (item.toLowerCase().includes(queryLower) && 
            !suggestions.some(s => s.name === item)) {
            suggestions.push({
                type: 'food',
                name: item,
                data: item
            });
        }
    });
    
    // Limit to 8 suggestions
    return suggestions.slice(0, 8);
}

/**
 * Display search suggestions in the container
 * @param {Array} suggestions - Array of suggestion objects
 * @param {HTMLElement} container - Container element
 * @param {string} query - Original search query
 */
function displaySuggestions(suggestions, container, query) {
    container.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        // Highlight matching text
        const displayName = highlightMatch(suggestion.name, query);
        suggestionItem.innerHTML = displayName;
        
        // Add click handler
        suggestionItem.addEventListener('click', function() {
            handleSuggestionClick(suggestion);
            container.style.display = 'none';
        });
        
        // Add hover effect
        suggestionItem.addEventListener('mouseenter', function() {
            suggestionItem.style.backgroundColor = '#f5f5f5';
        });
        suggestionItem.addEventListener('mouseleave', function() {
            suggestionItem.style.backgroundColor = 'white';
        });
        
        container.appendChild(suggestionItem);
    });
}

/**
 * Highlight matching text in suggestion
 * @param {string} text - Full text
 * @param {string} query - Search query
 * @returns {string} HTML with highlighted text
 */
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

/**
 * Handle click on a search suggestion
 * @param {Object} suggestion - Suggestion object
 */
function handleSuggestionClick(suggestion) {
    if (suggestion.type === 'restaurant') {
        // Navigate to restaurant page
        navigateToRestaurant(suggestion.data);
    } else if (suggestion.type === 'food') {
        // Filter by food category or navigate to delivery page
        const foodCategory = getCategoryFromFoodItem(suggestion.name);
        
        // Save search query for filtering
        localStorage.setItem('searchQuery', suggestion.name);
        localStorage.setItem('filterCategory', foodCategory);
        
        // Navigate to delivery page
        window.location.href = 'delivery.html';
    }
}

/**
 * Get category from food item name
 * @param {string} foodItem - Food item name
 * @returns {string} Category name
 */
function getCategoryFromFoodItem(foodItem) {
    const categoryMap = {
        'pizza': 'Pizza',
        'burger': 'Burger',
        'biryani': 'Biryani',
        'sandwich': 'Sandwich',
        'taco': 'Taco',
        'rolls': 'Rolls',
        'cake': 'Cake',
        'north indian': 'North Indian',
        'chinese': 'Chinese',
        'chicken': 'Chicken'
    };
    
    const foodLower = foodItem.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
        if (foodLower.includes(key)) {
            return value;
        }
    }
    
    return '';
}

/**
 * Perform search action
 * @param {string} query - Search query
 */
function performSearch(query) {
    // Save search query
    localStorage.setItem('searchQuery', query);
    
    // Navigate to delivery page to show results
    window.location.href = 'delivery.html';
}

/**
 * Navigate to restaurant detail page
 * @param {Object} restaurant - Restaurant object
 */
function navigateToRestaurant(restaurant) {
    // Save restaurant data to localStorage
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    
    // Navigate to restaurant page
    window.location.href = restaurant.page;
}

/**
 * Load and display restaurants (if restaurant cards exist on this page)
 */
function loadRestaurants() {
    const restaurantList = document.querySelector('.restaurant-list');
    
    if (!restaurantList) return;
    
    // Get selected city
    const citySelect = document.getElementById('citySelect') || document.querySelector('.search-box select');
    const selectedCity = citySelect ? citySelect.value : 'Pune';
    
    // Filter restaurants by city
    const cityRestaurants = restaurants.filter(r => r.city === selectedCity);
    
    // Display restaurants
    displayRestaurants(cityRestaurants, restaurantList);
}

/**
 * Display restaurants in the container
 * @param {Array} restaurantArray - Array of restaurant objects
 * @param {HTMLElement} container - Container element
 */
function displayRestaurants(restaurantArray, container) {
    container.innerHTML = '';
    
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
        <a href="${restaurant.page}">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.cuisine}</p>
                <span>⭐ ${restaurant.rating}</span>
            </div>
        </a>
    `;
    
    // Add click handler to save restaurant data
    card.addEventListener('click', function(e) {
        e.preventDefault();
        navigateToRestaurant(restaurant);
    });
    
    return card;
}

/**
 * Filter restaurants by city (used when city changes)
 * @param {string} city - City name
 */
function filterRestaurantsByCity(city) {
    // This function will be used by delivery.js
    // It's defined here for consistency
    if (typeof window.filterRestaurants === 'function') {
        window.filterRestaurants();
    }
}
