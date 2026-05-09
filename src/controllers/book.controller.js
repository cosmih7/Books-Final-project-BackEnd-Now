const Book = require('../models/book.model');
const Review = require('../models/review.model');

exports.createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json({ book });
};

exports.listBooks = async (req, res) => {
  const { search, genre, page = 1, limit = 12 } = req.query;
  const filter = {};

  if (genre) {
    filter.genre = genre;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ books });
};

exports.getBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);
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
