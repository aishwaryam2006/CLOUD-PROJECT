import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_CAFETERIAS, INITIAL_MENUS, INITIAL_USERS, EMOJI_MAP } from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [cafeterias,  setCafeterias]    = useState(INITIAL_CAFETERIAS);
  const [menus,       setMenus]         = useState(INITIAL_MENUS);
  const [orders,      setOrders]        = useState([]);
  const [users,       setUsers]         = useState(INITIAL_USERS);
  const [toasts,      setToasts]        = useState([]);

  // ── Simulate real-time order progression ──────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev =>
        prev.map(o => {
          if (o.status === 'ordered'   && Math.random() > 0.6) return { ...o, status: 'preparing' };
          if (o.status === 'preparing' && Math.random() > 0.7) {
            showToast('🔔 Order Update', `Token #${o.token} is almost ready!`, 'warning');
            return { ...o, status: 'ready' };
          }
          return o;
        })
      );
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = useCallback((title, msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  function login(email, password) {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password' };
    setCurrentUser(found);
    return { user: found };
  }

  function register(formData, role) {
    const exists = users.find(u => u.email === formData.email);
    if (exists) return { error: 'Email already registered' };

    const newUser = {
      id:        'u' + Date.now(),
      name:      formData.name,
      email:     formData.email,
      password:  formData.password,
      role,
      rollNo:    formData.rollNo    || '',
      shopName:  formData.shopName  || '',
      shopType:  formData.shopType  || 'Food',
      cafeId:    null,
      setupDone: false,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { user: newUser };
  }

  function logout() {
    setCurrentUser(null);
  }

  // ── Vendor shop setup ──────────────────────────────────────────────────────
  function setupShop(shopData) {
    const updated = { ...currentUser, ...shopData, setupDone: true };

    // Create a new cafeteria entry for this vendor
    const newCafe = {
      id:          Date.now(),
      name:        shopData.shopName,
      type:        shopData.shopType,
      emoji:       EMOJI_MAP[shopData.shopType] || '🍽️',
      open:        true,
      vendorId:    updated.id,
      description: shopData.shopDesc || 'A great campus eatery',
    };

    setCafeterias(prev => [...prev, newCafe]);
    setMenus(prev => ({ ...prev, [newCafe.id]: [] }));

    const final = { ...updated, cafeId: newCafe.id };
    setCurrentUser(final);
    setUsers(prev => prev.map(u => (u.id === final.id ? final : u)));

    showToast('🏪 Shop is Live!', `${shopData.shopName} is now on QueueLess!`);
    return final;
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  function placeOrder(cafeId, cartItems, cafeName) {
    const cafeOrders = orders.filter(o => o.cafeId === cafeId);
    const token = 100 + cafeOrders.length + 1;

    const newOrder = {
      id:          'ord' + Date.now(),
      cafeId,
      cafeName,
      studentId:   currentUser?.id,
      studentName: currentUser?.name,
      items:       cartItems,
      total:       cartItems.reduce((s, i) => s + i.price * i.qty, 0),
      token,
      status:      'ordered',
      time:        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date:        new Date().toLocaleDateString(),
    };

    setOrders(prev => [...prev, newOrder]);
    showToast('✅ Order Placed!', `Token #${token} — ${cafeName}`);
    return newOrder;
  }

  function updateOrderStatus(orderId, newStatus) {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast('📋 Order Updated', `Status changed to ${newStatus}`);
  }

  // ── Menu management ────────────────────────────────────────────────────────
  function addMenuItem(cafeId, item) {
    const newItem = { ...item, id: Date.now(), available: true };
    setMenus(prev => ({ ...prev, [cafeId]: [...(prev[cafeId] || []), newItem] }));
    showToast('✅ Item Added', `"${item.name}" is now on your menu!`);
  }

  function toggleMenuItemAvailability(cafeId, itemId) {
    setMenus(prev => ({
      ...prev,
      [cafeId]: prev[cafeId].map(i => (i.id === itemId ? { ...i, available: !i.available } : i)),
    }));
  }

  function deleteMenuItem(cafeId, itemId) {
    setMenus(prev => ({
      ...prev,
      [cafeId]: prev[cafeId].filter(i => i.id !== itemId),
    }));
    showToast('🗑️ Item Removed', 'Menu item deleted');
  }

  const value = {
    currentUser, cafeterias, menus, orders, users, toasts,
    login, register, logout, setupShop,
    placeOrder, updateOrderStatus,
    addMenuItem, toggleMenuItemAvailability, deleteMenuItem,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
