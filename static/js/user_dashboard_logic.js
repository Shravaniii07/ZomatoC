/**
 * user_dashboard_logic.js - Populates User Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('zomato_current_user') || 'User';
    const headerP = document.querySelector('.header p');
    if (headerP) headerP.innerText = `Welcome, ${userName}! Track your orders & bookings.`;

    // We can add sections dynamically or just link to other pages
    // The user asked for profile info, past orders, current orders, table bookings, and payment history.

    // Let's create a container for showing these if needed, or update existing boxes.
    const ordersBox = document.querySelectorAll('.box')[2];
    if (ordersBox) {
        ordersBox.addEventListener('click', () => {
            // In a real app, this would show a list. For this clone, let's just show an alert or redirect.
            const orders = JSON.parse(localStorage.getItem('zomato_orders')) || [];
            if (orders.length > 0) {
                alert(`You have ${orders.length} orders in history.`);
            } else {
                alert('No orders found.');
            }
        });
    }
});
