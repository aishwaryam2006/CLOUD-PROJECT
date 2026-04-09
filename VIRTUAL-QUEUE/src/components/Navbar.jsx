// src/components/Navbar.jsx
import { useApp } from '../context/AppContext';

export default function Navbar({ tab, setTab, role }) {
  const { currentUser, logout, orders } = useApp();

  const studentOrders = orders.filter(o => o.studentId === currentUser?.id && o.status !== 'completed');

  if (role === 'student') {
    return (
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => setTab('home')}>
          <span className="logo-icon">🍽️</span>
          <div>
            <span className="logo-text">QueueLess</span>
            <span className="logo-sub">Smart Campus Ordering</span>
          </div>
        </div>
        <div className="navbar-nav">
          <button className={`nav-btn ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
            🏠 <span>Home</span>
          </button>
          <button className={`nav-btn ${tab === 'orders' || tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            📦 <span>Orders</span>
            {studentOrders.length > 0 && <span className="nav-badge">{studentOrders.length}</span>}
          </button>
          <button className={`nav-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            👤 <span>Profile</span>
          </button>
          <button className="nav-btn logout" onClick={logout}>Logout</button>
        </div>
      </nav>
    );
  }

  // Vendor navbar
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">🏪</span>
        <div>
          <span className="logo-text">{currentUser?.shopName || 'My Shop'}</span>
          <span className="logo-sub">Vendor Dashboard</span>
        </div>
      </div>
      <div className="navbar-nav">
        <button className={`nav-btn ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
          📊 <span>Dashboard</span>
        </button>
        <button className={`nav-btn ${tab === 'menu' ? 'active' : ''}`} onClick={() => setTab('menu')}>
          📋 <span>Menu</span>
        </button>
        <button className={`nav-btn ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>
          📈 <span>Analytics</span>
        </button>
        <button className="nav-btn logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
