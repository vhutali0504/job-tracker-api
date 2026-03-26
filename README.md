# Job Application Tracker API

A RESTful API for tracking job applications built with Node.js, Express, and PostgreSQL.

## Features
- User registration and login with JWT authentication
- Add, update, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected)
- Get a summary of applications grouped by status
- Protected routes — users only see their own data

## Tech Stack
- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL installed

### Installation

1. Clone the repository:
```
git clone https://github.com/vhutali0504/job-tracker-api.git
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root of the project:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job-tracker
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_here
```

4. Create the database tables by running this SQL in pgAdmin:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'Applied',
  date_applied DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Start the server:
```
npm run dev
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get token | No |

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/applications | Get all applications | Yes |
| POST | /api/applications | Add a new application | Yes |
| PUT | /api/applications/:id | Update an application | Yes |
| DELETE | /api/applications/:id | Delete an application | Yes |
| GET | /api/applications/summary | Get summary by status | Yes |

---

## Authentication

All application endpoints require a JWT token. To get a token, login via `/api/auth/login`.

Include the token in the request header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Request & Response Examples

### Register
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Add Application
**POST** `/api/applications`
```json
{
  "company": "Google",
  "role": "Junior Software Engineer",
  "status": "Applied",
  "date_applied": "2026-03-26",
  "notes": "Applied through LinkedIn"
}
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "company": "Google",
  "role": "Junior Software Engineer",
  "status": "Applied",
  "date_applied": "2026-03-26",
  "notes": "Applied through LinkedIn",
  "created_at": "2026-03-26T19:13:40.712Z"
}
```

### Summary
**GET** `/api/applications/summary`

Response:
```json
[
  { "status": "Applied", "count": "3" },
  { "status": "Interview", "count": "1" },
  { "status": "Rejected", "count": "1" }
]
```

---

## Project Structure
```
src/
├── controllers/        
│   ├── authController.js      
│   └── applicationController.js  
├── middleware/         
│   └── authMiddleware.js      
├── models/             
│   ├── userModel.js           
│   └── applicationModel.js    
├── routes/             
│   ├── authRoutes.js          
│   └── applicationRoutes.js   
├── config/             
│   └── db.js                  
└── app.js              
```

---

## Author
Mukhodobwane Vhutalihandivho — [GitHub](https://github.com/vhutali0504) 