import {
  QUEST_KINDS,
  SUPER,
  BASE_SPECIAL,
  temperStates,
  baseMonster,
} from '../lib/data';
import { Check, MonsterChip } from './primitives';

const RANKS = ['Low', 'High', 'Master'];
const QUEST_RANK_LABEL = {
  Low: 'Low Rank Quests',
  High: 'High Rank Quests',
  Master: 'Master Rank Quests',
};
const MONSTER_RANK_LABEL = {
  Low: 'Low Rank',
  High: 'High Rank',
  Master: 'Master Rank',
};
const TIERS = ['low', 'mid', 'high'];
const TIER_LABEL = {
  low: 'Weak Monsters',
  mid: 'Mid-Tier Monsters',
  high: 'Strong Monsters',
};

export default function RollPanel({
  useQuestMode, onSetMode,
  // tiers
  includeLow, includeMid, includeHigh, onToggleTier,
  // ranks (shared)
  ranks, onToggleRank,
  // quest-only
  questKinds, onToggleQuestKind,
  includeCapture, onToggleCapture,
  // special threats (shared)
  superSel, onToggleSuper,
  baseSpecialSel, onToggleBaseSpecial,
  // shared repeat
  noRepeat, onToggleNoRepeat,
}) {
  const tierFlag = { low: includeLow, mid: includeMid, high: includeHigh };
  const ranksOn = RANKS.filter((r) => ranks[r]).length;
  const tiersOn = TIERS.filter((t) => tierFlag[t]).length;
  const kindsOn = QUEST_KINDS.filter((k) => questKinds[k]).length;
  const superCount = Object.values(superSel || {}).filter(Boolean).length;
  const baseCount = Object.values(baseSpecialSel || {}).filter(Boolean).length;

  const chipTemperClass = (name) => {
    const states = temperStates(name);
    if (states.length === 1 && states[0] !== 'normal') return `temper-${states[0]}`;
    return '';
  };

  const rankLabel = useQuestMode ? QUEST_RANK_LABEL : MONSTER_RANK_LABEL;

  return (
    <section className="qg-panel">
      <div className="qg-panel-hd">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
        <h3>{useQuestMode ? 'Quests' : 'Bestiary'}</h3>
      </div>
      <div className="qg-panel-bd">
        <div className="qg-mode-toggle" role="tablist">
          <button
            type="button"
            className={'qg-mode-seg' + (!useQuestMode ? ' on' : '')}
            onClick={() => onSetMode(false)}
          >
            Monster
          </button>
          <button
            type="button"
            className={'qg-mode-seg' + (useQuestMode ? ' on' : '')}
            onClick={() => onSetMode(true)}
          >
            Quest
          </button>
        </div>

        <div className="qg-section-head">
          {useQuestMode ? 'Quest rank' : 'Rank'} · {ranksOn}/{RANKS.length}
        </div>
        {RANKS.map((r) => (
          <Check
            key={r}
            label={rankLabel[r]}
            checked={!!ranks[r]}
            onChange={() => onToggleRank(r)}
          />
        ))}

        <div className="qg-section-head" style={{ marginTop: 14 }}>
          Monster tier · {tiersOn}/{TIERS.length}
        </div>
        {TIERS.map((t) => (
          <Check
            key={t}
            label={TIER_LABEL[t]}
            checked={!!tierFlag[t]}
            onChange={() => onToggleTier(t)}
          />
        ))}

        {useQuestMode && (
          <>
            <div className="qg-section-head" style={{ marginTop: 14 }}>
              Quest type · {kindsOn}/{QUEST_KINDS.length}
            </div>
            {QUEST_KINDS.map((k) => (
              <Check
                key={k}
                label={k}
                checked={!!questKinds[k]}
                onChange={() => onToggleQuestKind(k)}
              />
            ))}
            <Check
              label="Include Capture Quests"
              checked={includeCapture}
              onChange={onToggleCapture}
            />
          </>
        )}

        <div className="qg-section-head" style={{ marginTop: 14 }}>
          Special Threats · {baseCount + superCount}/{BASE_SPECIAL.length + SUPER.length}
        </div>

        <div className="qg-section-sub">Base Game</div>
        <div className="qg-chip-grid">
          {BASE_SPECIAL.map((m) => (
            <MonsterChip
              key={m}
              name={m}
              label={baseMonster(m)}
              on={!!(baseSpecialSel && baseSpecialSel[m])}
              onToggle={() => onToggleBaseSpecial(m)}
              temperClass={chipTemperClass(m)}
            />
          ))}
        </div>

        <div className="qg-section-sub">Iceborne</div>
        <div className="qg-chip-grid">
          {SUPER.map((m) => (
            <MonsterChip
              key={m}
              name={m}
              label={baseMonster(m)}
              on={!!(superSel && superSel[m])}
              onToggle={() => onToggleSuper(m)}
              temperClass={chipTemperClass(m)}
            />
          ))}
        </div>

        <div className="qg-section-head" style={{ marginTop: 14 }}>Terms</div>
        <Check
          label={useQuestMode ? 'Prevent Quest Repeat' : 'Prevent Monster Repeat'}
          checked={noRepeat}
          onChange={onToggleNoRepeat}
        />
      </div>
    </section>
  );
}
