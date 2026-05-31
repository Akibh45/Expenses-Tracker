const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get category-wise breakdown
// @route   GET /api/analytics/categories
// @access  Private
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      $match: {
        user: req.user._id, // Assuming req.user._id is already an ObjectId from authMiddleware
      },
    };

    if (startDate || endDate) {
      matchStage.$match.date = {};
      if (startDate) matchStage.$match.date.$gte = new Date(startDate);
      if (endDate) matchStage.$match.date.$lte = new Date(endDate);
    }

    const categoryData = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categoryData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly/weekly spending trends
// @route   GET /api/analytics/trends
// @access  Private
exports.getTrends = async (req, res) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;

    const matchStage = {
      $match: {
        user: req.user._id,
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    };

    let groupBy;
    if (period === 'monthly') {
      groupBy = { month: { $month: '$date' } };
    } else {
      groupBy = { week: { $week: '$date' } };
    }

    const trendsData = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: groupBy,
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: trendsData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get budget vs actual comparison
// @route   GET /api/analytics/budget-vs-actual
// @access  Private
exports.getBudgetVsActual = async (req, res) => {
  try {
    const { date = new Date() } = req.query;
    const targetDate = new Date(date);

    // Find all active budgets for the given date
    const budgets = await Budget.find({
      user: req.user.id,
      startDate: { $lte: targetDate },
      endDate: { $gte: targetDate },
    });

    const budgetComparisons = await Promise.all(
      budgets.map(async (budget) => {
        const query = {
          user: req.user._id,
          date: { $gte: budget.startDate, $lte: budget.endDate },
        };

        if (budget.category) {
          query.category = budget.category;
        }

        const actualSpending = await Expense.aggregate([
          { $match: query },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const actual = actualSpending.length > 0 ? actualSpending[0].total : 0;

        return {
          category: budget.category || 'Overall',
          budgetAmount: budget.amount,
          actualAmount: actual,
          period: budget.period,
          startDate: budget.startDate,
          endDate: budget.endDate,
          isExceeded: actual > budget.amount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetComparisons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
