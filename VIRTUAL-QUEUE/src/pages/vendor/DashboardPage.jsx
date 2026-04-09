// src/pages/vendor/DashboardPage.jsx
import { useApp } from '../../context/AppContext';

export default function DashboardPage() {
  const { orders, currentUser, updateOrderStatus } = useApp();

  const myOrders   = orders.filter(o => o.cafeId === currentUser?.cafeId);
  const active     = myOrders.filter(o => o.status !== 'completed');
  const todayTotal = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <div className="page-header-row">
        <div>
          <h2>Dashboard</h2>
          <p>Manage incoming orders in real time</p>
        </div>
        <div className="live-indicator">
          <div className="pulse-dot" /> Live
        </div>
      </div>

      {/* Stats row */}
      <div className="dashboard-stats">
        <div className="dash-stat">
          <div className="ds-val">{active.length}</div>
          <div className="ds-label">Active Orders</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">{myOrders.length}</div>
          <div className="ds-label">Total Today</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">₹{todayTotal}</div>
          <div className="ds-label">Revenue Today</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">{myOrders.filter(o => o.status === 'completed').length}</div>
          <div className="ds-label">Completed</div>
        </div>
      </div>

      {/* Orders table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Student</th>
              <th>Items</th>
              <th>Total</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                  No orders yet — students will appear here when they order!
                </td>
              </tr>
            ) : (
              [...myOrders].reverse().map(o => (
                <tr key={o.id}>
                  <td><b>#{o.token}</b></td>
                  <td>{o.studentName}</td>
                  <td style={{ maxWidth: 220, fontSize: 13 }}>
                    {o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(', ')}
                  </td>
                  <td><b>₹{o.total}</b></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{o.time}</td>
                  <td>
                    <span className={`status-badge status-${o.status}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {o.status === 'ordered' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => updateOrderStatus(o.id, 'preparing')}>
                          ▶ Preparing
                        </button>
                      )}
                      {o.status === 'preparing' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateOrderStatus(o.id, 'ready')}>
                          ✅ Ready
                        </button>
                      )}
                      {o.status === 'ready' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => updateOrderStatus(o.id, 'completed')}>
                          ✓ Done
                        </button>
                      )}
                      {o.status === 'completed' && (
                        <span style={{ color: '#90CAF9', fontSize: 13 }}>✓ Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
