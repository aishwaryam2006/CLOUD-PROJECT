// src/components/QRCode.jsx
export default function QRCode({ value }) {
  const pattern = [];
  for (let i = 0; i < 64; i++) {
    const seed = (value.charCodeAt(i % value.length) * (i + 7)) % 3;
    pattern.push(seed === 0 ? 'b' : 'w');
  }
  // Force corners black (finder pattern)
  [0,1,2,8,9,10,16,17,18, 5,6,7,13,14,15,21,22,23, 40,41,42,48,49,50,56,57,58]
    .forEach(i => { if (i < 64) pattern[i] = 'b'; });

  return (
    <div className="qr-box">
      {pattern.map((c, i) => <div key={i} className={`qr-cell ${c}`} />)}
    </div>
  );
}
