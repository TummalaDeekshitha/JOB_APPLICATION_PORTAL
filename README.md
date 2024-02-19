# Project Overview: JobForge
## Description:
### JobForge is a comprehensive job application portal designed to facilitate the interaction between job seekers and employers. The platform enables users to apply for various job opportunities while providing employers with the capability to post job listings. JobForge aims to streamline the job application process, offering a user-friendly interface.
## Technologies Used
## Front-end:
### HTML:
Used for structuring the content of the web pages.
### CSS/Bootstrap: 
Applied for styling and responsiveness to enhance the user interface.
### JavaScript: 
Employed for client-side interactions and dynamic content.
## Back-end:
### Node.js:
Utilized as the server-side runtime environment.
### Express.js: 
Implemented to build robust and scalable web applications.
### MongoDB: 
Employed as the database to store and manage job listings, user data, and application details.


## Features
### User-Friendly Interface:
JobForge boasts an intuitive and visually appealing user interface, providing a seamless experience for both job seekers and employers.

### Secure Authentication:
User authentication is implemented to ensure secure access to the portal, with user data stored securely in MongoDB.
Installation and Usage
## Prerequisites:
Node.js and npm should be installed on your machine.
MongoDB should be installed and running.
## Steps:
1. Clone the repository from GitHub.
2. Navigate to the project directory.
3. Install dependencies using npm install.
4. Start the server using npm start.
5. Access the application through your web browser.
## Conclusion
JobForge offers a robust solution for job seekers and employers, providing an efficient platform for job applications and postings. With its user-friendly interface and secure authentication, JobForge aims to simplify the job search process for users while meeting the needs of employers

## To run the application
1. Create a .env file with the following:  (Replace the text in "" with actual values)
   - USERNAME="mongodbaccount username"
   - PASSWORD="password"
   - URL = "mongodbatlas url"
   - ACCESSKEY="access key of s3 bucket"
   - SECRETACESSKEY="secretaccesskey of bucket" 
   - BUCKETNAME="bucketname"
   - REGION="region"
   - EMAILPASSWORD="email password"
   - EMAIL="email "
   - ADMINEMAIL="admin email"
2. Have Node setup on your system
3. ``` npm install ```
4. ``` npm start ```
5. Open http://localhost:6557 on your browser
