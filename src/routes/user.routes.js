const express = require('express');
const { listUsers } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', auth, listUsers);

module.exports = router;
