# 🏢 Job Portal System

A full-stack web application built with the **MERN Stack** that connects **Job Seekers** with **Employers**. Built as part of the Full Stack Development Lab (22CS631PL).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Axios, React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Plain CSS with CSS Variables |

---

## ✨ Features

### 👤 Job Seeker
- Register and log in securely
- Browse and search jobs by title, skill, company, or location
- Filter jobs by type (Full-time, Part-time, Internship, Remote, Contract)
- Apply to jobs with an optional cover letter
- Track application status (Pending → Reviewed → Shortlisted → Hired)
- Manage personal profile and skills

### 🏢 Employer
- Register and log in as an employer
- Post new job listings with title, description, skills, salary, and deadline
- View all applicants for each job posting
- Update applicant status from the dashboard
- Delete job postings

### 🔐 General
- Role-based access control (Job Seeker vs Employer)
- JWT-secured protected routes
- Responsive design — works on mobile and desktop
- Toast notifications for all actions

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── profileRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/
        │   ├── Navbar.js
        │   ├── JobCard.js
        │   └── Spinner.js
        ├── pages/
        │   ├── Home.js
        │   ├── Jobs.js
        │   ├── JobDetail.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── PostJob.js
        │   ├── MyApplications.js
        │   └── Profile.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## ⚙️ Setup & Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/job-portal-system.git
cd job-portal-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Jobs
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/jobs` | Public — supports `?search=`, `?location=`, `?jobType=` |
| GET | `/api/jobs/:id` | Public |
| POST | `/api/jobs` | Employer only |
| PUT | `/api/jobs/:id` | Employer (owner only) |
| DELETE | `/api/jobs/:id` | Employer (owner only) |
| GET | `/api/jobs/employer/myjobs` | Employer only |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications/:jobId` | Job Seeker only |
| GET | `/api/applications/my` | Job Seeker only |
| GET | `/api/applications/job/:jobId` | Employer only |
| PUT | `/api/applications/:id/status` | Employer only |

### Profile
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/profile/me` | Private |
| PUT | `/api/profile/me` | Private |

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section + latest jobs |
| Browse Jobs | `/jobs` | All jobs with search & filters |
| Job Detail | `/jobs/:id` | Full job info + apply button |
| Login | `/login` | Login form |
| Register | `/register` | Register with role selection |
| Dashboard | `/dashboard` | Role-specific dashboard |
| Post Job | `/post-job` | Employer: create a job listing |
| My Applications | `/my-applications` | Seeker: track applications |
| Profile | `/profile` | Edit profile info |

---

## 🛡️ Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `NODE_ENV` | `development` or `production` |

> ⚠️ Never commit your `.env` file to GitHub. It is already excluded via `.gitignore`.

---

## 🧪 Running a Quick Test

1. Register as an **Employer** → Post a job
2. Logout → Register as a **Job Seeker** → Apply to that job
3. Logout → Login as the Employer → Dashboard → View Applicants → Change status to **Shortlisted**
4. Login as Job Seeker → My Applications → See updated status

---

## 👨‍💻 Author

**Vivek**
B.Tech VI Semester — Computer Science & Engineering
Course: Full Stack Development Lab (22CS631PL)

---

## 📄 License

This project is built for educational purposes as part of a lab assignment.
