// src/pages/student/CartModal.jsx

export default function CartModal({ cart, onUpdateQty, onCheckout, onClose }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3>🛒 Your Cart</h3>

        {cart.map(item => (
          <div key={item.id} className="cart-item-row">
            <div className="cart-item-emoji">{item.emoji}</div>
            <div className="cart-item-info">
              <div className="ci-name">{item.name}</div>
              <div className="ci-price">₹{item.price} each</div>
            </div>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>−</button>
              <span className="qty-num">{item.qty}</span>
              <button className="qty-btn" onClick={() => onUpdateQty(item.id, +1)}>+</button>
            </div>
          </div>
        ))}

        <div className="cart-total-row">
          <span>Total</span>
          <span style={{ color: 'var(--green-dark)' }}>₹{total}</span>
        </div>

        <button className="btn btn-primary btn-block" onClick={onCheckout}>
          ✅ Place Order &amp; Get Token
        </button>
      </div>
    </div>
  );
}
