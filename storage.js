/**
 * storage.js - Handles data persistence using localStorage
 */

const STORAGE_KEYS = {
    RESTAURANTS: 'zomato_restaurants',
    ORDERS: 'zomato_orders',
    BOOKINGS: 'zomato_bookings',
    PAYMENTS: 'zomato_payments',
    CURRENT_USER: 'zomato_current_user',
    CART: 'zomato_cart',
    USERS: 'zomato_users'
};

// Initialize data if not present
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
        // data.js should be loaded before this
        if (typeof restaurants !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
        } else {
            localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify([]));
        }
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
}

// Helper functions
const db = {
    getData: (key) => JSON.parse(localStorage.getItem(key)) || [],
    setData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

    // Restaurants
    getRestaurants: () => db.getData(STORAGE_KEYS.RESTAURANTS),
    saveRestaurant: (restaurant) => {
        const list = db.getRestaurants();
        if (restaurant.id) {
            const index = list.findIndex(r => r.id === restaurant.id);
            if (index > -1) list[index] = restaurant;
        } else {
            restaurant.id = Date.now();
            list.push(restaurant);
        }
        db.setData(STORAGE_KEYS.RESTAURANTS, list);
    },
    deleteRestaurant: (id) => {
        const list = db.getRestaurants().filter(r => r.id !== id);
        db.setData(STORAGE_KEYS.RESTAURANTS, list);
    },

    // Orders
    getOrders: () => db.getData(STORAGE_KEYS.ORDERS),
    saveOrder: (order) => {
        const list = db.getOrders();
        order.id = 'ORD' + Date.now();
        order.date = new Date().toLocaleString();
        list.push(order);
        db.setData(STORAGE_KEYS.ORDERS, list);
    },

    // Bookings
    getBookings: () => db.getData(STORAGE_KEYS.BOOKINGS),
    saveBooking: (booking) => {
        const list = db.getBookings();
        booking.id = 'BK' + Date.now();
        list.push(booking);
        db.setData(STORAGE_KEYS.BOOKINGS, list);
    },

    // Payments
    getPayments: () => db.getData(STORAGE_KEYS.PAYMENTS),
    savePayment: (payment) => {
        const list = db.getPayments();
        payment.id = 'PAY' + Date.now();
        payment.date = new Date().toLocaleString();
        list.push(payment);
        db.setData(STORAGE_KEYS.PAYMENTS, list);
    },

    // Users
    getUsers: () => db.getData(STORAGE_KEYS.USERS),
    saveUser: (user) => {
        const list = db.getUsers();
        list.push(user);
        db.setData(STORAGE_KEYS.USERS, list);
    }
};

initStorage();
