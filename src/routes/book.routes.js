const express = require('express');
const { createBook, listBooks, getBook, updateBook, deleteBook } = require('../controllers/book.controller');
const auth = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', listBooks);
router.get('/:id', getBook);
router.post('/', auth, authorize('admin'), createBook);
router.put('/:id', auth, authorize('admin'), updateBook);
router.delete('/:id', auth, authorize('admin'), deleteBook);

module.exports = router;
