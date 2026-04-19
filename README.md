# BoardPrep — CBSE Board Exam Preparation Platform

A production-grade full-stack web application for CBSE Class 10 & 12 board exam preparation.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Backend | Django 5.2, Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| File Upload | Django FileField + local media storage |

## 📁 Project Structure

```
boardprep/
├── frontend/                 # Next.js App
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js           # Landing page
│   │   ├── login/page.js
│   │   ├── signup/page.js
│   │   ├── dashboard/
│   │   │   ├── student/      # Student dashboard + layout
│   │   │   └── teacher/      # Teacher dashboard + upload + manage-tests
│   │   ├── tests/
│   │   │   ├── page.js       # Test list
│   │   │   └── [id]/page.js  # Test engine with timer
│   │   └── materials/page.js # Materials browse with filters
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx       # Reusable sidebar (student + teacher)
│   │   ├── Card.jsx
│   │   └── Loader.jsx
│   ├── services/
│   │   └── api.js            # Centralized API + JWT interceptor
│   └── package.json
│
├── backend/                  # Django App
│   ├── boardprep/settings.py # JWT + CORS + custom user model
│   ├── users/                # Custom User model + auth views
│   ├── materials/            # Material CRUD with file uploads
│   ├── tests/                # Test + Question + Result + auto-grading
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## 🚀 Quick Start

### Backend

```bash
cd boardprep/backend
# If venv already exists:
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # Optional: create admin
python manage.py runserver         # → http://localhost:8000
```

### Frontend

```bash
cd boardprep/frontend
npm install
npm run dev                        # → http://localhost:3000
```

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | ❌ | Register new user |
| POST | `/api/auth/login/` | ❌ | Login → JWT tokens |
| GET | `/api/auth/profile/` | ✅ | Get current user |
| POST | `/api/auth/token/refresh/` | ❌ | Refresh access token |
| GET/POST | `/api/materials/` | ✅ | List/Create materials |
| GET/POST | `/api/tests/` | ✅ | List/Create tests |
| POST | `/api/tests/{id}/submit/` | ✅ | Submit test answers |
| POST | `/api/tests/{id}/add_questions/` | ✅ Teacher | Batch add questions |
| GET | `/api/tests/results/` | ✅ | View results |

## 🔒 Security Features

- ✅ Password hashing (Django's PBKDF2)
- ✅ JWT authentication with token refresh
- ✅ Role-based permissions (Student/Teacher)
- ✅ CORS restricted to localhost:3000
- ✅ Protected API routes
- ✅ Input validation via serializers
