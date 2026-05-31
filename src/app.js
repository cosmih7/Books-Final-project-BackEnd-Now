const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
