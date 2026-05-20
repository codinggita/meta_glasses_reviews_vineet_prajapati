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

## Database Schema

### Reviews Collection

The `Review` schema stores all 15 fields from the dataset plus timestamps and soft-delete support:

| Field | Type | Constraints |
|---|---|---|
| `reviewID` | String | Required, indexed |
| `name` | String | Required, indexed |
| `date` | Date | Required, indexed — parsed from "March 9, 2025" |
| `verifiedPurchase` | Boolean | Cast from "True"/"False" |
| `rating` | Number | Enum: 1, 3, 4, 5 — indexed |
| `helpful` | Number | Parsed from comma-formatted string |
| `title` | String | Full-text indexed with `review` |
| `review` | String | Full-text indexed with `title` |
| `profile` | String | Reviewer profile URL |
| `country` | String | |
| `reviewLink` | String | Original Amazon review URL |
| `reviewImage` | String | Optional image URL |
| `helpful_aug` | Number | Indexed |
| `is_positive_review` | Number | 0 or 1, indexed |
| `helpfulness_score` | Number | 0.0–10.0, indexed |
| `isDeleted` | Boolean | Soft-delete flag, indexed |

Indexes: `rating`, `date`, `is_positive_review`, `helpfulness_score`, `name`, text index on `title` + `review`.

### Users Collection

The `User` schema handles authentication:

| Field | Type | Constraints |
|---|---|---|
| `name` | String | Required, max 100 chars |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, min 8 chars, bcrypt hashed (12 rounds), excluded from queries |
| `role` | String | Enum: `admin`, `analyst` |
| `isActive` | Boolean | Default: true |

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

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Register admin/analyst |
| POST | `/api/v1/auth/login` | No | Login, receive JWT |
| GET | `/api/v1/auth/me` | Yes | Current user profile |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/reviews` | Yes | List reviews (paginated, filterable) |
| GET | `/api/v1/reviews/:id` | Yes | Single review by ID |
| GET | `/api/v1/reviews/search?q=...` | Yes | Full-text search |
| POST | `/api/v1/reviews` | Admin | Create review |
| PUT | `/api/v1/reviews/:id` | Admin | Update review |
| DELETE | `/api/v1/reviews/:id` | Admin | Soft-delete review |

**Query Parameters for GET `/api/v1/reviews`:**

| Param | Type | Description |
|---|---|---|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Records per page (default: 20, max: 100) |
| `rating` | Number | Filter by star rating (1, 3, 4, 5) |
| `is_positive_review` | Number | 0 or 1 |
| `country` | String | Filter by country |
| `name` | String | Filter by reviewer name |
| `startDate` / `endDate` | String | Date range filter |
| `sortBy` | String | Field to sort (date, rating, helpfulness_score, helpful_aug) |
| `order` | String | `asc` / `desc` |
| `hasImage` | Boolean | Filter reviews with/without images |

### Analytics

All analytics endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/analytics/overview` | Total reviews, avg rating, sentiment split, image count |
| GET | `/api/v1/analytics/rating-distribution` | Count per star rating |
| GET | `/api/v1/analytics/sentiment-trend` | Positive/negative trend by month |
| GET | `/api/v1/analytics/top-reviewers` | Top 10 reviewers by helpful_aug |
| GET | `/api/v1/analytics/helpfulness-distribution` | Score buckets (0–2, 2–4, 4–6, 6–8, 8–10) |
| GET | `/api/v1/analytics/monthly-volume` | Review count grouped by month/year |
| GET | `/api/v1/analytics/image-vs-no-image` | Reviews with vs without images |

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
| **Rate Limiting** | express-rate-limit | 100 requests / 15 min per IP |
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

- **Models** define Mongoose schemas with validation and indexes
- **Services** contain business logic (CRUD, auth workflows)
- **Controllers** handle HTTP request/response only — delegate to services
- **Routes** define endpoints and wire middleware chains
- **Middlewares** handle cross-cutting concerns (JWT auth, RBAC, validation, error handling, logging)
- **Validators** provide input validation functions (review data, user registration/login)
- **Utils** provide reusable helpers (pagination, response formatting, filter building)
- **Scripts** contain the dataset seeding pipeline with data transformation

### Middleware Chain

```
Request
  └─ CORS
  └─ Rate Limiter (100 req/15min per IP)
  └─ JSON Body Parser
  └─ Logger (method, URL, IP, timestamp)
  └─ authMiddleware (JWT verify) ← on protected routes
  └─ roleMiddleware (admin check) ← on admin routes
  └─ validateMiddleware ← on create/update routes
  └─ Controller (delegates to Service)
  └─ Global Error Middleware (formats consistent error response)
```

### Aggregation Pipelines

Analytics endpoints use MongoDB aggregation pipelines for real-time data analysis:

- **Overview** — `$group` with `$sum`, `$avg`, `$cond` for total reviews, avg rating, sentiment split, image count
- **Rating Distribution** — `$group` by rating field with `$sort`
- **Sentiment Trend** — `$group` by year/month with `$year`/`$month` date operators
- **Top Reviewers** — `$group` by name, `$sort` by helpful_aug, `$limit` 10
- **Helpfulness Distribution** — Bucket aggregation across 5 score ranges (0–2, 2–4, 4–6, 6–8, 8–10)
- **Monthly Volume** — `$group` by year/month with review count
- **Image vs No Image** — `$cond` comparison of reviewImage field

### Postman Testing

A Postman collection is included at `reviewhub-backend/postman_collection.json` with:

- All endpoints organized by category (Health, Auth, Reviews, Analytics)
- Collection variables for `base_url` and `token`
- Auto-capture of JWT token on login via test script
- Pre-filled request bodies for register, login, and create review
- Example query parameters for paginated and filtered review requests

Import the collection into Postman, set the `base_url` variable, register a user, login to capture the token, then test all endpoints.

### Seeding

```bash
cd reviewhub-backend
npm run seed
```

The seeding script (`src/scripts/seed.js`):
1. Reads the raw 10,000-record JSON dataset
2. Transforms each record (date → ISODate, rating → Float, helpful → Int, verifiedPurchase → Boolean)
3. Clears the existing `reviews` collection
4. Bulk inserts all transformed documents
5. Ensures all indexes are created
6. Prints a sample document for verification

---

## Testing

The backend includes a comprehensive test suite using **Jest** and **Supertest**.

### Running Tests

```bash
cd reviewhub-backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

| Suite | File | Tests |
|---|---|---|
| **Auth** | `tests/auth.test.js` | Register (success, missing fields, short password, duplicate email, default role), Login (success, wrong password, non-existent email, missing fields), Get Me (valid token, no token, invalid token) |
| **Reviews** | `tests/review.test.js` | Create (admin success, analyst forbidden, invalid rating, invalid date, out-of-range score, no auth), List (pagination, rating filter, sentiment filter, name filter, image filter, sort, no auth), Get by ID (success, 404), Update (admin success, analyst forbidden, invalid rating), Delete (admin success, soft delete exclusion, analyst forbidden) |
| **Analytics** | `tests/analytics.test.js` | Overview, Rating Distribution, Sentiment Trend, Top Reviewers, Helpfulness Distribution, Monthly Volume, Image vs No Image, Auth rejection |

### Test Database

Tests use a separate MongoDB database (`reviewhub_test`) that is automatically created and cleaned between test runs. Configure via `TEST_MONGO_URI` environment variable if needed.

---

## License

ISC
