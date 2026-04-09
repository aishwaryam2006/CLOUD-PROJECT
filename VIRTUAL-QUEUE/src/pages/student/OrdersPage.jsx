// src/pages/student/OrdersPage.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function OrdersPage({ onTrack }) {
  const { orders, currentUser } = useApp();
  const [tab, setTab] = useState('active');

  const myOrders  = orders.filter(o => o.studentId === currentUser?.id);
  const active    = myOrders.filter(o => o.status !== 'completed');
  const history   = myOrders.filter(o => o.status === 'completed');
  const displayed = tab === 'active' ? active : history;

  return (
    <>
      <div className="page-header">
        <h2>My Orders</h2>
        <p>Track your current and past orders</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'active'  ? 'active' : ''}`} onClick={() => setTab('active')}>
          Active ({active.length})
        </button>
        <button className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          History ({history.length})
        </button>
      </div>

      <div className="orders-list">
        {displayed.length === 0 ? (
          <div className="empty-state">
            <div className="es-icon">📦</div>
            <p>No {tab === 'active' ? 'active' : 'past'} orders yet</p>
          </div>
        ) : (
          [...displayed].reverse().map(o => (
            <div key={o.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div className="order-shop">{o.cafeName}</div>
                  <div className="order-token">Token #{o.token} · {o.time} · {o.date}</div>
                </div>
                <span className={`status-badge status-${o.status}`}>
                  {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                </span>
              </div>
              <div className="order-items-list">
                {o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}
              </div>
              <div className="order-footer">
                <span className="order-total">₹{o.total}</span>
                {o.status !== 'completed' && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onTrack(o)}>
                    Track Queue →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
