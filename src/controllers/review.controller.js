const Review = require('../models/review.model');
const Book = require('../models/book.model');

exports.createReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const review = await Review.create({
    book: book._id,
    user: req.user.id,
    rating,
    comment
  });

  res.status(201).json({ review });
};

exports.listReviews = async (req, res) => {
  const { bookId, userId } = req.query;
  const filter = {};

  if (bookId) filter.book = bookId;
  if (userId) filter.user = userId;

  const reviews = await Review.find(filter)
    .populate('book', 'title author')
    .populate('user', 'name email');

  res.json({ reviews });
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const updates = { rating: req.body.rating, comment: req.body.comment };
  const updated = await Review.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  res.json({ review: updated });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};
