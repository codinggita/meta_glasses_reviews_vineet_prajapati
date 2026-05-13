# ReviewHub — Meta Ray-Ban Smart Glasses Review Intelligence Platform

> **Tagline:** *"Every Voice. Every Signal. Every Insight."*

A full-stack review intelligence platform that ingests, analyzes, and visualizes 10,000+ Amazon reviews for Meta Ray-Ban Smart Glasses. The backend provides RESTful APIs for CRUD operations, advanced filtering, pagination, analytics aggregation, and JWT-authenticated admin access. The frontend (Phase 2) will surface these insights through interactive dashboards.

---

## Project Overview

ReviewHub transforms raw customer feedback into structured intelligence:

| Capability | Description |
|---|---|
| **Review Ingestion** | Parse and transform 10,000 raw JSON records into a normalized MongoDB collection |
| **Search & Filter** | Full-text search across review titles and bodies with multi-field filtering |
| **Analytics** | Aggregated ratings distribution, sentiment trends, helpfulness scoring |
| **Authentication** | JWT-based admin and analyst login with role-based access control |
| **Dashboard** | *(Phase 2)* React-based admin panel and insights studio |

---

## Dataset Summary

The dataset contains **10,000 Amazon reviews** for Meta Ray-Ban Smart Glasses across **35 unique reviewer profiles**.

| Attribute | Details |
|---|---|
| **Total Records** | 10,000 |
| **Unique Reviewers** | 35 |
| **Rating Distribution** | 1★ (294), 3★ (1,423), 4★ (3,380), 5★ (4,903) |
| **Sentiment Split** | 82.8% Positive · 17.2% Negative |
| **Reviews with Images** | 1,158 of 10,000 |
| **Key Fields** | reviewID, name, date, rating, helpful, title, review, helpfulness_score, is_positive_review |

The dataset contains intentional duplicates of 35 base reviews with varied helpfulness scores — simulating real-world review score drift over time.

---

## Project Structure

```
meta_glasses_reviews_vineet_prajapati/
├── reviewhub-backend/       # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/          # MongoDB connection & env configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas (reviews, users)
│   │   ├── routes/          # API route definitions (auth, reviews, analytics, health)
│   │   ├── services/        # Business logic layer
│   │   ├── middlewares/     # Auth (JWT), RBAC, validation, error handling, logging
│   │   ├── validators/      # Input validation schemas
│   │   ├── utils/           # Shared utilities (API response, pagination, filter builder)
│   │   └── scripts/         # Database seeding script
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

Expected response:
```json
{
  "success": true,
  "message": "ReviewHub API is running",
  "timestamp": "2026-05-13T12:00:00.000Z",
  "uptime": 42.5
}
```

---

## API Endpoints (Planned)

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register admin/analyst |
| POST | `/api/v1/auth/login` | No | Login, receive JWT |
| GET | `/api/v1/auth/me` | Yes | Current user profile |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/reviews` | No | List reviews (paginated, filterable) |
| GET | `/api/v1/reviews/:id` | No | Single review by ID |
| POST | `/api/v1/reviews` | Admin | Create review |
| PUT | `/api/v1/reviews/:id` | Admin | Update review |
| DELETE | `/api/v1/reviews/:id` | Admin | Soft-delete review |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/analytics/overview` | Yes | Aggregate KPIs (total reviews, avg rating, sentiment %) |
| GET | `/api/v1/analytics/ratings` | Yes | Rating distribution breakdown |
| GET | `/api/v1/analytics/trends` | Yes | Review trends over time |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health` | No | Server health status |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js | JavaScript runtime |
| **Framework** | Express.js | HTTP server and routing |
| **Database** | MongoDB | NoSQL document store |
| **ODM** | Mongoose | Schema modeling and validation |
| **Authentication** | JWT + bcrypt | Token-based auth with password hashing |
| **Utilities** | dotenv, cors | Environment config, cross-origin support |

---

## Architecture

```
Client (React)
     │
     ▼
  Express Server (port 5000)
     │
     ├── Middleware Layer (auth, validation, error handling, logging)
     │
     ├── Routes → Controllers → Services → Models → MongoDB
     │
     └── /api/v1/health (public)
```

The backend follows an **MVC-inspired layered architecture**:

- **Controllers** handle HTTP request/response only
- **Services** contain business logic
- **Models** define Mongoose schemas with validation
- **Middlewares** handle cross-cutting concerns (auth, validation, errors)
- **Utils** provide reusable helpers (pagination, response formatting, filter building)

---

## License

ISC
