const mongoose = require('mongoose');

beforeAll(async () => {
  const uri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/reviewhub_test';
  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.error('Test DB connection failed:', err.message);
    throw err;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
  } finally {
    await mongoose.connection.close();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
