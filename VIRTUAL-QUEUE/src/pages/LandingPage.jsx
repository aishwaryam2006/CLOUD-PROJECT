// src/pages/LandingPage.jsx
export default function LandingPage({ onRole }) {
  return (
    <div className="landing-hero">
      <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
      <h1>
        Skip the Queue,<br />
        <span>Order Smart</span>
      </h1>
      <p>
        QueueLess connects your campus cafeterias, lets you order ahead,
        and tracks your food in real time.
      </p>
      <div className="live-indicator" style={{ marginBottom: 28 }}>
        <div className="pulse-dot" />
        Live across campus
      </div>
      <div className="landing-cards">
        <div className="role-card" onClick={() => onRole('student')}>
          <div className="role-icon">🎓</div>
          <h3>I'm a Student</h3>
          <p>Browse cafeterias, order food, track your queue live</p>
        </div>
        <div className="role-card" onClick={() => onRole('vendor')}>
          <div className="role-icon">👨‍🍳</div>
          <h3>I'm a Vendor</h3>
          <p>Manage your shop, menu &amp; incoming orders</p>
        </div>
      </div>
    </div>
  );
}
