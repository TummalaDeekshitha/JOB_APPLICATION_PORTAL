
       async function applicationsubmit(event){
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var phone = document.getElementById('phone').value;
            var coverLetter = document.getElementById('coverLetter').value;
             var val=true;
            
            if (name.trim() === '') {
                alert('Please enter your Full Name.');
                 return false;
            }

            
            var nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(name)) {
                alert('Full Name should contain only alphabets.');
               return false
            }

            
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
               return false
            }

            
            var phoneRegex = /^\d{10}$/; 
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
               return false
            }

           
            if (coverLetter.trim() === '') {
                alert('Please enter your Cover Letter.');
                return false
            }


        //     if(val==true)
        // {
        //     var name1 = document.getElementById('name').value;
        //     var email1= document.getElementById('email').value;
        //     var phone1= document.getElementById('phone').value;
        //     var coverLetter1 = document.getElementById('coverLetter').value;
        //      var companyname1=document.getElementById('companyName').value;
        //      var category1 =document.getElementById('category').value
        //      var jobname1=document.getElementById('jobName').value;
        //     var resumeFile1= document.getElementById('resume').files[0];

           
        //     // Alternatively, you can pass the body directly as an object
        //     var formData = new FormData();
        //     formData.append('name', name1);
        //     formData.append('email', email1);
        //     formData.append('phone', phone1);
        //     formData.append('coverLetter', coverLetter1);
        //     formData.append('jobname', jobname1);
        //     formData.append('companyname', companyname1);
        //     formData.append('category', category1);
        //     formData.append('resume', resumeFile1);
        //     console.log(formData);
        //     // Send the form data to the server using fetch API
        //     await fetch('/applicationformsubmit', {
        //         method: 'POST',
        //         headers: {
                    
        //         },
        //         body: formData
        //     })
        //     .then(response => {
        //         console.log("return from req");
        //         window.location.href=response.url;
        //     })
        //     .catch(error => {
        //         // Handle errors
        //         console.error('Error:', error);
        //     });
        // }
        // else{
        // event.preventDefault();
        // }
    }

            // If all validations pass, submit the form
            
   
        