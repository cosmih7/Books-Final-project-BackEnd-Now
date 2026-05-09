const express = require('express');
const { createReview, listReviews, updateReview, deleteReview } = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', listReviews);
router.post('/', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;
