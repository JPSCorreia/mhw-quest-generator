/* global React, flavorFor, rankFor */
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Crest / Masthead ----------
function Crest() {
  return (
    <header className="qg-masthead">
      <div className="qg-brand">
        <div className="qg-brand-mark"><img src={window.__resources && window.__resources.mhwLogo} alt=""/></div>
        <div className="qg-brand-txt">
          <div className="tiny">RESEARCH COMMISSION · FIFTH FLEET</div>
          <div className="wordmark">Quest Board</div>
        </div>
      </div>
      <div className="qg-status">
        <span className="qg-live-dot"></span>
        <span>COMMANDER <span className="hr">HR 999</span></span>
        <span className="sep">·</span>
        <span>ASTERA 17:42</span>
        <span className="sep">·</span>
        <span>CLEAR SKIES</span>
      </div>
    </header>
  );
}

// ---------- Checkboxes ----------
function Check({ label, checked, onChange }) {
  return (
    <label className="qg-check" onClick={(e)=>{e.preventDefault(); onChange(!checked);}}>
      <span className={"box " + (checked ? "checked" : "")}></span>
      {label}
    </label>
  );
}

// ---------- Weapon chip ----------
function WeaponChip({ name, on, onToggle }) {
  return (
    <button className={"qg-chip " + (on?"on":"")} onClick={onToggle} type="button">
      <img src={window.__imgMap.w[name]} alt=""/>
      <span>{name}</span>
    </button>
  );
}

// ---------- Monster chip (small) ----------
function MonsterChip({ name, on, onToggle }) {
  return (
    <button className={"qg-chip " + (on?"on":"")} onClick={onToggle} type="button" style={{gridColumn:"span 1"}}>
      <img src={window.__imgMap.mo[name]} alt="" style={{filter:"none",width:22,height:22,objectFit:"contain"}}/>
      <span style={{fontSize:10}}>{name}</span>
    </button>
  );
}

// ---------- Armory ----------
function Armory({ selected, toggle, count }) {
  return (
    <section className="qg-panel">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4l7 7m0 0L8 14l-3-3 3-3zm0 0l8-2 2 2-2 8-8-8z"/></svg>
        <h3>Armory</h3>
        <span className="count">{count} / {WEAPONS.length}</span>
      </div>
      <div className="qg-panel-bd">
        <div className="qg-chip-grid">
          {WEAPONS.map(w => <WeaponChip key={w} name={w} on={!!selected[w]} onToggle={()=>toggle(w)}/>)}
        </div>
      </div>
    </section>
  );
}

// ---------- Bestiary ----------
function Bestiary({ flags, toggleFlag, superSel, toggleSuper }) {
  const superCount = Object.values(superSel).filter(Boolean).length;
  return (
    <section className="qg-panel">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20l4-12 4 8 4-6 4 10"/><path d="M2 20h20"/></svg>
        <h3>Bestiary</h3>
      </div>
      <div className="qg-panel-bd">
        <div className="qg-section-head">Monster tiers</div>
        <Check label="Include Low Rank" checked={flags.low} onChange={v=>toggleFlag('low',v)}/>
        <Check label="Include High Rank" checked={flags.mid} onChange={v=>toggleFlag('mid',v)}/>
        <Check label="Include Master Rank" checked={flags.high} onChange={v=>toggleFlag('high',v)}/>

        <div className="qg-section-head" style={{marginTop:14}}>Arch-Tempered · {superCount}/{SUPER.length}</div>
        <div className="qg-chip-grid">
          {SUPER.map(m => <MonsterChip key={m} name={m} on={!!superSel[m]} onToggle={()=>toggleSuper(m)}/>)}
        </div>

        <div className="qg-section-head" style={{marginTop:14}}>Commission terms</div>
        <Check label="Reduce Bowgun Frequency" checked={flags.reduceBowgun} onChange={v=>toggleFlag('reduceBowgun',v)}/>
        <Check label="Prevent Weapon Repeat" checked={flags.noRepeatW} onChange={v=>toggleFlag('noRepeatW',v)}/>
        <Check label="Prevent Monster Repeat" checked={flags.noRepeatM} onChange={v=>toggleFlag('noRepeatM',v)}/>
      </div>
    </section>
  );
}

// ---------- History ----------
function HistoryScroll({ history }) {
  return (
    <section className="qg-panel qg-col-history">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        <h3>Field Log</h3>
        <span className="count">{history.length}/20</span>
      </div>
      <div className="qg-panel-bd">
        {history.length === 0 ? (
          <div className="qg-history-empty">No quests issued yet.<br/>The board is empty.</div>
        ) : (
          <div className="qg-history-list">
            {history.map((q, i) => (
              <div key={q.id ?? i} className="qg-history-item">
                <div className="qg-history-num">№{String(history.length - i).padStart(2,'0')}</div>
                <div className="qg-history-body">
                  <div className="qg-history-pair">{q.weapon} · {q.monster}</div>
                  <div className="qg-history-meta">{rankFor(q.monster).name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Versus mark ----------
function VersusMark() {
  return (
    <div className="qg-versus-mark">
      <svg viewBox="0 0 120 120" aria-hidden>
        <defs>
          <radialGradient id="vs-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a6ffb0" stopOpacity=".9"/>
            <stop offset="60%" stopColor="#21c94a" stopOpacity=".2"/>
            <stop offset="100%" stopColor="#0c6d23" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#vs-g)"/>
        <circle cx="60" cy="60" r="42" fill="none" stroke="#d9b24e" strokeWidth="1" opacity=".6"/>
        <circle cx="60" cy="60" r="34" fill="none" stroke="#d9b24e" strokeWidth=".6" opacity=".4"/>
        <text x="60" y="72" fontFamily="Cinzel, serif" fontWeight="900" fontSize="36" letterSpacing="6" fill="#f3e0a1" textAnchor="middle" style={{textShadow:"0 0 12px rgba(91,255,125,.8)"}}>VS</text>
        <g opacity=".5" stroke="#d9b24e" strokeWidth=".8" fill="none">
          <path d="M12 60 L28 60 M92 60 L108 60"/>
          <path d="M22 55 L28 60 L22 65 M98 55 L92 60 L98 65"/>
        </g>
      </svg>
    </div>
  );
}

// ---------- Commission card (parchment) ----------
function CommissionCard({ monster }) {
  const [title, body] = flavorFor(monster);
  const rank = rankFor(monster);
  const stars = '★'.repeat(Math.max(0, rank.stars));
  return (
    <div className="qg-commission">
      <div style={{position:'relative',zIndex:1,flex:1}}>
        <div className="eye">COMMISSION № {Math.floor(Math.random()*900)+100} · {rank.name} · <span className="stars">{stars}</span></div>
        <h4>{title}</h4>
        <div className="body">{body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Crest, Check, WeaponChip, MonsterChip, Armory, Bestiary, HistoryScroll, VersusMark, CommissionCard });
