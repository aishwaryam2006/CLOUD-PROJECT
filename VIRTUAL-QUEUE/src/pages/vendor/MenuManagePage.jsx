// src/pages/vendor/MenuManagePage.jsx
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const EMOJIS = ['🍱','🍛','🥘','🍜','🍝','🥗','🥪','🍔','🫔','🥙','🥤','☕','🍰','🥐','🍿','🌮','🧆','🍞','🥞','🍣','🥭','🍋','🍉','🧃','🫖'];
const CATEGORIES = ['Food', 'Juice', 'Snacks', 'Coffee', 'Bakery', 'Dessert'];

const EMPTY_FORM = { name: '', desc: '', price: '', category: 'Food', emoji: '🍱' };

export default function MenuManagePage() {
  const { currentUser, menus, addMenuItem, toggleMenuItemAvailability, deleteMenuItem } = useApp();
  const cafeId   = currentUser?.cafeId;
  const menu     = menus[cafeId] || [];

  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [error,    setError]    = useState('');

  function handleChange(e) {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAdd() {
    if (!form.name.trim()) { setError('Item name is required'); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setError('Enter a valid price'); return; }

    addMenuItem(cafeId, { ...form, price: parseFloat(form.price) });
    setForm(EMPTY_FORM);
    setShowForm(false);
    setError('');
  }

  // Group by category for display
  const categories = [...new Set(menu.map(i => i.category))];

  return (
    <>
      <div className="page-header-row">
        <div>
          <h2>Menu Management</h2>
          <p>Add, edit &amp; manage your offerings</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(s => !s); setError(''); }}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Add item form */}
      {showForm && (
        <div className="add-item-form">
          <h3>New Menu Item</h3>
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input name="name" placeholder="e.g. Masala Dosa" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input name="price" type="number" min="1" placeholder="0" value={form.price} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input name="desc" placeholder="Short description..." value={form.desc} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Emoji Icon</label>
              <div className="emoji-picker">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    className={`emoji-btn ${form.emoji === e ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, emoji: e }))}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleAdd}>
            ✅ Add to Menu
          </button>
        </div>
      )}

      {/* Empty state */}
      {menu.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="es-icon">📋</div>
          <p>No items yet. Click <b>+ Add Item</b> to get started!</p>
        </div>
      )}

      {/* Menu items grouped by category */}
      {categories.map(cat => (
        <div key={cat}>
          <div className="section-title">{cat}</div>
          <div className="menu-manage-grid">
            {menu.filter(i => i.category === cat).map(item => (
              <div key={item.id} className="manage-card">
                <div className="manage-card-header">
                  <span style={{ fontSize: 32 }}>{item.emoji}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMenuItem(cafeId, item.id)}>
                    🗑️
                  </button>
                </div>
                <h4>{item.name}</h4>
                <p className="mc-desc">{item.desc || 'No description'}</p>
                <div className="mc-meta">
                  <span style={{ fontWeight: 700, color: 'var(--green-dark)', fontSize: 16 }}>₹{item.price}</span>
                  <span className={`cafe-tag tag-${item.category.toLowerCase()}`}>{item.category}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="avail-toggle" onClick={() => toggleMenuItemAvailability(cafeId, item.id)}>
                    <button className={`toggle-switch ${item.available ? 'on' : 'off'}`} />
                    {item.available ? '✅ In Stock' : '❌ Out of Stock'}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
