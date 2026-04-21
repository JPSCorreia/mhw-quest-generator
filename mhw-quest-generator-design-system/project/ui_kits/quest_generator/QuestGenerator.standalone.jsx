/* global React, ReactDOM, Armory, Bestiary, HistoryScroll, Crest, VersusMark, CommissionCard, WEAPONS, LOW_TIER, MID_TIER, HIGH_TIER, SUPER, flavorFor, rankFor */
const { useState, useEffect, useRef } = React;

const STORAGE_KEY = 'qg-kit-state-v1';

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return null;
}

const defaultState = () => ({
  weapon: '',
  monster: '',
  selectedWeapons: Object.fromEntries(WEAPONS.map(w => [w, true])),
  selectedSuper:   Object.fromEntries(SUPER.map(m => [m, true])),
  flags: { low: true, mid: true, high: true, reduceBowgun: false, noRepeatW: false, noRepeatM: false },
  history: [],
});

function QuestGenerator() {
  const [st, setSt] = useState(() => ({ ...defaultState(), ...(loadState() || {}) }));
  const [rolling, setRolling] = useState(false);
  const [rollShown, setRollShown] = useState({ weapon: '', monster: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  }, [st]);

  const toggleWeapon = (w) => setSt(s => ({ ...s, selectedWeapons: { ...s.selectedWeapons, [w]: !s.selectedWeapons[w] }}));
  const toggleSuper  = (m) => setSt(s => ({ ...s, selectedSuper:   { ...s.selectedSuper,   [m]: !s.selectedSuper[m]   }}));
  const toggleFlag   = (k,v) => setSt(s => ({ ...s, flags: { ...s.flags, [k]: v }}));

  const selectedWeaponsArr = Object.keys(st.selectedWeapons).filter(w => st.selectedWeapons[w]);
  const selectedSuperArr   = Object.keys(st.selectedSuper).filter(m => st.selectedSuper[m]);

  const canGenerate = selectedWeaponsArr.length > 0 && (st.flags.low || st.flags.mid || st.flags.high || selectedSuperArr.length > 0);

  const rollOnce = () => {
    // Weapon pool
    const bowguns = ['Light Bowgun','Heavy Bowgun'];
    let wPool = selectedWeaponsArr.flatMap(w => {
      if (st.flags.reduceBowgun && bowguns.includes(w)) return [w];
      if (st.flags.reduceBowgun) return [w,w,w,w];
      return [w];
    });
    // Monster pool
    let mPool = [];
    if (st.flags.low)  mPool = mPool.concat(LOW_TIER);
    if (st.flags.mid)  mPool = mPool.concat(MID_TIER);
    if (st.flags.high) mPool = mPool.concat(HIGH_TIER, HIGH_TIER);
    selectedSuperArr.forEach(m => mPool.push(m,m,m,m));
    if (wPool.length === 0 || mPool.length === 0) return null;
    let w = wPool[Math.floor(Math.random()*wPool.length)];
    let m = mPool[Math.floor(Math.random()*mPool.length)];
    if (st.flags.noRepeatW && selectedWeaponsArr.length > 1) {
      while (w === st.weapon) w = wPool[Math.floor(Math.random()*wPool.length)];
    }
    const uniq = new Set(mPool);
    if (st.flags.noRepeatM && uniq.size > 1) {
      while (m === st.monster) m = mPool[Math.floor(Math.random()*mPool.length)];
    }
    return { weapon: w, monster: m };
  };

  const handleGenerate = () => {
    if (!canGenerate || rolling) return;
    setRolling(true);
    let ticks = 0;
    const id = setInterval(() => {
      ticks++;
      const peek = rollOnce();
      if (peek) setRollShown(peek);
      if (ticks >= 7) {
        clearInterval(id);
        const final = rollOnce();
        if (final) {
          setSt(s => ({
            ...s,
            weapon: final.weapon,
            monster: final.monster,
            history: [{ id: Date.now(), ...final }, ...s.history].slice(0, 20),
          }));
          setRollShown(final);
        }
        setRolling(false);
      }
    }, 65);
  };

  const handleClear = () => {
    setSt(s => ({ ...s, weapon: '', monster: '', history: [] }));
    setRollShown({ weapon:'', monster:'' });
  };

  const showMonster = rolling ? rollShown.monster : st.monster;
  const showWeapon  = rolling ? rollShown.weapon  : st.weapon;
  const hasResult   = !!showMonster && !!showWeapon;

  return (
    <div className="qg-root">
      <div className="qg-shell">
        <Crest />
        <div className="qg-grid">
          <div>
            <Armory
              selected={st.selectedWeapons}
              toggle={toggleWeapon}
              count={selectedWeaponsArr.length}
            />
            <div style={{height:16}}/>
            <Bestiary
              flags={st.flags}
              toggleFlag={toggleFlag}
              superSel={st.selectedSuper}
              toggleSuper={toggleSuper}
            />
          </div>

          <section className={"qg-panel qg-stage " + (rolling?'qg-rolling':'') + (hasResult && !rolling?' qg-revealed':'')}>
            <div className="qg-stage-head">
              <div className="qg-stage-eyebrow">{rolling?'rolling the dice…':hasResult?'your commission is posted':'awaiting orders'}</div>
              <h1 className="qg-stage-title">{rolling?'SUMMONING':hasResult?'COMMISSION':'QUEST BOARD'}</h1>
              {!hasResult && !rolling && <p className="qg-stage-sub">Select your armory and bestiary terms. Post the commission when you're ready to answer the call.</p>}
            </div>

            {hasResult ? (
              <>
                <div className="qg-versus" key={st.weapon + st.monster + (rolling?'r':'')}>
                  <div className="qg-vs-face">
                    <div className="qg-vs-role">HUNTER'S BLADE</div>
                    <div className="qg-vs-portrait">
                      <div className="frame-orn"></div>
                      {showWeapon && <img src={window.__imgMap.w[showWeapon]} alt="" style={{filter:"invert(1) drop-shadow(0 0 14px rgba(243,224,161,.4))"}}/>}
                    </div>
                    <div className="qg-vs-name">{showWeapon || '—'}</div>
                  </div>
                  <VersusMark />
                  <div className="qg-vs-face">
                    <div className="qg-vs-role">QUARRY</div>
                    <div className="qg-vs-portrait emerald">
                      <div className="frame-orn"></div>
                      {showMonster && <img src={window.__imgMap.mo[showMonster]} alt=""/>}
                    </div>
                    <div className="qg-vs-name">{showMonster || '—'}</div>
                  </div>
                </div>
                {!rolling && <CommissionCard monster={showMonster}/>}
              </>
            ) : (
              <div className="qg-stage-empty">
                <span className="big">The board is empty.</span>
                No commissions have been posted.<br/>
                Generate a quest to summon your next hunt.
              </div>
            )}

            <div className="qg-orn">◆ ◆ ◆</div>

            <div className="qg-ctas">
              <button className="qg-btn qg-btn-primary" onClick={handleGenerate} disabled={!canGenerate || rolling}>
                {rolling ? 'Rolling…' : hasResult ? 'Reroll Commission' : 'Post Commission'}
              </button>
              <button className="qg-btn qg-btn-danger" onClick={handleClear} disabled={st.history.length===0 && !hasResult}>
                Clear Board
              </button>
            </div>
          </section>

          <HistoryScroll history={st.history}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QuestGenerator });
