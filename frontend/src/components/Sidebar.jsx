import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Target, FileDown, LogOut, Wallet } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/expenses', label: 'Expenses', icon: <Receipt size={20} /> },
    { path: '/budgets', label: 'Budgets', icon: <Target size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileDown size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="brand">
        <Wallet color="var(--primary)" size={28} />
        Expenso
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>

      <button className="nav-item logout-btn" onClick={logout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
