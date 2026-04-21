import { useEffect, useState } from 'react';
import { flavorFor, rankFor } from '../lib/data';

export default function CommissionCard({ monster }) {
  const [title, body] = flavorFor(monster);
  const rank = rankFor(monster);
  const stars = '★'.repeat(Math.max(0, rank.stars));
  const [num, setNum] = useState(() => Math.floor(Math.random() * 900) + 100);
  useEffect(() => { setNum(Math.floor(Math.random() * 900) + 100); }, [monster]);
  return (
    <div className="qg-commission">
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <div className="eye">
          COMMISSION № {num} · {rank.name} · <span className="stars">{stars}</span>
        </div>
        <h4>{title}</h4>
        <div className="body">{body}</div>
      </div>
    </div>
  );
}
