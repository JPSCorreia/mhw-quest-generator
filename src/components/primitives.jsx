import { monsterIcon, weaponIcon } from '../lib/assets';

export function Check({ label, checked, onChange, disabled }) {
  return (
    <label
      className={'qg-check' + (disabled ? ' disabled' : '')}
      onClick={(e) => {
        e.preventDefault();
        if (disabled) return;
        onChange(!checked);
      }}
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

export function MonsterChip({ name, label, on, onToggle, temperClass }) {
  return (
    <button
      className={'qg-chip monster ' + (on ? 'on ' : '') + (temperClass || '')}
      onClick={onToggle}
      type="button"
    >
      <img src={monsterIcon(name)} alt="" />
      <span>{label ?? name}</span>
    </button>
  );
}
