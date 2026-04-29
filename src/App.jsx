import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import questStore from './stores/questStore';
import {
  LOW_TIER, MID_TIER, HIGH_TIER, BOWGUNS, QUESTS,
  rollTemper, tierOf, rankFor, specialThreatQuestsFor,
} from './lib/data';
import { monsterIcon, weaponIcon, trapIcon } from './lib/assets';
import Crest from './components/Crest';
import Armory from './components/Armory';
import RollPanel from './components/RollPanel';
import HistoryScroll from './components/HistoryScroll';
import VersusMark from './components/VersusMark';
import CommissionCard from './components/CommissionCard';
import bgImage from './assets/images/new-background.jpg';
import './styles/tokens.css';
import './styles/kit.css';

const App = observer(() => {
  const [rolling, setRolling] = useState(false);
  const [rollShown, setRollShown] = useState({ weapon: '', monster: '', quest: null, temper: 'normal' });
  const rollColRef = useRef(null);
  const armoryColRef = useRef(null);

  useEffect(() => {
    const right = rollColRef.current;
    const left = armoryColRef.current;
    if (!right || !left) return;
    const apply = () => left.style.setProperty('--qg-roll-h', `${right.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(right);
    return () => ro.disconnect();
  }, []);

  const selectedWeaponsArr = Object.keys(questStore.selectedWeapons)
    .filter((w) => questStore.selectedWeapons[w]);
  const selectedSuperArr = Object.keys(questStore.selectedSuperEndgameMonsters)
    .filter((m) => questStore.selectedSuperEndgameMonsters[m]);
  const selectedBaseSpecialArr = Object.keys(questStore.selectedBaseSpecialMonsters || {})
    .filter((m) => questStore.selectedBaseSpecialMonsters[m]);
  const selectedKindsArr = Object.keys(questStore.selectedQuestKinds)
    .filter((k) => questStore.selectedQuestKinds[k]);
  const selectedRanksArr = Object.keys(questStore.selectedRanks)
    .filter((r) => questStore.selectedRanks[r]);

  const tierAllowed = (m) => {
    const t = tierOf(m);
    if (t === 'low' && questStore.includeNormalMonsters) return true;
    if (t === 'mid' && questStore.includeMidTierMonsters) return true;
    if (t === 'high' && questStore.includeEndgameMonsters) return true;
    return false;
  };

  const buildMonsterPool = () => {
    const ranks = new Set(selectedRanksArr);
    const inSelectedRank = (m) => {
      const r = rankFor(m).rank;
      return r ? ranks.has(r) : false;
    };
    const tiered = [];
    if (questStore.includeNormalMonsters) tiered.push(...LOW_TIER);
    if (questStore.includeMidTierMonsters) tiered.push(...MID_TIER);
    if (questStore.includeEndgameMonsters) tiered.push(...HIGH_TIER);
    const pool = tiered.filter(inSelectedRank);
    selectedSuperArr.filter(inSelectedRank).forEach((m) => pool.push(m));
    selectedBaseSpecialArr.filter(inSelectedRank).forEach((m) => pool.push(m));
    return pool;
  };

  const buildQuestPool = () => {
    const allowedRanks = new Set(selectedRanksArr);
    const kinds = new Set(selectedKindsArr);
    const baseFiltered = QUESTS.filter(
      (q) =>
        kinds.has(q.kind) &&
        allowedRanks.has(q.rank) &&
        (questStore.includeCaptureQuests || !q.isCapture) &&
        q.targets.some(tierAllowed),
    );
    const specials = specialThreatQuestsFor(
      selectedSuperArr.concat(selectedBaseSpecialArr),
    ).filter((q) => allowedRanks.has(q.rank) && kinds.has(q.kind));
    const seen = new Set();
    const pool = [];
    for (const q of baseFiltered.concat(specials)) {
      const key = q.id || q.name;
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push(q);
    }
    return pool;
  };

  const canGenerate = questStore.useQuestMode
    ? selectedWeaponsArr.length > 0 &&
      selectedKindsArr.length > 0 &&
      selectedRanksArr.length > 0 &&
      buildQuestPool().length > 0
    : selectedWeaponsArr.length > 0 &&
      selectedRanksArr.length > 0 &&
      buildMonsterPool().length > 0;

  const rollWeapon = (prev) => {
    const wPool = selectedWeaponsArr.flatMap((w) => {
      if (questStore.reduceBowgunFrequency && BOWGUNS.includes(w)) return [w];
      if (questStore.reduceBowgunFrequency) return [w, w, w, w];
      return [w];
    });
    if (wPool.length === 0) return null;
    let w = wPool[Math.floor(Math.random() * wPool.length)];
    if (questStore.preventRepeatWeapon && selectedWeaponsArr.length > 1) {
      while (w === prev) w = wPool[Math.floor(Math.random() * wPool.length)];
    }
    return w;
  };

  const rollOnce = () => {
    const w = rollWeapon(questStore.weapon);
    if (!w) return null;

    if (questStore.useQuestMode) {
      const qPool = buildQuestPool();
      if (qPool.length === 0) return null;
      let q = qPool[Math.floor(Math.random() * qPool.length)];
      if (questStore.preventRepeatMonster && qPool.length > 1 && questStore.quest) {
        while (q.id === questStore.quest.id) {
          q = qPool[Math.floor(Math.random() * qPool.length)];
        }
      }
      return { weapon: w, monster: q.targets[0], quest: q, temper: q.temper || 'normal' };
    }

    const mPool = buildMonsterPool();
    if (mPool.length === 0) return null;
    let m = mPool[Math.floor(Math.random() * mPool.length)];
    const uniqM = new Set(mPool);
    if (questStore.preventRepeatMonster && uniqM.size > 1) {
      while (m === questStore.monster) m = mPool[Math.floor(Math.random() * mPool.length)];
    }
    return { weapon: w, monster: m, quest: null, temper: rollTemper(m) };
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
          questStore.setQuest(final.quest);
          questStore.setTemper(final.temper);
          questStore.addQuestToHistory(final.weapon, final.monster, final.quest, final.temper);
          setRollShown(final);
        }
        setRolling(false);
      }
    }, 65);
  };

  const handleClear = () => {
    questStore.clearQuestHistory();
    setRollShown({ weapon: '', monster: '', quest: null, temper: 'normal' });
  };

  const showMonster = rolling ? rollShown.monster : questStore.monster;
  const showWeapon  = rolling ? rollShown.weapon  : questStore.weapon;
  const showQuest   = rolling ? rollShown.quest   : questStore.quest;
  const showTemper  = rolling ? rollShown.temper  : questStore.temper;
  const hasResult = !!showMonster && !!showWeapon;

  const stageClass =
    'qg-panel qg-stage' +
    (rolling ? ' qg-rolling' : '') +
    (hasResult && !rolling ? ' qg-revealed' : '');

  const quarryPortraitClass =
    'qg-vs-portrait emerald temper-' + (showTemper || 'normal');

  const onToggleTier = (t) => {
    if (t === 'low') questStore.setIncludeNormalMonsters(!questStore.includeNormalMonsters);
    else if (t === 'mid') questStore.setIncludeMidTierMonsters(!questStore.includeMidTierMonsters);
    else if (t === 'high') questStore.setIncludeEndgameMonsters(!questStore.includeEndgameMonsters);
  };

  return (
    <div className="qg-root" style={{ '--qg-bg-image': `url(${bgImage})` }}>
      <div className="qg-shell">
        <Crest />
        <div className="qg-grid">
          <div className="qg-col-armory" ref={armoryColRef}>
            <Armory
              selected={questStore.selectedWeapons}
              onToggle={(w) => questStore.toggleWeaponSelection(w)}
              reduceBowgun={questStore.reduceBowgunFrequency}
              noRepeatW={questStore.preventRepeatWeapon}
              onFlag={(k, v) => {
                if (k === 'reduceBowgun') questStore.setReduceBowgunFrequency(v);
                else if (k === 'noRepeatW') questStore.setPreventRepeatWeapon(v);
              }}
            />
            <HistoryScroll
              history={questStore.questHistory}
              onRemove={(id) => questStore.removeQuestFromHistory(id)}
            />
          </div>

          <div className="qg-col-stage">
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
                  <div className="qg-versus" key={showWeapon + showMonster + (showQuest?.id ?? '') + showTemper + (rolling ? 'r' : '')}>
                    <div className="qg-vs-face">
                      <div className="qg-vs-role">HUNTER&apos;S BLADE</div>
                      <div className="qg-vs-portrait weapon">
                        <div className="frame-orn" />
                        {showWeapon && <img src={weaponIcon(showWeapon)} alt="" />}
                      </div>
                    </div>
                    <VersusMark />
                    <div className="qg-vs-face">
                      <div className="qg-vs-role">QUARRY</div>
                      <div className={quarryPortraitClass}>
                        <div className="frame-orn" />
                        {(() => {
                          const qTargets = showQuest?.targets ?? showQuest?.monsters ?? [];
                          const isCapture = !!showQuest?.isCapture;
                          const wrap = (key, node) => (
                            <div key={key} className="qg-vs-mon">
                              {node}
                              {isCapture && <img className="qg-vs-trap" src={trapIcon} alt="capture" />}
                            </div>
                          );
                          if (showQuest && qTargets.length > 1) {
                            return (
                              <div className={`qg-vs-grid grid-${Math.min(qTargets.length, 6)}`}>
                                {qTargets.slice(0, 6).map((m, i) =>
                                  wrap(`${m}-${i}`, <img src={monsterIcon(m)} alt={m} />),
                                )}
                              </div>
                            );
                          }
                          if (!showMonster) return null;
                          return wrap(showMonster, <img src={monsterIcon(showMonster)} alt="" />);
                        })()}
                      </div>
                    </div>
                  </div>
                  <CommissionCard monster={showMonster} quest={showQuest} temper={showTemper} />
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
          </div>

          <div className="qg-col-roll" ref={rollColRef}>
            <RollPanel
              useQuestMode={questStore.useQuestMode}
              onSetMode={(v) => questStore.setUseQuestMode(v)}
              includeLow={questStore.includeNormalMonsters}
              includeMid={questStore.includeMidTierMonsters}
              includeHigh={questStore.includeEndgameMonsters}
              onToggleTier={onToggleTier}
              ranks={questStore.selectedRanks}
              onToggleRank={(r) => questStore.toggleRank(r)}
              questKinds={questStore.selectedQuestKinds}
              onToggleQuestKind={(k) => questStore.toggleQuestKind(k)}
              includeCapture={questStore.includeCaptureQuests}
              onToggleCapture={(v) => questStore.setIncludeCaptureQuests(v)}
              superSel={questStore.selectedSuperEndgameMonsters}
              onToggleSuper={(m) => questStore.toggleSuperEndgameMonster(m)}
              baseSpecialSel={questStore.selectedBaseSpecialMonsters}
              onToggleBaseSpecial={(m) => questStore.toggleBaseSpecialMonster(m)}
              noRepeat={questStore.preventRepeatMonster}
              onToggleNoRepeat={(v) => questStore.setPreventRepeatMonster(v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default App;
