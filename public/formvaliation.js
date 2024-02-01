function validateForm() {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Validate Username
    if (username.trim() === '') {
        alert('Please enter a username.');
        return false;
    }

    // Validate Email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Validate Password
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }

    // If all validations pass, submit the form
    return true;
}