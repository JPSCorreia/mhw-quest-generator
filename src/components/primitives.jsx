import { monsterIcon, weaponIcon } from '../lib/assets';

export function Check({ label, checked, onChange }) {
  return (
    <label
      className="qg-check"
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
    >
      <span className={'box ' + (checked ? 'checked' : '')} />
      {label}
    </label>
  );
}

export function WeaponChip({ name, on, onToggle }) {
  return (
    <button className={'qg-chip ' + (on ? 'on' : '')} onClick={onToggle} type="button">
      <img src={weaponIcon(name)} alt="" />
      <span>{name}</span>
    </button>
  );
}

export function MonsterChip({ name, on, onToggle }) {
  return (
    <button
      className={'qg-chip monster ' + (on ? 'on' : '')}
      onClick={onToggle}
      type="button"
    >
      <img src={monsterIcon(name)} alt="" />
      <span style={{ fontSize: 10 }}>{name}</span>
    </button>
  );
}
