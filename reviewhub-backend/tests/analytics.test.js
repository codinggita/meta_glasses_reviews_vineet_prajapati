const request = require('supertest');
const app = require('../app');
const Review = require('../src/models/review.model');

let token;

const seedReviews = async () => {
  await Review.insertMany([
    {
      reviewID: 'RA001',
      name: 'ReviewerA',
      date: new Date('2025-01-10'),
      rating: 5,
      title: 'Excellent',
      review: 'Best product ever',
      is_positive_review: 1,
      helpfulness_score: 9.0,
      helpful_aug: 150,
    },
    {
      reviewID: 'RA002',
      name: 'ReviewerB',
      date: new Date('2025-02-15'),
      rating: 3,
      title: 'Average',
      review: 'Not bad, not great',
      is_positive_review: 0,
      helpfulness_score: 4.0,
      helpful_aug: 50,
    },
    {
      reviewID: 'RA003',
      name: 'ReviewerA',
      date: new Date('2025-03-20'),
      rating: 4,
      title: 'Good',
      review: 'Pretty solid',
      is_positive_review: 1,
      helpfulness_score: 7.5,
      helpful_aug: 200,
      reviewImage: 'https://example.com/img.jpg',
    },
    {
      reviewID: 'RA004',
      name: 'ReviewerC',
      date: new Date('2025-03-25'),
      rating: 1,
      title: 'Terrible',
      review: 'Worst purchase',
      is_positive_review: 0,
      helpfulness_score: 2.0,
      helpful_aug: 10,
    },
    {
      reviewID: 'RA005',
      name: 'ReviewerB',
      date: new Date('2025-04-05'),
      rating: 5,
      title: 'Amazing',
      review: 'Love these glasses',
      is_positive_review: 1,
      helpfulness_score: 8.5,
      helpful_aug: 400,
    },
  ]);
};

beforeAll(async () => {
  const res = await request(app).post('/api/v1/auth/register').send({
    name: 'Analytics Tester',
    email: 'analytics@test.com',
    password: 'securepass123',
  });
  token = res.body.token;
});

beforeEach(async () => {
  await seedReviews();
});

describe('Analytics API', () => {
  describe('GET /api/v1/analytics/overview', () => {
    it('should return overview statistics', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.overview.totalReviews).toBe(5);
      expect(res.body.overview.positiveCount).toBe(3);
      expect(res.body.overview.negativeCount).toBe(2);
      expect(res.body.overview.withImageCount).toBe(1);
    });
  });

  describe('GET /api/v1/analytics/rating-distribution', () => {
    it('should return rating distribution', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/rating-distribution')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.distribution.length).toBe(4);
      expect(res.body.distribution.find((d) => d.rating === 5).count).toBe(2);
    });
  });

  describe('GET /api/v1/analytics/sentiment-trend', () => {
    it('should return sentiment trend by month', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/sentiment-trend')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.trend.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/analytics/top-reviewers', () => {
    it('should return top reviewers ranked by helpful_aug', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/top-reviewers')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.reviewers.length).toBeLessThanOrEqual(10);
      expect(res.body.reviewers[0].name).toBe('ReviewerB');
    });
  });

  describe('GET /api/v1/analytics/helpfulness-distribution', () => {
    it('should return helpfulness score buckets', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/helpfulness-distribution')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.distribution.length).toBe(5);
    });
  });

  describe('GET /api/v1/analytics/monthly-volume', () => {
    it('should return monthly review volume', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/monthly-volume')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.volume.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/analytics/image-vs-no-image', () => {
    it('should return image comparison stats', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/image-vs-no-image')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.comparison.withImage).toBe(1);
      expect(res.body.comparison.withoutImage).toBe(4);
      expect(res.body.comparison.total).toBe(5);
    });
  });

  describe('Authentication', () => {
    it('should reject analytics access without token', async () => {
      const res = await request(app).get('/api/v1/analytics/overview');
      expect(res.status).toBe(401);
    });
  });
});
