# ReviewHub — Meta Ray-Ban Smart Glasses Review Intelligence Platform

> **Tagline:** *"Every Voice. Every Signal. Every Insight."*

A full-stack review intelligence platform analyzing 10,000 Meta Ray-Ban Smart Glasses reviews. Built with Node.js, Express, MongoDB, and React.

---

## Project Structure

```
meta_glasses_reviews_vineet_prajapati/
├── reviewhub-backend/       # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/          # MongoDB connection & env configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── validators/      # Input validation schemas
│   │   ├── utils/           # Shared utilities
│   │   └── scripts/         # Database seeding scripts
│   ├── tests/               # API & integration tests
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   ├── package.json         # Backend dependencies (separate from frontend)
│   └── .env                 # Environment variables
│
├── README.md
└── (frontend/ coming in Phase 2)
```

**Backend and frontend have completely separate `package.json`, `package-lock.json`, and `node_modules` directories.**

---

## Backend Setup

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local instance or MongoDB Atlas)
- npm

### Installation

```bash
cd reviewhub-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/reviewhub` |
| `JWT_SECRET` | Secret key for JWT tokens | *(change in production)* |
| `NODE_ENV` | Environment mode | `development` |

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server starts at `http://localhost:5000`

### Health Check

```bash
curl http://localhost:5000/api/v1/health
```

---

## Development Timeline

| Phase | Duration | Dates | Status |
|---|---|---|---|
| **Phase 1: Backend** | 15 days | May 13 – May 27, 2026 | 🔵 In Progress |
| **Phase 2: Frontend** | 15 days | May 28 – June 11, 2026 | ⏳ Not Started |

### Day 1 — May 13, 2026 ✅

- [x] Dataset analyzed (10,000 Meta Ray-Ban Smart Glasses reviews)
- [x] MongoDB schema designed (reviews + users collections)
- [x] Node.js project initialized with Express, Mongoose, dotenv, cors, bcrypt, jsonwebtoken
- [x] Backend folder structure created (routes, controllers, services, models, middlewares, utils, config)
- [x] Express server configured on port 5000 with health endpoint
- [x] MongoDB connection configured with retry logic
- [x] Environment variables configured (.env + .env.example)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT, bcrypt |
| Frontend | *(Phase 2)* |

---

## License

ISC
