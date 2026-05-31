import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '', date: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(e => e._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setShowModal(false);
      setFormData({ amount: '', category: 'Food', description: '', date: '' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;

  return (
    <div className="main-content">
      <div className="topbar">
        <h1 className="page-title">Expenses</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td><span className={`badge ${expense.category}`}>{expense.category}</span></td>
                <td>{expense.description || '-'}</td>
                <td style={{ fontWeight: 600 }}>${expense.amount}</td>
                <td>
                  <button className="btn-outline" style={{ border: 'none', color: 'var(--danger)', padding: '4px 8px' }} onClick={() => handleDelete(expense._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setShowModal(false) }}>
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>Add New Expense</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} style={{ fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" required className="glass-input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="glass-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date (Optional, defaults to today)</label>
                <input type="date" className="glass-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" className="glass-input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
