const monsterImages = import.meta.glob('../assets/icons/*.webp', { eager: true, import: 'default' });
const weaponImages  = import.meta.glob('../assets/icons/*.png',  { eager: true, import: 'default' });

function toMap(mod) {
  const out = {};
  for (const [path, url] of Object.entries(mod)) {
    const name = path.split('/').pop().replace(/\.(webp|png)$/, '');
    out[name] = url;
  }
  return out;
}

export const MONSTER_ICONS = toMap(monsterImages);
export const WEAPON_ICONS  = toMap(weaponImages);

export function monsterIcon(name) {
  if (!name) return null;
  if (MONSTER_ICONS[name]) return MONSTER_ICONS[name];
  if (name.startsWith('Arch-Tempered ')) return MONSTER_ICONS[name.slice('Arch-Tempered '.length)] || null;
  if (name === 'Extreme Behemoth') return MONSTER_ICONS['Behemoth'] || null;
  return null;
}
export function weaponIcon(name)  { return name ? WEAPON_ICONS[name]  : null; }

export const trapIcon = MONSTER_ICONS['trap'];
