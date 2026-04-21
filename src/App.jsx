import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import questStore from './stores/questStore';
import { LOW_TIER, MID_TIER, HIGH_TIER, BOWGUNS } from './lib/data';
import { monsterIcon, weaponIcon } from './lib/assets';
import Crest from './components/Crest';
import Armory from './components/Armory';
import Bestiary from './components/Bestiary';
import HistoryScroll from './components/HistoryScroll';
import VersusMark from './components/VersusMark';
import CommissionCard from './components/CommissionCard';
import bgImage from './assets/images/new-background.jpg';
import './styles/tokens.css';
import './styles/kit.css';

const FLAG_ACTIONS = {
  low:          (v) => questStore.setIncludeNormalMonsters(v),
  mid:          (v) => questStore.setIncludeMidTierMonsters(v),
  high:         (v) => questStore.setIncludeEndgameMonsters(v),
  reduceBowgun: (v) => questStore.setReduceBowgunFrequency(v),
  noRepeatW:    (v) => questStore.setPreventRepeatWeapon(v),
  noRepeatM:    (v) => questStore.setPreventRepeatMonster(v),
};

const App = observer(() => {
  const [rolling, setRolling] = useState(false);
  const [rollShown, setRollShown] = useState({ weapon: '', monster: '' });

  const selectedWeaponsArr = Object.keys(questStore.selectedWeapons)
    .filter((w) => questStore.selectedWeapons[w]);
  const selectedSuperArr = Object.keys(questStore.selectedSuperEndgameMonsters)
    .filter((m) => questStore.selectedSuperEndgameMonsters[m]);

  const canGenerate =
    selectedWeaponsArr.length > 0 &&
    (questStore.includeNormalMonsters ||
     questStore.includeMidTierMonsters ||
     questStore.includeEndgameMonsters ||
     selectedSuperArr.length > 0);

  const rollOnce = () => {
    const wPool = selectedWeaponsArr.flatMap((w) => {
      if (questStore.reduceBowgunFrequency && BOWGUNS.includes(w)) return [w];
      if (questStore.reduceBowgunFrequency) return [w, w, w, w];
      return [w];
    });
    let mPool = [];
    if (questStore.includeNormalMonsters)  mPool = mPool.concat(LOW_TIER);
    if (questStore.includeMidTierMonsters) mPool = mPool.concat(MID_TIER);
    if (questStore.includeEndgameMonsters) mPool = mPool.concat(HIGH_TIER, HIGH_TIER);
    selectedSuperArr.forEach((m) => mPool.push(m, m, m, m));
    if (wPool.length === 0 || mPool.length === 0) return null;

    let w = wPool[Math.floor(Math.random() * wPool.length)];
    if (questStore.preventRepeatWeapon && selectedWeaponsArr.length > 1) {
      while (w === questStore.weapon) w = wPool[Math.floor(Math.random() * wPool.length)];
    }
    let m = mPool[Math.floor(Math.random() * mPool.length)];
    const uniqM = new Set(mPool);
    if (questStore.preventRepeatMonster && uniqM.size > 1) {
      while (m === questStore.monster) m = mPool[Math.floor(Math.random() * mPool.length)];
    }
    return { weapon: w, monster: m };
  };

  const handleGenerate = () => {
    if (!canGenerate || rolling) return;
    setRolling(true);
    let ticks = 0;
    const id = setInterval(() => {
      ticks += 1;
      const peek = rollOnce();
      if (peek) setRollShown(peek);
      if (ticks >= 7) {
        clearInterval(id);
        const final = rollOnce();
        if (final) {
          questStore.setWeapon(final.weapon);
          questStore.setMonster(final.monster);
          questStore.addQuestToHistory(final.weapon, final.monster);
          setRollShown(final);
        }
        setRolling(false);
      }
    }, 65);
  };

  const handleClear = () => {
    questStore.clearQuestHistory();
    setRollShown({ weapon: '', monster: '' });
  };

  const showMonster = rolling ? rollShown.monster : questStore.monster;
  const showWeapon  = rolling ? rollShown.weapon  : questStore.weapon;
  const hasResult = !!showMonster && !!showWeapon;

  const stageClass =
    'qg-panel qg-stage qg-col-stage' +
    (rolling ? ' qg-rolling' : '') +
    (hasResult && !rolling ? ' qg-revealed' : '');

  return (
    <div className="qg-root" style={{ '--qg-bg-image': `url(${bgImage})` }}>
      <div className="qg-shell">
        <Crest />
        <div className="qg-grid">
          <div className="qg-col-options">
            <Armory
              selected={questStore.selectedWeapons}
              onToggle={(w) => questStore.toggleWeaponSelection(w)}
            />
            <Bestiary
              includeLow={questStore.includeNormalMonsters}
              includeMid={questStore.includeMidTierMonsters}
              includeHigh={questStore.includeEndgameMonsters}
              reduceBowgun={questStore.reduceBowgunFrequency}
              noRepeatW={questStore.preventRepeatWeapon}
              noRepeatM={questStore.preventRepeatMonster}
              onFlag={(k, v) => FLAG_ACTIONS[k](v)}
              superSel={questStore.selectedSuperEndgameMonsters}
              onToggleSuper={(m) => questStore.toggleSuperEndgameMonster(m)}
            />
          </div>

          <section className={stageClass}>
            <div className="qg-stage-head">
              <div className="qg-stage-eyebrow">
                {rolling ? 'rolling the dice…' : hasResult ? 'your commission is posted' : 'awaiting orders'}
              </div>
              <h1 className="qg-stage-title">
                {rolling ? 'SUMMONING' : hasResult ? 'COMMISSION' : 'QUEST BOARD'}
              </h1>
              {!hasResult && !rolling && (
                <p className="qg-stage-sub">
                  Select your armory and bestiary terms. Post the commission when you&apos;re ready to answer the call.
                </p>
              )}
            </div>

            {hasResult ? (
              <>
                <div className="qg-versus" key={showWeapon + showMonster + (rolling ? 'r' : '')}>
                  <div className="qg-vs-face">
                    <div className="qg-vs-role">HUNTER&apos;S BLADE</div>
                    <div className="qg-vs-portrait weapon">
                      <div className="frame-orn" />
                      {showWeapon && <img src={weaponIcon(showWeapon)} alt="" />}
                    </div>
                    <div className="qg-vs-name">{showWeapon || '—'}</div>
                  </div>
                  <VersusMark />
                  <div className="qg-vs-face">
                    <div className="qg-vs-role">QUARRY</div>
                    <div className="qg-vs-portrait emerald">
                      <div className="frame-orn" />
                      {showMonster && <img src={monsterIcon(showMonster)} alt="" />}
                    </div>
                    <div className="qg-vs-name">{showMonster || '—'}</div>
                  </div>
                </div>
                {<CommissionCard monster={showMonster} />}
              </>
            ) : (
              <div className="qg-stage-empty">
                <span className="big">The board is empty.</span>
                No commissions have been posted.<br />
                Generate a quest to summon your next hunt.
              </div>
            )}

            <div className="qg-orn">◆ ◆ ◆</div>

            <div className="qg-ctas">
              <button
                className="qg-btn qg-btn-primary"
                onClick={handleGenerate}
                disabled={!canGenerate || rolling}
              >
                {rolling ? 'Rolling…' : hasResult ? 'Reroll Commission' : 'Post Commission'}
              </button>
              <button
                className="qg-btn qg-btn-danger"
                onClick={handleClear}
                disabled={questStore.questHistory.length === 0 && !hasResult}
              >
                Clear Board
              </button>
            </div>
          </section>

          <HistoryScroll
            history={questStore.questHistory}
            onRemove={(id) => questStore.removeQuestFromHistory(id)}
          />
        </div>
      </div>
    </div>
  );
});

export default App;
