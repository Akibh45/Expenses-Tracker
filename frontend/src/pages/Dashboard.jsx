import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [catRes, trendRes, budgetRes] = await Promise.all([
          api.get('/analytics/categories'),
          api.get('/analytics/trends?period=monthly'),
          api.get('/analytics/budget-vs-actual')
        ]);
        
        // Format category data
        const formattedCats = catRes.data.data.map(c => ({
          name: c._id,
          value: c.totalAmount
        }));
        setCategories(formattedCats);

        // Format trend data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrends = trendRes.data.data.map(t => ({
          name: monthNames[t._id.month - 1] || 'Unknown',
          amount: t.totalAmount
        }));
        setTrends(formattedTrends);

        // Set budget vs actual
        setBudgets(budgetRes.data.data);

      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="main-content">Loading analytics...</div>;

  const totalSpent = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="main-content">
      <div className="topbar">
        <h1 className="page-title">Overview</h1>
        <div className="user-info">
          <span>Welcome back, <strong>{user?.name?.split(' ')[0]}</strong></span>
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        </div>
      </div>

      <div className="grid-3">
        <div className="glass-panel stat-card">
          <span className="stat-title">Total Spending (YTD)</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>${totalSpent.toLocaleString()}</span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-title">Active Budgets</span>
          <span className="stat-value" style={{ color: 'var(--accent)' }}>{budgets.length}</span>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-title">Alerts</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>
            {budgets.filter(b => b.isExceeded).length}
          </span>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Spending by Category</h3>
          {categories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <p style={{color: 'var(--text-muted)'}}>No expense data available.</p>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Monthly Trends</h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{color: 'var(--text-muted)'}}>No trend data available.</p>
          )}
        </div>
      </div>
      
      {budgets.length > 0 && (
         <div className="glass-panel" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1.5rem' }}>Budget Status</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {budgets.map((b, i) => (
               <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span>{b.category || 'Overall'} Budget</span>
                   <span style={{ color: b.isExceeded ? 'var(--danger)' : 'var(--text-muted)' }}>
                     ${b.actualAmount} / ${b.budgetAmount}
                   </span>
                 </div>
                 <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', 
                        width: `${Math.min((b.actualAmount / b.budgetAmount) * 100, 100)}%`,
                        background: b.isExceeded ? 'var(--danger)' : 'var(--primary)',
                        transition: 'width 0.5s ease-out'
                    }}></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
