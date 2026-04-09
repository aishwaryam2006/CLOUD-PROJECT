// src/pages/vendor/AnalyticsPage.jsx
import { useApp } from '../../context/AppContext';

export default function AnalyticsPage() {
  const { orders, currentUser, menus } = useApp();

  const myOrders = orders.filter(o => o.cafeId === currentUser?.cafeId);
  const menu     = menus[currentUser?.cafeId] || [];

  // Orders by hour (8 AM → 8 PM = 12 slots)
  const hours = Array(12).fill(0);
  myOrders.forEach(o => {
    const h   = parseInt(o.time?.split(':')[0]) || 8;
    const idx = Math.min(11, Math.max(0, h - 8));
    hours[idx] += 1;
  });
  const maxH = Math.max(...hours, 1);

  // Item count
  const itemCounts = {};
  myOrders.forEach(o =>
    o.items.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
    })
  );
  const topItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const revenue    = myOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder   = myOrders.length ? Math.round(revenue / myOrders.length) : 0;
  const inStock    = menu.filter(i => i.available).length;
  const completed  = myOrders.filter(o => o.status === 'completed').length;

  return (
    <>
      <div className="page-header">
        <h2>Analytics</h2>
        <p>Performance insights for your shop</p>
      </div>

      {/* Summary stats */}
      <div className="analytics-grid">
        <div className="dash-stat">
          <div className="ds-val">{myOrders.length}</div>
          <div className="ds-label">Total Orders</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">₹{revenue}</div>
          <div className="ds-label">Total Revenue</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">₹{avgOrder}</div>
          <div className="ds-label">Avg Order Value</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">{completed}</div>
          <div className="ds-label">Completed</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">{inStock}</div>
          <div className="ds-label">Items In Stock</div>
        </div>
        <div className="dash-stat">
          <div className="ds-val">{menu.length - inStock}</div>
          <div className="ds-label">Out of Stock</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>

        {/* Hourly bar chart */}
        <div className="chart-card">
          <h4>📊 Orders by Hour</h4>
          {myOrders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No orders yet</p>
          ) : (
            <div className="bar-chart-wrap">
              {hours.map((v, i) => (
                <div key={i} className="bar-col">
                  <div
                    className="bar"
                    style={{ height: Math.max(4, (v / maxH) * 100) + 'px' }}
                    title={`${v} orders`}
                  />
                  <div className="bar-label">{8 + i}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top items */}
        <div className="chart-card">
          <h4>🏆 Top Selling Items</h4>
          {topItems.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No sales data yet</p>
          ) : (
            topItems.map(([name, qty], i) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', minWidth: 24 }}>
                  #{i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{name}</div>
                  <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                    <div style={{
                      background: 'var(--green)',
                      height: 6,
                      borderRadius: 4,
                      width: `${(qty / topItems[0][1]) * 100}%`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--green-dark)', fontSize: 14 }}>
                  {qty} sold
                </span>
              </div>
            ))
          )}
        </div>

        {/* Order status breakdown */}
        <div className="chart-card">
          <h4>📋 Order Status Breakdown</h4>
          {['ordered', 'preparing', 'ready', 'completed'].map(s => {
            const count = myOrders.filter(o => o.status === s).length;
            const pct   = myOrders.length ? Math.round((count / myOrders.length) * 100) : 0;
            return (
              <div key={s} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className={`status-badge status-${s}`} style={{ fontSize: 12 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                  <div style={{
                    height: 6, borderRadius: 4,
                    width: pct + '%',
                    background: s === 'completed' ? '#42A5F5' : s === 'ready' ? 'var(--green)' : s === 'preparing' ? 'var(--orange)' : '#9E9E9E',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}
