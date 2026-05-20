const mongoose = require('mongoose');

beforeAll(async () => {
  const uri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/reviewhub_test';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
