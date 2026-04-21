import { useEffect, useState } from 'react';
import crest from '../assets/mhw-logo.svg';

const formatClock = (d = new Date()) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export default function Crest() {
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const tick = () => setClock(formatClock());
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      const id = setInterval(tick, 60_000);
      cleanup.id = id;
    }, msToNextMinute);
    const cleanup = { id: null };
    return () => {
      clearTimeout(timeout);
      if (cleanup.id) clearInterval(cleanup.id);
    };
  }, []);

  return (
    <header className="qg-masthead">
      <div className="qg-brand">
        <div className="qg-brand-mark"><img src={crest} alt="" /></div>
        <div className="qg-brand-txt">
          <div className="tiny">RESEARCH COMMISSION · FIFTH FLEET</div>
          <div className="wordmark">Quest Board</div>
        </div>
      </div>
      <div className="qg-status">
        <span className="qg-live-dot" />
        <span>COMMANDER <span className="hr">HR 999</span></span>
        <span className="sep">·</span>
        <span>ASTERA {clock}</span>
        <span className="sep">·</span>
        <span>CLEAR SKIES</span>
      </div>
    </header>
  );
}
