import { SUPER } from '../lib/data';
import { Check, MonsterChip } from './primitives';

export default function Bestiary({
  includeLow, includeMid, includeHigh,
  reduceBowgun, noRepeatW, noRepeatM,
  onFlag,
  superSel, onToggleSuper,
}) {
  const superCount = Object.values(superSel).filter(Boolean).length;
  return (
    <section className="qg-panel">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4.5" r="1.8" />
          <circle cx="18.5" cy="8" r="1.8" />
          <circle cx="5.5" cy="8" r="1.8" />
          <circle cx="21.5" cy="15" r="1.6" />
          <circle cx="2.5" cy="15" r="1.6" />
          <path d="M9 11.5c1.6-1.2 4.4-1.2 6 0 3 2 3.4 5.2 1.8 7.2-.8.9-1.9 1.3-3.3 1.3h-3c-1.4 0-2.5-.4-3.3-1.3-1.6-2-1.2-5.2 1.8-7.2z" />
        </svg>
        <h3>Bestiary</h3>
      </div>
      <div className="qg-panel-bd">
        <div className="qg-section-head">Monster tiers</div>
        <Check label="Include Low Rank"    checked={includeLow}  onChange={(v) => onFlag('low', v)} />
        <Check label="Include High Rank"   checked={includeMid}  onChange={(v) => onFlag('mid', v)} />
        <Check label="Include Master Rank" checked={includeHigh} onChange={(v) => onFlag('high', v)} />

        <div className="qg-section-head" style={{ marginTop: 14 }}>
          Special Threats · {superCount}/{SUPER.length}
        </div>
        <div className="qg-chip-grid">
          {SUPER.map((m) => (
            <MonsterChip key={m} name={m} on={!!superSel[m]} onToggle={() => onToggleSuper(m)} />
          ))}
        </div>

        <div className="qg-section-head" style={{ marginTop: 14 }}>Commission terms</div>
        <Check label="Reduce Bowgun Frequency" checked={reduceBowgun} onChange={(v) => onFlag('reduceBowgun', v)} />
        <Check label="Prevent Weapon Repeat"   checked={noRepeatW}    onChange={(v) => onFlag('noRepeatW', v)} />
        <Check label="Prevent Monster Repeat"  checked={noRepeatM}    onChange={(v) => onFlag('noRepeatM', v)} />
      </div>
    </section>
  );
}
