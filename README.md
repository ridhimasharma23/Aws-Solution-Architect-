Student Attendance & Result Management System (AWS)
This project is a web-based Student Attendance and Result Management System deployed on Amazon Web Services (AWS). It allows admins and teachers to manage students, mark attendance, store exam results, and lets students view their own records through a public URL.​

Features
Role-based access: Admin, Teacher, Student.​

Student master data (ID, name, class, basic details).​

Daily attendance marking (Present / Absent).​

Result entry with automatic calculation of totals/grades.​

Student view for attendance percentage and results.​

Hosted on AWS Free Tier with a shareable URL for demonstration.​

Tech Stack
Frontend

HTML – index.html

CSS – style.css

JavaScript – app.js, data.js

API Layer

JavaScript – api.js (for calling backend / AWS services)

Cloud (Typical AWS Setup)

AWS S3 / Amplify / EC2 for hosting the web app.​

AWS RDS or DynamoDB for storing students, attendance, and results.​

AWS CloudFront for HTTPS URL and caching.​

AWS CloudWatch for logs and basic monitoring.

Running the Project Locally
Clone the repository:

bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
Start a simple local server:

bash
# Python 3
python -m http.server 8000
Open the application in a browser:

text
http://localhost:8000
After deployment on AWS, update api.js to point to your actual backend/API endpoint.

AWS Deployment (Overview)
Upload the frontend files (index.html, style.css, app.js, data.js, api.js) to S3, Amplify, or host them on EC2.​

Configure a database (for example, RDS PostgreSQL/MySQL or DynamoDB) with tables for Students, Attendance, and Results.​

Place CloudFront in front of the hosting service to get a secure HTTPS URL.​

Optionally use CloudWatch to monitor logs and performance.

Example final URL (replace with your actual URL):

text
https://your-distribution-id.cloudfront.net
