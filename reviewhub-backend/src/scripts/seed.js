const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Review = require('../models/review.model');

const transformReview = (raw) => ({
  reviewID: raw.reviewID,
  name: raw.name,
  date: new Date(raw.date),
  verifiedPurchase: raw.verifiedPurchase === 'True',
  rating: parseFloat(raw.rating),
  helpful: parseInt(String(raw.helpful).replace(/,/g, ''), 10) || 0,
  title: raw.title || '',
  review: raw.review || '',
  profile: raw.profile || '',
  country: raw.country || 'United States',
  reviewLink: raw.reviewLink || '',
  reviewImage: raw.reviewImage || '',
  helpful_aug: parseInt(raw.helpful_aug, 10) || 0,
  is_positive_review: parseInt(raw.is_positive_review, 10),
  helpfulness_score: parseFloat(raw.helpfulness_score) || 0.0,
});

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/reviewhub';

  try {
    await mongoose.connect(uri);
    console.log('[SEED] Connected to MongoDB');

    const dataPath = path.join(__dirname, '..', '..', '..', '..', 'Meta-Glasses-Reviews.json');
    const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const records = Array.isArray(raw) ? raw : raw.data || raw.records || [];

    console.log(`[SEED] Read ${records.length} records from dataset`);

    await Review.deleteMany({});
    console.log('[SEED] Cleared existing reviews collection');

    const transformed = records.map(transformReview);
    const result = await Review.insertMany(transformed, { ordered: false });

    console.log(`[SEED] Successfully inserted ${result.length} review documents`);

    const indexes = await Review.createIndexes();
    console.log(`[SEED] Indexes ensured: ${Object.keys(indexes).length}`);

    const sample = await Review.findOne().lean();
    console.log('[SEED] Sample document:', JSON.stringify(sample, null, 2));

    console.log('[SEED] Seeding complete!');
  } catch (err) {
    console.error('[SEED] Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('[SEED] MongoDB connection closed');
  }
};

seed();
