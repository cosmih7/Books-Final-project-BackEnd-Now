const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./config');

dotenv.config();

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
