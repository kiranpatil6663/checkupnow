CheckUpNow – Medical Appointment Booking System

Live Site: https://checkupnow-frontend.onrender.com/

Overview

CheckUpNow is a full-stack Medical Appointment Booking System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
It simplifies the process of booking, managing, and tracking doctor appointments for patients while providing doctors and admins with powerful dashboards to manage users and appointments efficiently.

Features
Authentication & Authorization

Secure, role-based login system for Admin, Doctor, and Patient.

Implemented JWT (JSON Web Tokens) and bcrypt for password encryption and session management.

Admin Dashboard

Manage doctors, patients, and appointments.

Perform CRUD operations on users and medical staff.

View and handle appointment requests in real time.

Appointment Management

Real-time slot availability tracking and conflict-prevention logic.

Patients can book, cancel, or reschedule appointments.

Doctors can approve or reject appointment requests.

Frontend

Built using React.js with Tailwind CSS for a clean, modern UI.

Responsive design for mobile, tablet, and desktop.

Dynamic forms and components for smooth user interaction.

Backend

Express.js RESTful APIs to handle all CRUD operations.

Integrated MongoDB for database management of users, doctors, and appointments.

Middleware-based validation and error handling.

DevOps & Deployment

Version control with Git & GitHub.

Deployed both frontend and backend on Render with continuous deployment enabled.

Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS
Backend	Node.js, Express.js
Database	MongoDB
Authentication	JWT, bcrypt
Deployment	Render
Version Control	Git, GitHub

## 📂 Project Structure

```bash
CheckUpNow/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   ├── public/
│   └── package.json
│
├── README.md
└── package.json



How to Run Locally
1. Clone the Repository
git clone https://github.com/your-username/checkupnow.git
cd checkupnow

2. Install Dependencies

Backend:

cd backend
npm install


Frontend:

cd ../frontend
npm install

3. Set Up Environment Variables

Create a .env file in the backend folder with the following variables:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

4. Run the App

Open two terminals:

Backend:

npm run server


Frontend:

npm start


The app will run locally at http://localhost:3000/
.
```
Future Enhancements

Add email/SMS notifications for appointment reminders.

Enable online consultation (video call) feature.

Implement payment gateway for appointment booking.

Add analytics dashboard for Admin.

Author

Kiran
Final-Year Software Engineering Student @ REVA University
