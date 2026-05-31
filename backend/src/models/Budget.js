const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      // If category is null/undefined, it applies to the overall budget
      enum: ['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other', null],
      default: null,
    },
    amount: {
      type: Number,
      required: [true, 'Please add a budget amount'],
    },
    period: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: [true, 'Please define a period (weekly, monthly)'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user doesn't have multiple budgets for the same category in the same period
budgetSchema.index({ user: 1, category: 1, startDate: 1, endDate: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
