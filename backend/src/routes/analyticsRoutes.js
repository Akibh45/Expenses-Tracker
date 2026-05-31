const express = require('express');
const {
  getCategoryBreakdown,
  getTrends,
  getBudgetVsActual,
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const cache = require('../middlewares/cacheMiddleware');

const router = express.Router();

router.use(protect);
// apply cache middleware for all analytics routes
router.use(cache);

router.get('/categories', getCategoryBreakdown);
router.get('/trends', getTrends);
router.get('/budget-vs-actual', getBudgetVsActual);

module.exports = router;
