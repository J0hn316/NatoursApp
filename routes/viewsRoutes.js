const express = require('express');
const { getOverview, getTour } = require('../controllers/viewsController');

const router = express.Router();

// Video 180 Extending Our Base Template with Blocks
// Video 181 Setting up project structure
router.get('/', getOverview);

// Video 180 Extending Our Base Template with Blocks
// Video 181 Setting up project structure
// Video 184 Building the Tour Page - part 1
router.get('/tour/:slug', getTour);

module.exports = router;
