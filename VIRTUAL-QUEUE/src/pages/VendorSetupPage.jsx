// src/pages/VendorSetupPage.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function VendorSetupPage({ onDone }) {
  const { currentUser, setupShop } = useApp();
  const [form, setForm] = useState({
    shopName:  currentUser?.shopName || '',
    shopType:  currentUser?.shopType || 'Food',
    shopDesc:  '',
    upiId:     '',
    openTime:  '08:00',
    closeTime: '18:00',
  });

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.shopName) return alert('Shop name is required');
    const finalUser = setupShop(form);
    onDone(finalUser);
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h2>🏪 Set Up Your Shop</h2>
        <p className="setup-sub">Fill in your details to go live on QueueLess</p>

        <div className="form-group">
          <label>Shop Name *</label>
          <input name="shopName" placeholder="e.g. Campus Tadka" value={form.shopName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Shop Type</label>
          <select name="shopType" value={form.shopType} onChange={handleChange}>
            {['Food','Juice','Snacks','Coffee','Bakery','South Indian','North Indian','Chinese'].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="shopDesc" placeholder="Tell students what's special about your shop..." value={form.shopDesc} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Opens At</label>
            <input name="openTime" type="time" value={form.openTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Closes At</label>
            <input name="closeTime" type="time" value={form.closeTime} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>UPI ID</label>
          <input name="upiId" placeholder="yourshop@upi" value={form.upiId} onChange={handleChange} />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleSubmit}>
          🚀 Launch My Shop
        </button>
      </div>
    </div>
  );
}
