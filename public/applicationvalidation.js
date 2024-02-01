
        function validateForm() {
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var phone = document.getElementById('phone').value;
            var coverLetter = document.getElementById('coverLetter').value;

            // Validate Full Name
            if (name.trim() === '') {
                alert('Please enter your Full Name.');
                return false;
            }

            // Validate that name contains only alphabets
            var nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(name)) {
                alert('Full Name should contain only alphabets.');
                return false;
            }

            // Validate Email
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }

            // Validate Phone Number
            var phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
                return false;
            }

            // Validate Cover Letter
            if (coverLetter.trim() === '') {
                alert('Please enter your Cover Letter.');
                return false;
            }

            // If all validations pass, submit the form
            return true;
        }
    