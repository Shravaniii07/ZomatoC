function s() {
    let phoneInput = document.querySelector("input");
    let phone = phoneInput ? phoneInput.value : "";

    if (phone === "") {
        alert("Please enter phone number");
        return;
    }

    if (phone.toLowerCase() === "admin" || phone === "9999999999") {
        localStorage.setItem('zomato_current_user', 'Admin');
        window.location.href = "admin/admin-dashboard.html";
    } else {
        localStorage.setItem('zomato_current_user', phone);
        window.location.href = "user/user-dashboard.html";
    }
}
