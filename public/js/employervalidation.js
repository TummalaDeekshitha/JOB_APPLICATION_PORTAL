
    async function validateform(event) {
        var companyName = document.getElementById('companyname').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var employerId = document.getElementById('employerid').value;
        var aadharNo = document.getElementById('aadharno').value;
        var val=true
        // Simple email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            event.preventDefault();
            return false;
           
        }

        // Basic required field validation
        if (companyName.trim() === '' || email.trim() === '' || password.trim() === '' || employerId.trim() === '' || aadharNo.trim() === '') {
            alert('All fields are required.');
            event.preventDefault();
           return  false;
        }

        // Aadhar number validation
        var aadharRegex = /^\d{12}$/;
        if (!aadharRegex.test(aadharNo)) {
            alert('Please enter a valid 12-digit Aadhar number.');
            event.preventDefault();
            return false;
        }
        
       
    }
