/**
 * auth_logic.js - Handles Signup, Login, and Google simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ADMIN CREDENTIALS
    const ADMIN_CREDENTIALS = {
        identifier: 'admin@zomato.com',
        phone: '9999999999',
        password: 'admin'
    };

    // SIGNUP LOGIC
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            const users = db.getUsers();
            if (users.find(u => u.email === email)) {
                alert('Account already exists with this email/phone');
                return;
            }

            db.saveUser({ name, email, password });
            alert('Account created successfully! Please login.');
            window.location.href = '/login.html';
        });
    }

    // LOGIN LOGIC
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const identifier = document.getElementById('login-identifier').value;
            const password = document.getElementById('login-password').value;

            if (!identifier || !password) {
                alert('Please enter your credentials');
                return;
            }

            // Check Admin
            if ((identifier === ADMIN_CREDENTIALS.identifier || identifier === ADMIN_CREDENTIALS.phone) && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('zomato_current_user', 'Admin');
                window.location.href = '/admin/admin-dashboard.html';
                return;
            }

            // Check User
            const users = db.getUsers();
            const user = users.find(u => u.email === identifier && u.password === password);

            if (user) {
                localStorage.setItem('zomato_current_user', user.name);
                window.location.href = '/';
            } else {
                alert('Invalid email/phone or password');
            }
        });
    }

    // GOOGLE LOGIN SIMULATION
    const googleBtns = [document.getElementById('google-login-btn'), document.getElementById('google-signup-btn')];
    googleBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const demoUser = {
                    name: 'Demo Google User',
                    email: 'demo@gmail.com',
                    password: 'google-simulated'
                };

                const users = db.getUsers();
                if (!users.find(u => u.email === demoUser.email)) {
                    db.saveUser(demoUser);
                }

                localStorage.setItem('zomato_current_user', demoUser.name);
                alert('Logged in with Google (Simulated)');
                window.location.href = '/';
            });
        }
    });
});
