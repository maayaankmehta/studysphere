# StudySphere - Student Collaboration Platform

A modern fullstack student collaboration platform that enables users to create and join study sessions, form study groups, and track academic progress through a gamification system.

## 🚀 Features

- **Study Sessions** - Create time-bound study sessions with location, course code, and verification-based attendance 
- **Study Groups** - Form subject-based groups with admin-moderated approval workflow
- **Attendance Verification** - 6-digit code system to verify physical attendance at sessions
- **Session Resources** - Share links and materials within study sessions
- **Real-time Chat** - Messaging for session participants
- **Leaderboard** - Weekly and all-time rankings based on accumulated XP 
- **Badge System** - Achievement badges with custom icons and colors
- **User Progression** - Level-based system (1-5+) calculated from total XP

## 🛠 Technology Stack

### Frontend
- **Next.js 16** (React 19) - App Router, server components, routing  
- **Tailwind CSS 4** - Utility-first CSS framework 
- **Radix UI** - Accessible, unstyled UI components 
- **Lucide React** - Icon library 
- **react-hook-form + zod** - Form validation and management

### Backend
- **Django 4.2** - Web framework and ORM [8]
- **Django REST Framework 3.16** - RESTful API endpoints and serialization
- **Simple JWT** - JWT token generation and validation 
- **SQLite** (Development) / **PostgreSQL** (Production) 
- **Python 3.12** - Backend runtime 

## 📋 Prerequisites

- **Node.js** (v20+) - https://nodejs.org/ 
- **Python 3.12** 
- **npm** (comes with Node) or **pnpm**
- **pip** and **virtualenv** (recommended for Python) 

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/maayaankmehta/studysphere.git
cd studysphere
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Run the Next.js frontend dev server
npm run dev
```
Frontend will be available at **http://localhost:3000** 

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Environment Configuration
Copy `.env.example` to `.env` and configure: 
```env
DATABASE_URL=sqlite:///db.sqlite3
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Database Setup
```bash
# Run migrations
python manage.py migrate

# (Optional) Seed database with sample data
python manage.py seed
```
Seed creates test accounts: 
- Admin: `admin` / `admin123`
- User: `razancodes` / `password123`

### 6. Start Backend Server
```bash
python manage.py runserver
```
Backend will be available at **http://localhost:8000** 

## 🎮 XP & Leveling System

XP is automatically awarded for platform engagement:  

| Action | XP Award |
|--------|----------|
| Create session | +50 XP |
| RSVP to session | +10 XP |
| Create group | +30 XP |
| Join group | +25 XP |

Level progression: [19](#0-18) 
- Level 1: 0-499 XP
- Level 2: 500-999 XP
- Level 3: 1000-1499 XP
- Level 4: 1500-1999 XP
- Level 5+: 2000+ XP (every additional 1000 XP = +1 level)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile  

### Study Sessions
- `GET /api/sessions/` - List sessions
- `POST /api/sessions/` - Create session
- `GET /api/sessions/{id}/` - Session details
- `PUT /api/sessions/{id}/` - Update session (host only)
- `DELETE /api/sessions/{id}/` - Delete session (host only)
- `POST /api/sessions/{id}/rsvp/` - RSVP to session
- `DELETE /api/sessions/{id}/cancel_rsvp/` - Cancel RSVP 

### Study Groups
- `GET /api/groups/` - List approved groups
- `POST /api/groups/` - Create group (pending approval)
- `GET /api/groups/{id}/` - Group details
- `PUT /api/groups/{id}/` - Update group (creator only)
- `DELETE /api/groups/{id}/` - Delete group (creator only)
- `POST /api/groups/{id}/join/` - Join group
- `DELETE /api/groups/{id}/leave/` - Leave group 

### Dashboard & Leaderboard
- `GET /api/dashboard/` - User dashboard data
- `GET /api/leaderboard/?period=week` - Weekly leaderboard
- `GET /api/leaderboard/?period=all` - All-time leaderboard  

### Admin (Staff Only)
- `GET /api/admin/groups/` - View all group requests
- `PATCH /api/admin/groups/{id}/approve/` - Approve group
- `PATCH /api/admin/groups/{id}/reject/` - Reject group 

## 🗄 Database Models

Core models include: 
- **User** - Extended Django user with XP, level, and profile metadata
- **StudyGroup** - name, description, creator, approval status
- **StudySession** - host, time, location, topic, capacity
- **SessionRSVP** - RSVPs to sessions
- **GroupMembership** - group members and roles
- **Badge** - Achievements awarded to users

## 🏗 Project Structure

```
studysphere/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and API clients
├── public/                 # Static assets
└── backend/                # Django backend
    ├── api/                # Main API app
    ├── authentication/     # Auth app
    └── studysphere/        # Project settings
```

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
```

### Backend
```bash
python manage.py runserver      # Start development server
python manage.py shell          # Django shell
python manage.py dbshell        # Database shell
python manage.py check          # Validate configuration
python manage.py showmigrations # View migration status
```

## 🚀 Production Deployment

1. Set `DEBUG=False` and secure `SECRET_KEY` 
2. Use PostgreSQL (update `DATABASE_URL`) 
3. Set `ALLOWED_HOSTS` for production domains 
4. Run `python manage.py collectstatic` 
5. Use Gunicorn WSGI server  
6. Configure Nginx for static files and proxy 
7. Set up HTTPS (Let's Encrypt)  

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Commit changes with clear messages
4. Open a Pull Request describing the changes

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file. 
## Developed By:
 - Muhammed Razan [@razancodes](https://github.com/razancodes)
 - Mayank Mehta [@maayaankmehta](https://github.com/maayaankmehta)
 - Mohammed Talib 
 - Muzammil Zahoor 
- **Email**: studysphere@outlook.com 

---
