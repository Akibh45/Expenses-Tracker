const Expense = require('../models/Expense');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');

// @desc    Export expenses to PDF or CSV
// @route   GET /api/reports/export
// @access  Private
exports.exportReport = async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;

    const query = { user: req.user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    if (format === 'pdf') {
      const doc = new PDFDocument();
      let filename = `Expense_Report_${Date.now()}.pdf`;

      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');

      doc.pipe(res);

      doc.fontSize(20).text('Expense Report', { align: 'center' });
      doc.moveDown();

      expenses.forEach(expense => {
        doc.fontSize(12).text(
          `${expense.date.toISOString().split('T')[0]} - ${expense.category}: ${expense.amount} ${expense.currency}`
        );
        if (expense.description) {
          doc.fontSize(10).text(`  Desc: ${expense.description}`);
        }
        doc.moveDown(0.5);
      });

      doc.end();
    } else if (format === 'csv') {
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'date', title: 'DATE' },
          { id: 'category', title: 'CATEGORY' },
          { id: 'amount', title: 'AMOUNT' },
          { id: 'currency', title: 'CURRENCY' },
          { id: 'description', title: 'DESCRIPTION' },
        ],
      });

      const records = expenses.map(expense => ({
        date: expense.date.toISOString().split('T')[0],
        category: expense.category,
        amount: expense.amount,
        currency: expense.currency,
        description: expense.description || '',
      }));

      const header = csvStringifier.getHeaderString();
      const rows = csvStringifier.stringifyRecords(records);

      let filename = `Expense_Report_${Date.now()}.csv`;
      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      res.setHeader('Content-type', 'text/csv');
      res.send(header + rows);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use pdf or csv.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
