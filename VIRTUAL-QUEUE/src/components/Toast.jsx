// src/components/Toast.jsx
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'warning' ? 'orange' : ''}`}>
          <div className="toast-title">{t.title}</div>
          <div className="toast-msg">{t.msg}</div>
        </div>
      ))}
    </div>
  );
}
