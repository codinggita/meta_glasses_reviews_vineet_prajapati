const request = require('supertest');
const app = require('../app');
const Review = require('../src/models/review.model');

let adminToken;
let analystToken;

beforeAll(async () => {
  const adminRes = await request(app).post('/api/v1/auth/register').send({
    name: 'Admin',
    email: 'admin@review.test',
    password: 'securepass123',
    role: 'admin',
  });
  adminToken = adminRes.body.token;

  const analystRes = await request(app).post('/api/v1/auth/register').send({
    name: 'Analyst',
    email: 'analyst@review.test',
    password: 'securepass123',
    role: 'analyst',
  });
  analystToken = analystRes.body.token;
});

describe('Review API', () => {
  describe('POST /api/v1/reviews', () => {
    it('should create a review as admin', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewID: 'RTEST001',
          name: 'TestUser',
          date: '2025-03-09',
          rating: 5,
          title: 'Great product',
          review: 'Amazing smart glasses',
          is_positive_review: 1,
          helpfulness_score: 8.5,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.review.reviewID).toBe('RTEST001');
      expect(res.body.review.rating).toBe(5);
    });

    it('should reject review creation as analyst', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${analystToken}`)
        .send({
          reviewID: 'RTEST002',
          name: 'TestUser',
          date: '2025-03-09',
          rating: 4,
          is_positive_review: 1,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject review with invalid rating', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewID: 'RTEST003',
          name: 'TestUser',
          date: '2025-03-09',
          rating: 2,
          is_positive_review: 1,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject review with invalid date', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewID: 'RTEST004',
          name: 'TestUser',
          date: 'not-a-date',
          rating: 4,
          is_positive_review: 1,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject review with helpfulness_score out of range', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          reviewID: 'RTEST005',
          name: 'TestUser',
          date: '2025-03-09',
          rating: 4,
          is_positive_review: 1,
          helpfulness_score: 15,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject without authentication', async () => {
      const res = await request(app).post('/api/v1/reviews').send({
        reviewID: 'RTEST006',
        name: 'TestUser',
        date: '2025-03-09',
        rating: 4,
        is_positive_review: 1,
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/reviews', () => {
    beforeEach(async () => {
      await Review.insertMany([
        {
          reviewID: 'R001',
          name: 'UserA',
          date: new Date('2025-01-15'),
          rating: 5,
          title: 'Excellent',
          review: 'Best glasses ever',
          is_positive_review: 1,
          helpfulness_score: 9.0,
        },
        {
          reviewID: 'R002',
          name: 'UserB',
          date: new Date('2025-02-20'),
          rating: 3,
          title: 'Average',
          review: 'Decent but not great',
          is_positive_review: 0,
          helpfulness_score: 4.5,
        },
        {
          reviewID: 'R003',
          name: 'UserA',
          date: new Date('2025-03-10'),
          rating: 4,
          title: 'Good',
          review: 'Pretty solid product',
          is_positive_review: 1,
          helpfulness_score: 7.2,
          reviewImage: 'https://example.com/img.jpg',
        },
      ]);
    });

    it('should return paginated reviews', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?page=1&limit=2')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.reviews.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });

    it('should filter by rating', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?rating=5')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews.length).toBe(1);
      expect(res.body.reviews[0].rating).toBe(5);
    });

    it('should filter by is_positive_review', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?is_positive_review=0')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews.length).toBe(1);
    });

    it('should filter by reviewer name', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?name=UserA')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews.length).toBe(2);
    });

    it('should filter by hasImage', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?hasImage=true')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews.length).toBe(1);
    });

    it('should sort by rating descending', async () => {
      const res = await request(app)
        .get('/api/v1/reviews?sortBy=rating&order=desc')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews[0].rating).toBeGreaterThanOrEqual(
        res.body.reviews[1].rating
      );
    });

    it('should reject without authentication', async () => {
      const res = await request(app).get('/api/v1/reviews');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/reviews/:id', () => {
    let reviewId;

    beforeEach(async () => {
      const review = await Review.create({
        reviewID: 'RSINGLE',
        name: 'SingleUser',
        date: new Date('2025-04-01'),
        rating: 4,
        title: 'Single Review',
        review: 'This is a single review',
        is_positive_review: 1,
        helpfulness_score: 6.0,
      });
      reviewId = review._id.toString();
    });

    it('should return a single review by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.review.reviewID).toBe('RSINGLE');
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .get('/api/v1/reviews/000000000000000000000000')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/reviews/:id', () => {
    let reviewId;

    beforeEach(async () => {
      const review = await Review.create({
        reviewID: 'RUPDATE',
        name: 'UpdateUser',
        date: new Date('2025-05-01'),
        rating: 3,
        title: 'Original Title',
        review: 'Original review',
        is_positive_review: 0,
        helpfulness_score: 5.0,
      });
      reviewId = review._id.toString();
    });

    it('should update a review as admin', async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rating: 5, title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.review.rating).toBe(5);
      expect(res.body.review.title).toBe('Updated Title');
    });

    it('should reject update as analyst', async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${analystToken}`)
        .send({ rating: 5 });

      expect(res.status).toBe(403);
    });

    it('should reject update with invalid rating', async () => {
      const res = await request(app)
        .put(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rating: 2 });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/reviews/:id', () => {
    let reviewId;

    beforeEach(async () => {
      const review = await Review.create({
        reviewID: 'RDELETE',
        name: 'DeleteUser',
        date: new Date('2025-06-01'),
        rating: 4,
        title: 'To Be Deleted',
        review: 'This review will be soft deleted',
        is_positive_review: 1,
        helpfulness_score: 7.0,
      });
      reviewId = review._id.toString();
    });

    it('should soft delete a review as admin', async () => {
      const res = await request(app)
        .delete(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Review.findById(reviewId);
      expect(deleted.isDeleted).toBe(true);
    });

    it('should exclude soft-deleted reviews from list', async () => {
      await request(app)
        .delete(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const res = await request(app)
        .get('/api/v1/reviews')
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.reviews.length).toBe(0);
    });

    it('should reject delete as analyst', async () => {
      const res = await request(app)
        .delete(`/api/v1/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${analystToken}`);

      expect(res.status).toBe(403);
    });
  });
});
