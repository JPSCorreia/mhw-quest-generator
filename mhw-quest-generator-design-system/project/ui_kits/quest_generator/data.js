/* global React */
const { useState, useEffect, useRef } = React;

// Data from the original repo
const WEAPONS = ['Great Sword','Sword & Shield','Dual Blades','Long Sword','Hammer','Hunting Horn','Lance','Gunlance','Switch Axe','Charge Blade','Insect Glaive','Bow','Light Bowgun','Heavy Bowgun'];
const LOW_TIER = ['Anjanath','Banbaro','Barroth','Beotodus','Coral Pukei-Pukei','Diablos','Dodogama','Great Girros','Great Jagras','Jyuratodus','Kulu-Ya-Ku','Lavasioth','Legiana','Nightshade Paolumu','Odogaron','Paolumu','Pukei-Pukei','Radobaan','Rathalos','Rathian','Tobi-Kadachi','Tzitzi-Ya-Ku','Uragaan'];
const MID_TIER = ['Acidic Glavenus','Azure Rathalos','Black Diablos','Brachydios','Barioth','Ebony Odogaron','Fulgur Anjanath','Glavenus','Nargacuga','Pink Rathian','Seething Bazelgeuse','Shrieking Legiana','Tigrex','Viper Tobi-Kadachi','Yian Garuga','Zinogre'];
const HIGH_TIER = ['Rajang','Blackveil Vaal Hazak','Teostra','Lunastra','Kushala Daora','Furious Rajang','Gold Rathian','Silver Rathalos','Shara Ishvalda','Ruiner Nergigante','Stygian Zinogre','Brute Tigrex','Frostfang Barioth','Kirin','Savage Deviljho','Scarred Yian Garuga'];
const SUPER = ['Fatalis','Alatreon','Kulve Taroth','Velkhana','Namielle','Raging Brachydios'];

const FLAVOR = {
  'Rathalos':         ['A Skyward Calamity', 'The wyvern king circles above the Ancient Forest. Its roar carries across three canyons.'],
  'Nergigante':       ['The Eater of Elders', 'Spines regrow with every strike. Pray you break them all before it breaks you.'],
  'Diablos':          ['Horns of the Wastes', 'The desert trembles. Pack shock traps and leave the bards at home.'],
  'Fatalis':          ['The Black Dragon Returns', 'Seliana\u2019s bell has rung. Few who answer the call are expected to return.'],
  'Alatreon':         ['Harbinger of Elements', 'Ice, fire, dragon, thunder. Bring nullberries. Bring more nullberries.'],
  'Velkhana':         ['A Frigid Omen', 'The Hoarfrost Reach has fallen silent. The queen is nesting.'],
  'Teostra':          ['The Emperor of Flame', 'A pyre walks. Do not approach without blastscale armor.'],
  'Kirin':            ['Thunderous Phantom', 'A pale flicker under the storm. Patience rewards the patient.'],
  'Kulve Taroth':     ['The Gilded Wyrm', 'The goldsmith of the deep crawls toward the surface. A lucrative commission.'],
  'Safi\u2019jiiva':  ['The Red Dragon Resurges', 'The Elder Recess burns with a light that should not be. Bring all you have.'],
};
function flavorFor(monster){
  if (!monster) return ['', ''];
  return FLAVOR[monster] || [`Hunt: ${monster}`, `A quarry has been sighted. The Commission requests its tracks and, if possible, its hide.`];
}

function rankFor(m){
  if (LOW_TIER.includes(m)) return { name: 'LOW RANK',  stars: 3, cls: 'tier-low' };
  if (MID_TIER.includes(m)) return { name: 'HIGH RANK', stars: 5, cls: 'tier-mid' };
  if (HIGH_TIER.includes(m))return { name: 'MASTER RANK', stars: 7, cls: 'tier-high' };
  if (SUPER.includes(m))    return { name: 'ARCH-TEMPERED', stars: 9, cls: 'tier-super' };
  return { name: '—', stars: 0, cls: '' };
}

Object.assign(window, { WEAPONS, LOW_TIER, MID_TIER, HIGH_TIER, SUPER, flavorFor, rankFor });
