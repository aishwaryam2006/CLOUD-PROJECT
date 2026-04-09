// src/pages/student/QueuePage.jsx
import { useState, useEffect } from 'react';
import QRCode from '../../components/QRCode';

const STATUSES = ['ordered', 'preparing', 'ready', 'completed'];
const STATUS_LABELS = { ordered: 'Ordered', preparing: 'Preparing', ready: 'Ready', completed: 'Done' };

export default function QueuePage({ order, onBack }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <div>
        <div className="page-header">
          <h2>Queue</h2>
          <p>No active order selected</p>
        </div>
        <div className="empty-state">
          <div className="es-icon">🎟️</div>
          <p>Place an order to join the queue!</p>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>← Back to Orders</button>
      </div>
    );
  }

  const statusIdx  = STATUSES.indexOf(order.status);
  const aheadCount = Math.max(0, (order.token - 100 - 1) - Math.floor(elapsed / 30));
  const waitMins   = Math.max(0, aheadCount * 3);
  const progressPct = Math.min(100, (statusIdx / 3) * 100);

  return (
    <div className="queue-page">
      <div className="live-indicator" style={{ marginBottom: 18 }}>
        <div className="pulse-dot" /> Live Queue Update
      </div>

      {/* Token card */}
      <div className="token-card">
        <div className="token-label">Your Token</div>
        <div className="token-number">#{order.token}</div>
        <div className="token-shop">{order.cafeName}</div>
        <span className={`status-badge status-${order.status}`} style={{ fontSize: 14, padding: '6px 18px' }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Status steps */}
      <div className="status-steps">
        {STATUSES.map((s, i) => (
          <div key={s} className="status-step">
            <div className="step-wrapper">
              <div className={`step-dot ${i < statusIdx ? 'done' : i === statusIdx ? 'active' : 'pending'}`}>
                {i < statusIdx ? '✓' : i + 1}
              </div>
              <div className="step-label">{STATUS_LABELS[s]}</div>
            </div>
            {i < 3 && <div className={`step-line ${i < statusIdx ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 6 }}>
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Stats */}
      <div className="queue-stats">
        <div className="queue-stat">
          <div className="qs-val">{aheadCount}</div>
          <div className="qs-label">People Ahead</div>
        </div>
        <div className="queue-stat">
          <div className="qs-val">{waitMins}</div>
          <div className="qs-label">Est. Wait (min)</div>
        </div>
        <div className="queue-stat">
          <div className="qs-val">₹{order.total}</div>
          <div className="qs-label">Order Total</div>
        </div>
      </div>

      {/* QR code shown when ready */}
      {order.status === 'ready' && (
        <div className="qr-container">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--green-dark)' }}>
            🎉 Order Ready! Show this QR to collect
          </div>
          <QRCode value={order.id} />
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
            Order ID: {order.id.slice(-8).toUpperCase()}
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="order-summary-mini">
        <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Order Summary</div>
        {order.items.map(item => (
          <div key={item.id} className="osm-row">
            <span>{item.emoji} {item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="osm-total">
          <span>Total</span>
          <span style={{ color: 'var(--green-dark)' }}>₹{order.total}</span>
        </div>
      </div>

      <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={onBack}>
        ← All Orders
      </button>
    </div>
  );
}
