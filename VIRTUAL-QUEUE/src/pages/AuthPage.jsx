// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthPage({ role, onBack, onSuccess }) {
  const { login, register, showToast } = useApp();
  const [formMode, setFormMode] = useState('login'); // 'login' | 'register'
  const [error,    setError]    = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', rollNo: '', shopName: '', shopType: 'Food',
  });

  const isVendor   = role === 'vendor';
  const isRegister = formMode === 'register';

  function handleChange(e) {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    if (isRegister && !form.name)      { setError('Name is required'); return; }

    if (isRegister) {
      const result = register(form, role);
      if (result.error) { setError(result.error); return; }
      showToast('🎉 Welcome!', `Account created, ${form.name}!`);
      onSuccess(result.user);
    } else {
      const result = login(form.email, form.password);
      if (result.error) { setError(result.error); return; }
      showToast('👋 Welcome back!', `Hello, ${result.user.name}!`);
      onSuccess(result.user);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12, color: '#757575', fontSize: 14 }}
        >
          ← Back
        </button>

        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="auth-sub">
          {isVendor ? 'Vendor Portal 👨‍🍳' : 'Student Portal 🎓'} &mdash;{' '}
          {isRegister ? 'Join QueueLess' : 'Sign in to continue'}
        </p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {isRegister && (
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
          </div>
        )}

        <div className="form-group">
          <label>College Email</label>
          <input name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        </div>

        {isRegister && !isVendor && (
          <div className="form-group">
            <label>Roll Number</label>
            <input name="rollNo" placeholder="e.g. 20CS001" value={form.rollNo} onChange={handleChange} />
          </div>
        )}

        {isRegister && isVendor && (
          <>
            <div className="form-group">
              <label>Shop Name</label>
              <input name="shopName" placeholder="e.g. Campus Tadka" value={form.shopName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Shop Type</label>
              <select name="shopType" value={form.shopType} onChange={handleChange}>
                {['Food', 'Juice', 'Snacks', 'Coffee', 'Bakery', 'South Indian', 'North Indian', 'Chinese'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <button className="btn btn-primary btn-block" onClick={handleSubmit} style={{ marginTop: 8 }}>
          {isRegister ? 'Create Account →' : 'Sign In →'}
        </button>

        <div className="toggle-auth">
          {isRegister ? 'Already have an account?' : 'New to QueueLess?'}{' '}
          <button onClick={() => { setFormMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}>
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        {!isRegister && (
          <div className="demo-hint">
            💡 Demo &nbsp;|&nbsp;
            Student: <b>arjun@college.edu</b> / 1234 &nbsp;|&nbsp;
            Vendor: <b>rajan@college.edu</b> / 1234
          </div>
        )}
      </div>
    </div>
  );
}
