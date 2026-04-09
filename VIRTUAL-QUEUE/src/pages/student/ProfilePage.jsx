// src/pages/student/ProfilePage.jsx
import { useApp } from '../../context/AppContext';

export default function ProfilePage() {
  const { currentUser, orders } = useApp();
  const myOrders = orders.filter(o => o.studentId === currentUser?.id);
  const spent    = myOrders.reduce((s, o) => s + o.total, 0);
  const done     = myOrders.filter(o => o.status === 'completed').length;

  return (
    <>
      <div className="page-header">
        <h2>My Profile</h2>
      </div>
      <div className="profile-card">
        <div className="profile-avatar">🎓</div>
        <div className="profile-name">{currentUser?.name}</div>
        <div className="profile-email">{currentUser?.email}</div>
        <div className="profile-info">
          <div className="profile-info-item">
            <div className="pi-label">Roll Number</div>
            <div className="pi-val">{currentUser?.rollNo || '—'}</div>
          </div>
          <div className="profile-info-item">
            <div className="pi-label">Total Orders</div>
            <div className="pi-val">{myOrders.length}</div>
          </div>
          <div className="profile-info-item">
            <div className="pi-label">Amount Spent</div>
            <div className="pi-val">₹{spent}</div>
          </div>
          <div className="profile-info-item">
            <div className="pi-label">Completed</div>
            <div className="pi-val">{done}</div>
          </div>
        </div>
      </div>
    </>
  );
}
