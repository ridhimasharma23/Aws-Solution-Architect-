# Student Attendance & Result Management System (AWS)

This project is a web-based **Student Attendance and Result Management System** deployed on **Amazon Web Services (AWS)**. It allows admins and teachers to manage students, mark attendance, store exam results, and lets students view their own records through a public URL.

---

## Features

- Role-based access: **Admin**, **Teacher**, **Student**
- Student master data (ID, name, class, basic details)
- Daily attendance marking (Present / Absent)
- Result entry with automatic calculation of totals/grades
- Student view for attendance percentage and results
- Hosted on **AWS Free Tier** with a shareable URL for demonstration

---

## Tech Stack

### Frontend

- **HTML** – `index.html`
- **CSS** – `style.css`
- **JavaScript** – `app.js`, `data.js`

### API Layer

- **JavaScript** – `api.js` (used for calling backend / AWS services)

### Cloud (AWS – typical setup)

- **AWS S3 / Amplify / EC2** – hosting the web application
- **AWS RDS / DynamoDB** – storing Students, Attendance, and Results data
- **AWS CloudFront** – providing HTTPS URL and caching
- **AWS CloudWatch** – logs and basic monitoring

---

## Running the Project Locally

1. **Clone the repository**
