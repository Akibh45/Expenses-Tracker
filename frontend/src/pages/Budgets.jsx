import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2 } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Provide default sensible dates for the form
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({ 
    amount: '', 
    category: '', 
    period: 'monthly',
    startDate: today,
    endDate: nextMonth
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        setBudgets(budgets.filter(b => b._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.category) payload.category = null; // null means overall budget
      
      await api.post('/budgets', payload);
      setShowModal(false);
      fetchBudgets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating budget');
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;

  return (
    <div className="main-content">
      <div className="topbar">
        <h1 className="page-title">Budgets</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Set Budget
        </button>
      </div>

      <div className="grid-3">
        {budgets.map((budget) => (
          <div key={budget._id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--danger)' }}
              onClick={() => handleDelete(budget._id)}
            >
              <Trash2 size={16} />
            </button>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>{budget.category || 'Overall'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
            </p>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${budget.amount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {budget.period}</span>
            </div>
          </div>
        ))}
        {budgets.length === 0 && (
          <div style={{ color: 'var(--text-muted)', gridColumn: 'span 3' }}>No budgets set up yet.</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setShowModal(false) }}>
          <div className="glass-panel modal-content">
            <div className="modal-header">
              <h2>Set New Budget</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} style={{ fontSize: '1.5rem' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Amount Limit ($)</label>
                <input type="number" required className="glass-input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category (Leave empty for Overall Budget)</label>
                <select className="glass-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Overall Budget --</option>
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
                <label>Period</label>
                <select className="glass-input" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" required className="glass-input" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" required className="glass-input" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Budget</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
