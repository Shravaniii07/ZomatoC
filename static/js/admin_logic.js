/**
 * admin_logic.js - CRUD operations for Admin Panel
 */

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('tbody');
    const addBtn = document.querySelector('.add-btn');

    function renderRestaurants() {
        if (!tableBody) return;
        const list = db.getRestaurants();
        tableBody.innerHTML = '';
        list.forEach((res, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${res.name}</td>
                <td>${res.category || 'N/A'}</td>
                <td>${res.city || 'Pune'}</td>
                <td class="${res.status === 'Closed' ? 'closed' : 'open'}">${res.status || 'Open'}</td>
                <td>
                    <button class="btn-circle-icon btn-edit" onclick="editRes(${res.id})"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="btn-circle-icon btn-delete" onclick="deleteRes(${res.id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.deleteRes = (id) => {
        if (confirm('Are you sure you want to delete this restaurant?')) {
            db.deleteRestaurant(id);
            renderRestaurants();
        }
    };

    window.editRes = (id) => {
        const list = db.getRestaurants();
        const res = list.find(r => r.id === id);
        const newName = prompt('Enter new name:', res.name);
        if (newName) {
            res.name = newName;
            db.saveRestaurant(res);
            renderRestaurants();
        }
    };

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = prompt('Enter Restaurant Name:');
            const cat = prompt('Enter Category (Pizza/Burger/etc):');
            if (name) {
                db.saveRestaurant({ name, category: cat, status: 'Open' });
                renderRestaurants();
            }
        });
    }

    // Initialize
    if (typeof db !== 'undefined') {
        renderRestaurants();
    }
});
