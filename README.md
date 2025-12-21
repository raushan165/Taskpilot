# Taskpilot

A clear, advanced task management application built with the MERN stack (MongoDB, Express, React, Node.js). Features include a Kanban board, Smart AI Assistant, Google Login, and Global Dark Mode.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/raushan165/Taskpilot.git
cd Taskpilot
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

**Create a `.env` file in the `backend` folder:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmaster
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
```

**Run the Server:**
```bash
node server.js
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

**Update Google Client ID:**
Open `frontend/src/App.jsx` and replace the `clientId` string with your own if needed.

**Run the Frontend:**
```bash
npm run dev
```

---

## 📦 Extensions & Dependencies

This project uses the following major libraries ("extensions"):

### Frontend (React + Vite)
| Package | Purpose |
| :--- | :--- |
| **react** | UI Framework |
| **react-router-dom** | Client-side Routing |
| **axios** | HTTP Client (API Calls) |
| **tailwindcss** | Utility-first CSS Framework |
| **lucide-react** | Icon Library |
| **date-fns** | Date Formatting & Math |
| **@dnd-kit/core** | Drag and Drop Primitives |
| **@dnd-kit/sortable** | Sortable Lists (Kanban) |
| **@react-oauth/google** | Google Sign-In Components |
| **vite** | Build Tool & Dev Server |

### Backend (Node.js + Express)
| Package | Purpose |
| :--- | :--- |
| **express** | Web Server Framework |
| **mongoose** | MongoDB Object Modeling |
| **jsonwebtoken** | JWT Authentication |
| **bcryptjs** | Password Hashing |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment Variables |
| **nodemailer** | Email Sending (OTP) |
| **google-auth-library** | Google Token Verification |
| **nodemon** | Auto-restart Dev Server |

---

## 🛠️ Features
- **Kanban Board**: Drag and drop tasks between Pending/Completed.
- **Smart Assistant**: Local AI analysis of your tasks.
- **Google Login**: One-click secure authentication.
- **Dark Mode**: System-wide dark theme.
- **Pinning**: Prioritize important tasks.
