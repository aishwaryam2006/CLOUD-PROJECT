// src/App.jsx
import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Toast          from './components/Toast';
import Navbar         from './components/Navbar';
import LandingPage    from './pages/LandingPage';
import AuthPage       from './pages/AuthPage';
import VendorSetupPage from './pages/VendorSetupPage';

// Student pages
import CafeteriaList  from './pages/student/CafeteriaList';
import MenuPage       from './pages/student/MenuPage';
import CartModal      from './pages/student/CartModal';
import QueuePage      from './pages/student/QueuePage';
import OrdersPage     from './pages/student/OrdersPage';
import ProfilePage    from './pages/student/ProfilePage';

// Vendor pages
import DashboardPage  from './pages/vendor/DashboardPage';
import MenuManagePage from './pages/vendor/MenuManagePage';
import AnalyticsPage  from './pages/vendor/AnalyticsPage';

// ─── Root wraps everything in context ─────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Toast />
      <Router />
    </AppProvider>
  );
}

// ─── Router decides which screen to show ──────────────────────────────────────
function Router() {
  const { currentUser, logout } = useApp();

  // screen: 'landing' | 'auth-student' | 'auth-vendor' | 'vendor-setup' | 'student' | 'vendor'
  const [screen, setScreen] = useState('landing');

  function handleAuthSuccess(user) {
    if (user.role === 'vendor') {
      // New vendor with no shop yet → setup; existing vendor → dashboard
      setScreen(user.shopName && user.cafeId ? 'vendor' : 'vendor-setup');
    } else {
      setScreen('student');
    }
  }

  function handleSetupDone() {
    setScreen('vendor');
  }

  // ── Screens ────────────────────────────────────────────────────────────────
  if (screen === 'landing')      return <LandingPage onRole={role => setScreen(`auth-${role}`)} />;
  if (screen === 'auth-student') return <AuthPage role="student" onBack={() => setScreen('landing')} onSuccess={handleAuthSuccess} />;
  if (screen === 'auth-vendor')  return <AuthPage role="vendor"  onBack={() => setScreen('landing')} onSuccess={handleAuthSuccess} />;
  if (screen === 'vendor-setup') return <VendorSetupPage onDone={handleSetupDone} />;
  if (screen === 'student')      return <StudentApp />;
  if (screen === 'vendor')       return <VendorApp />;

  return null;
}

// ─── Student App ───────────────────────────────────────────────────────────────
function StudentApp() {
  const { placeOrder } = useApp();

  const [tab,          setTab]        = useState('home');   // home | orders | queue | profile
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [cart,         setCart]       = useState([]);
  const [cartCafeId,   setCartCafeId] = useState(null);
  const [showCart,     setShowCart]   = useState(false);
  const [activeOrder,  setActiveOrder] = useState(null);    // order being tracked in queue

  // ── Cart helpers ──────────────────────────────────────────────────────────
  function addToCart(item, cafeId) {
    if (cartCafeId && cartCafeId !== cafeId) {
      alert('You can only order from one cafeteria at a time.\nClear your cart first.');
      return;
    }
    setCartCafeId(cafeId);
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function updateQty(id, delta) {
    setCart(prev => {
      const updated = prev
        .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter(c => c.qty > 0);
      if (updated.length === 0) setCartCafeId(null);
      return updated;
    });
  }

  function checkout() {
    const cafe  = { id: cartCafeId }; // cafeId is enough for placeOrder
    // We need cafeName — look it up from cart context
    const order = placeOrder(cartCafeId, cart, cartCafeName);
    setActiveOrder(order);
    setCart([]);
    setCartCafeId(null);
    setShowCart(false);
    setSelectedCafe(null);
    setTab('queue');
  }

  // Derive cafe name from selectedCafe (it's set when user browses a menu)
  const cartCafeName = selectedCafe?.name || 'Cafeteria';

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // ── Tab navigation ────────────────────────────────────────────────────────
  function handleSetTab(t) {
    setTab(t);
    if (t !== 'home') setSelectedCafe(null);
  }

  return (
    <>
      <Navbar tab={tab} setTab={handleSetTab} role="student" />

      <div className="page">
        <div className="container">

          {/* HOME — cafeteria list or menu */}
          {tab === 'home' && !selectedCafe && (
            <CafeteriaList onSelect={cafe => setSelectedCafe(cafe)} />
          )}
          {tab === 'home' && selectedCafe && (
            <MenuPage
              cafe={selectedCafe}
              cart={cart}
              onAdd={item => addToCart(item, selectedCafe.id)}
              onBack={() => setSelectedCafe(null)}
            />
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <OrdersPage
              onTrack={order => { setActiveOrder(order); setTab('queue'); }}
            />
          )}

          {/* QUEUE */}
          {tab === 'queue' && (
            <QueuePage
              order={activeOrder}
              onBack={() => setTab('orders')}
            />
          )}

          {/* PROFILE */}
          {tab === 'profile' && <ProfilePage />}

        </div>
      </div>

      {/* Floating cart bar — only show on home tab */}
      {cartCount > 0 && tab === 'home' && (
        <div className="cart-float" onClick={() => setShowCart(true)}>
          <div className="cart-float-count">{cartCount}</div>
          <div className="cart-float-info">
            <div className="cf-items">{cartCount} item{cartCount > 1 ? 's' : ''} in cart</div>
            <div className="cf-total">₹{cartTotal}</div>
          </div>
          <div style={{ fontSize: 18 }}>→</div>
        </div>
      )}

      {/* Cart modal */}
      {showCart && (
        <CartModal
          cart={cart}
          onUpdateQty={updateQty}
          onCheckout={checkout}
          onClose={() => setShowCart(false)}
        />
      )}
    </>
  );
}

// ─── Vendor App ────────────────────────────────────────────────────────────────
function VendorApp() {
  const [tab, setTab] = useState('dashboard');

  return (
    <>
      <Navbar tab={tab} setTab={setTab} role="vendor" />

      <div className="page">
        <div className="container">
          {tab === 'dashboard' && <DashboardPage />}
          {tab === 'menu'      && <MenuManagePage />}
          {tab === 'analytics' && <AnalyticsPage />}
        </div>
      </div>
    </>
  );
}
