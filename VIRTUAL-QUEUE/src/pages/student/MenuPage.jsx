// src/pages/student/MenuPage.jsx
import { useApp } from '../../context/AppContext';

export default function MenuPage({ cafe, cart, onAdd, onBack }) {
  const { menus } = useApp();
  const items = menus[cafe.id] || [];

  // Map item id → qty in cart
  const cartMap = {};
  cart.forEach(c => { cartMap[c.id] = c.qty; });

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <>
      <div className="menu-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{cafe.emoji} {cafe.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cafe.description}</p>
        </div>
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="es-icon">📋</div>
          <p>Menu not set up yet — check back soon!</p>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat}>
          <div className="section-title">{cat}</div>
          <div className="menu-grid">
            {items.filter(i => i.category === cat).map(item => (
              <div key={item.id} className={`menu-item-card ${!item.available ? 'out-of-stock' : ''}`}>
                <div className="menu-item-img">{item.emoji}</div>
                <div className="menu-item-body">
                  <h4>{item.name}</h4>
                  <p className="desc">{item.desc}</p>
                  <div className="menu-item-footer">
                    <span className="price">₹{item.price}</span>
                    <span className={`avail-badge ${item.available ? 'avail-yes' : 'avail-no'}`}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  {item.available && (
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      style={{ marginTop: 10 }}
                      onClick={() => onAdd(item)}
                    >
                      {cartMap[item.id] ? `In Cart (${cartMap[item.id]}) +` : '+ Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
