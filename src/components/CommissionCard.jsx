import { useEffect, useState } from 'react';
import { flavorFor, rankFor, TEMPER_LABEL, baseMonster } from '../lib/data';

const RANK_LABEL = { Low: 'LOW RANK', High: 'HIGH RANK', Master: 'MASTER RANK' };

export default function CommissionCard({ monster, quest, temper }) {
  const [num, setNum] = useState(() => Math.floor(Math.random() * 900) + 100);
  useEffect(() => {
    setNum(Math.floor(Math.random() * 900) + 100);
  }, [monster, quest?.id]);

  const temperKey = temper || 'normal';
  const prefix = TEMPER_LABEL[temperKey] || '';

  if (quest) {
    const label = RANK_LABEL[quest.rank] || '—';
    const stars = '★'.repeat(Math.max(0, quest.stars));
    const starCls = `stars stars-${(quest.rank || '').toLowerCase()}`;
    return (
      <div className="qg-commission">
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <div className="eye">
            COMMISSION № {num} · {label} · {quest.kind.toUpperCase()} · <span className={starCls}>{stars}</span>
          </div>
          <h4>{quest.name}</h4>
          <div className="body">{quest.objective} · {quest.location}</div>
        </div>
      </div>
    );
  }

  const [, body] = flavorFor(monster);
  const rank = rankFor(monster);
  const stars = '★'.repeat(Math.max(0, rank.stars));
  const starCls = `stars stars-${(rank.rank || '').toLowerCase()}`;
  return (
    <div className="qg-commission">
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        <div className="eye">
          COMMISSION № {num} · {rank.name} · <span className={starCls}>{stars}</span>
        </div>
        <h4 className="qg-commission-title">
          Hunt: <span className={`temper-${temperKey}`}>{prefix}{baseMonster(monster)}</span>
        </h4>
        <div className="body">{body}</div>
      </div>
    </div>
  );
}
