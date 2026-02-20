/**
 * Zomato Clone - Restaurant Detail Page JavaScript
 * Dynamically loads restaurant data and menu items
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRestaurantPage();
});

/**
 * Initialize restaurant detail page
 */
function initializeRestaurantPage() {
    loadRestaurantData();
    setupMenuSearch();
}

/**
 * Load restaurant data from localStorage or query string
 */
function loadRestaurantData() {
    let restaurantData = null;
    
    // Try to get from localStorage first
    const savedRestaurant = localStorage.getItem('selectedRestaurant');
    if (savedRestaurant) {
        try {
            restaurantData = JSON.parse(savedRestaurant);
        } catch (e) {
            console.error('Error parsing restaurant data:', e);
        }
    }
    
    // If not in localStorage, try to get from query string
    if (!restaurantData) {
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('id');
        const restaurantName = urlParams.get('name');
        
        if (restaurantId) {
            restaurantData = restaurants.find(r => r.id === parseInt(restaurantId));
        } else if (restaurantName) {
            restaurantData = restaurants.find(r => r.name === restaurantName);
        }
    }
    
    // If still not found, try to infer from page URL or title
    if (!restaurantData) {
        restaurantData = inferRestaurantFromPage();
    }
    
    // Display restaurant data
    if (restaurantData) {
        displayRestaurantHeader(restaurantData);
        displayRestaurantMenu(restaurantData);
    } else {
        // Fallback: use default data or show error
        console.warn('Restaurant data not found. Using default display.');
        displayDefaultRestaurant();
    }
}

/**
 * Infer restaurant from current page
 * @returns {Object|null} Restaurant object or null
 */
function inferRestaurantFromPage() {
    const pageName = window.location.pathname.split('/').pop().replace('.html', '');
    const pageTitle = document.title.toLowerCase();
    
    // Try to match by page name or title
    for (const restaurant of restaurants) {
        const restaurantPage = restaurant.page.replace('.html', '');
        const restaurantNameLower = restaurant.name.toLowerCase();
        
        if (pageName === restaurantPage || 
            pageTitle.includes(restaurantNameLower) ||
            restaurantNameLower.includes(pageName)) {
            return restaurant;
        }
    }
    
    // Try common mappings
    const pageMappings = {
        'pizzahut': 'Pizza Hut',
        'order': 'Dominos Pizza',
        'mcd': 'Mc Donalds',
        'behrouz': 'Behrouz Biryani',
        'bk': 'Burger King',
        'wonk': 'Chinese Wonk',
        'what': "What' A Sandwich",
        'tacobell': 'Taco Bell',
        'mania': 'Rolls Mania',
        'cakedior': 'Cake Dior, Koregaon Park',
        'belgium': 'Belgium Waffle'
    };
    
    if (pageMappings[pageName]) {
        return restaurants.find(r => r.name === pageMappings[pageName]);
    }
    
    return null;
}

/**
 * Display restaurant header information
 * @param {Object} restaurant - Restaurant object
 */
function displayRestaurantHeader(restaurant) {
    const header = document.querySelector('.order-header');
    if (!header) return;
    
    const h1 = header.querySelector('h1');
    const p = header.querySelector('p');
    const rating = header.querySelector('.rating');
    
    if (h1) h1.textContent = restaurant.name;
    if (p) p.textContent = `${restaurant.cuisine} • ₹${restaurant.price} for one`;
    if (rating) rating.textContent = `⭐ ${restaurant.rating}`;
}

/**
 * Display restaurant menu items
 * @param {Object} restaurant - Restaurant object
 */
function displayRestaurantMenu(restaurant) {
    const menuList = document.getElementById('menuList');
    if (!menuList) return;
    
    // Get menu for this restaurant
    const menu = restaurantMenus[restaurant.name];
    
    if (!menu || menu.length === 0) {
        // If no menu data, keep existing menu items
        console.warn(`No menu data found for ${restaurant.name}`);
        return;
    }
    
    // Clear existing menu (if dynamically generated)
    const existingItems = menuList.querySelectorAll('.menu-item[data-dynamic="true"]');
    existingItems.forEach(item => item.remove());
    
    // Add menu items
    menu.forEach(menuItem => {
        const menuItemElement = createMenuItemElement(menuItem);
        menuList.appendChild(menuItemElement);
    });
}

/**
 * Create a menu item element
 * @param {Object} menuItem - Menu item object
 * @returns {HTMLElement} Menu item element
 */
function createMenuItemElement(menuItem) {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.setAttribute('data-dynamic', 'true');
    item.setAttribute('data-item-name', menuItem.name.toLowerCase());
    
    item.innerHTML = `
        <img src="${menuItem.image}" alt="${menuItem.name}">
        <div class="details">
            <h3>${menuItem.name}</h3>
            <p>${menuItem.description}</p>
            <span>₹${menuItem.price}</span>
        </div>
        <button onclick="addToCart('${menuItem.name}', ${menuItem.price})">Add</button>
    `;
    
    return item;
}

/**
 * Display default restaurant (fallback)
 */
function displayDefaultRestaurant() {
    // Try to use the first restaurant as default
    if (restaurants.length > 0) {
        const defaultRestaurant = restaurants[0];
        displayRestaurantHeader(defaultRestaurant);
        displayRestaurantMenu(defaultRestaurant);
    }
}

/**
 * Setup menu search functionality
 */
function setupMenuSearch() {
    const menuSearch = document.getElementById('menu-search');
    if (!menuSearch) return;
    
    menuSearch.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        filterMenuItems(query);
    });
}

/**
 * Filter menu items based on search query
 * @param {string} query - Search query
 */
function filterMenuItems(query) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const itemName = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const itemDescription = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (query === '' || 
            itemName.includes(query) || 
            itemDescription.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Make addToCart and placeOrder functions available globally
// (These might already exist in order.js, but we'll provide fallbacks)

if (typeof addToCart === 'undefined') {
    window.addToCart = function(itemName, price) {
        // Get or create cart
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Add item to cart
        cart.push({ name: itemName, price: price });
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display if it exists
        updateCartDisplay();
        
        // Show feedback
        alert(`${itemName} added to cart!`);
    };
}

if (typeof placeOrder === 'undefined') {
    window.placeOrder = function() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Navigate to payment page
        window.location.href = 'payment.html';
    };
}

if (typeof filterMenu === 'undefined') {
    window.filterMenu = function() {
        const menuSearch = document.getElementById('menu-search');
        if (menuSearch) {
            const query = menuSearch.value.trim().toLowerCase();
            filterMenuItems(query);
        }
    };
}

/**
 * Update cart display (if cart summary exists)
 */
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add cart items
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    
    // Update total
    if (cartTotal) {
        cartTotal.textContent = total;
    }
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
});
