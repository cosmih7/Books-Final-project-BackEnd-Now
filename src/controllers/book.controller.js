const Book = require('../models/book.model');
const Review = require('../models/review.model');

exports.createBook = async (req, res) => {
  const book = await Book.create({ ...req.body, user: req.user.id });
  const populatedBook = await Book.findById(book._id).populate('user', 'name email');
  res.status(201).json({ book: populatedBook });
};

exports.listBooks = async (req, res) => {
  const { search, genre, page = 1, limit = 12, user, sortBy } = req.query;
  const filter = {};

  if (genre) {
    filter.genre = genre;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  if (user) {
    filter.user = user;
  }

  let query = Book.find(filter).populate('user', 'name email');

  if (sortBy === 'user') {
    query = query.sort({ user: 1, createdAt: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const books = await query
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ books });
};

exports.getBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate('user', 'name email');
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const reviewAggregate = await Review.aggregate([
    { $match: { book: book._id } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  const stats = reviewAggregate[0] || { averageRating: 0, reviewCount: 0 };

  res.json({ book, stats });
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json({ book });
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  await Review.deleteMany({ book: book._id });
  res.json({ message: 'Book deleted' });
};
