/**
 * payment_logic.js - Handles dynamic UI and payment simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    const payOptions = document.querySelectorAll('input[name="pay"]');
    const cardDetails = document.querySelector('.card-details');
    const payBtn = document.querySelector('.pay-btn');
    const upiDetails = document.createElement('div');
    upiDetails.className = 'upi-details';
    upiDetails.style.display = 'none';
    upiDetails.innerHTML = `
        <input type="text" placeholder="Enter UPI ID (e.g., user@okicici)" style="width: 100%; padding: 10px; margin-top: 10px; border-radius: 5px; border: 1px solid #ccc;">
        <div style="margin-top: 10px;">
            <label><input type="radio" name="upi_app" value="GPay"> Google Pay</label>
            <label><input type="radio" name="upi_app" value="PhonePe"> PhonePe</label>
            <label><input type="radio" name="upi_app" value="Paytm"> Paytm</label>
        </div>
    `;
    cardDetails.parentNode.insertBefore(upiDetails, cardDetails);

    // Initial total from localStorage
    const totalAmount = localStorage.getItem('cart_total') || '450';
    payBtn.innerText = `Pay ₹${totalAmount}`;

    function updateUI() {
        const selected = document.querySelector('input[name="pay"]:checked').nextElementSibling.innerText;

        if (selected.includes('UPI')) {
            cardDetails.style.display = 'none';
            upiDetails.style.display = 'block';
        } else if (selected.includes('Card')) {
            cardDetails.style.display = 'block';
            upiDetails.style.display = 'none';
        } else {
            cardDetails.style.display = 'none';
            upiDetails.style.display = 'none';
        }
    }

    payOptions.forEach(opt => opt.addEventListener('change', updateUI));
    updateUI(); // Set initial state

    // Simulating Razorpay/Payment Success
    payBtn.addEventListener('click', () => {
        const method = document.querySelector('input[name="pay"]:checked').nextElementSibling.innerText;

        payBtn.disabled = true;
        payBtn.innerText = 'Processing...';

        setTimeout(() => {
            const paymentData = {
                amount: totalAmount,
                method: method,
                status: 'Success',
                orderId: 'ORD' + Date.now()
            };

            // Save to storage (assumes storage.js is loaded)
            if (typeof db !== 'undefined') {
                db.savePayment(paymentData);
                db.saveOrder({
                    items: JSON.parse(localStorage.getItem('zomato_cart')) || [],
                    total: totalAmount,
                    status: 'Placed'
                });
            }

            alert('Payment Successful! Your order has been placed.');
            localStorage.removeItem('zomato_cart');
            localStorage.removeItem('cart_total');
            window.location.href = '/user/user-dashboard.html';
        }, 2000);
    });

    // Wallet/Other button clicks
    const walletBtns = document.querySelectorAll('.options button');
    walletBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const walletName = btn.innerText;
            if (confirm(`Do you want to pay using ${walletName}?`)) {
                payBtn.click(); // Reuse the payment logic
            }
        });
    });
});


function payNow() {
    var options = {
        "key": "rzp_test_123456789", // test key (dummy)
        "amount": 50000, // ₹500 (amount × 100)
        "currency": "INR",
        "name": "Zomato Clone",
        "description": "Food Order Payment",
        "image": "zomato-logo.png",
        "handler": function (response) {
            alert("Payment Successful!");
            window.location.href = "/user/user-dashboard.html";
        },
        "prefill": {
            "name": "User Name",
            "email": "user@gmail.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#e23744"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
}

