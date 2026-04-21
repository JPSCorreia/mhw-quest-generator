import { WEAPONS } from '../lib/data';
import { WeaponChip } from './primitives';

export default function Armory({ selected, onToggle }) {
  const count = WEAPONS.filter((w) => selected[w]).length;
  return (
    <section className="qg-panel">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
        </svg>
        <h3>Armory</h3>
        <span className="count">{count} / {WEAPONS.length}</span>
      </div>
      <div className="qg-panel-bd">
        <div className="qg-chip-grid">
          {WEAPONS.map((w) => (
            <WeaponChip key={w} name={w} on={!!selected[w]} onToggle={() => onToggle(w)} />
          ))}
        </div>
      </div>
    </section>
  );
}
