// src/pages/student/CafeteriaList.jsx
import { useApp } from '../../context/AppContext';

export default function CafeteriaList({ onSelect }) {
  const { cafeterias } = useApp();

  return (
    <>
      <div className="page-header">
        <h2>Campus Cafeterias</h2>
        <p>Browse and order from your favourite spots</p>
      </div>

      <div className="cafeteria-grid">
        {cafeterias.map(cafe => (
          <div key={cafe.id} className="cafe-card" onClick={() => onSelect(cafe)}>
            <div className="cafe-card-img">{cafe.emoji}</div>
            <div className="cafe-card-body">
              <h3>{cafe.name}</h3>
              <span className={`cafe-tag tag-${cafe.type.toLowerCase().replace(' ', '-')}`}>
                {cafe.type}
              </span>
              <p className="cafe-desc">{cafe.description}</p>
              <div className="cafe-meta">
                <span className={cafe.open ? 'online-dot' : 'offline-dot'} />
                {cafe.open ? 'Open Now' : 'Closed'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
