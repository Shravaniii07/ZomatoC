/**
 * cart.js - Shared cart functionality
 */

function getCart() {
    return JSON.parse(localStorage.getItem('zomato_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('zomato_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart(cart);
    if (window.showToast) {
        window.showToast(`${name} added to cart! 🍕`, 'success');
    }
}

function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name);
    saveCart(cart);
}

function updateCartUI() {
    const list = document.getElementById('cartItems');
    const totalSpan = document.getElementById('cartTotal');
    if (!list) return;

    const cart = getCart();
    list.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.marginBottom = '10px';
        li.style.listStyle = 'none';
        li.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity} <button onclick="removeFromCart('${item.name}')" style="margin-left:10px; color:red; border:none; background:none; cursor:pointer;">✖</button></span>
        `;
        list.appendChild(li);
        total += item.price * item.quantity;
    });

    totalSpan.innerText = total;
    localStorage.setItem('cart_total', total);

    // Toggle empty message visibility
    const emptyMsg = document.getElementById('cart-empty-msg');
    if (emptyMsg) {
        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.setProperty('display', 'none', 'important');
        }
    }
}

function placeOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        if (window.showToast) window.showToast('Your cart is empty!', 'error');
        else alert('Your cart is empty!');
        return;
    }
    window.location.href = '/payment.html';
}

function filterMenu() {
    const searchInput = document.getElementById('menu-search');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        if (name.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initial UI update
document.addEventListener('DOMContentLoaded', updateCartUI);
