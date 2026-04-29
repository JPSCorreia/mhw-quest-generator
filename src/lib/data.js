import questsData from '../data/quests.json';

export const WEAPONS = [
    'Great Sword',
    'Sword & Shield',
    'Dual Blades',
    'Long Sword',
    'Hammer',
    'Hunting Horn',
    'Lance',
    'Gunlance',
    'Switch Axe',
    'Charge Blade',
    'Insect Glaive',
    'Bow',
    'Light Bowgun',
    'Heavy Bowgun',
];

export const LOW_TIER = [
    'Anjanath',
    'Banbaro',
    'Barroth',
    'Beotodus',
    'Coral Pukei-Pukei',
    'Diablos',
    'Dodogama',
    'Great Girros',
    'Great Jagras',
    'Jyuratodus',
    'Kulu-Ya-Ku',
    'Lavasioth',
    'Legiana',
    'Nightshade Paolumu',
    'Odogaron',
    'Paolumu',
    'Pukei-Pukei',
    'Radobaan',
    'Rathalos',
    'Rathian',
    'Tobi-Kadachi',
    'Tzitzi-Ya-Ku',
    'Uragaan',
];

export const MID_TIER = [
    'Acidic Glavenus',
    'Azure Rathalos',
    'Black Diablos',
    'Brachydios',
    'Barioth',
    'Ebony Odogaron',
    'Fulgur Anjanath',
    'Glavenus',
    'Nargacuga',
    'Pink Rathian',
    'Seething Bazelgeuse',
    'Shrieking Legiana',
    'Tigrex',
    'Viper Tobi-Kadachi',
    'Yian Garuga',
    'Zinogre',
];

export const HIGH_TIER = [
    'Rajang',
    'Blackveil Vaal Hazak',
    'Teostra',
    'Lunastra',
    'Kushala Daora',
    'Furious Rajang',
    'Gold Rathian',
    'Silver Rathalos',
    'Shara Ishvalda',
    'Ruiner Nergigante',
    'Stygian Zinogre',
    'Brute Tigrex',
    'Frostfang Barioth',
    'Kirin',
    'Savage Deviljho',
    'Scarred Yian Garuga',
];

export const SUPER = [
    'Fatalis',
    'Alatreon',
    'Kulve Taroth',
    'Velkhana',
    'Namielle',
    'Raging Brachydios',
];

export const BASE_SPECIAL = [
    'Arch-Tempered Nergigante',
    'Arch-Tempered Kirin',
    'Arch-Tempered Teostra',
    'Arch-Tempered Lunastra',
    'Arch-Tempered Vaal Hazak',
    'Arch-Tempered Kushala Daora',
    "Arch-Tempered Xeno'jiiva",
    'Arch-Tempered Kulve Taroth',
    'Leshen',
    'Ancient Leshen',
    'Behemoth',
    'Extreme Behemoth',
];

export const SPECIAL_THREAT_QUESTS = {
    Fatalis: ['The Black Dragon', 'Fade to Black'],
    Alatreon: ['Dawn of the Death Star'],
    'Kulve Taroth': ['Banquet in the Earthen Hall', 'The Eternal Gold Rush'],
    Velkhana: ['The Place Where Winter Sleeps'],
    Namielle: ['The Distant Dark Tide'],
    'Raging Brachydios': ['...And My Rage for All', 'Achy Brachy Heart'],

    'Arch-Tempered Nergigante': ['The Heralds of Destruction Cry'],
    'Arch-Tempered Kirin': ['A Whisper of White Mane'],
    'Arch-Tempered Teostra': ['The Scorn of the Sun'],
    'Arch-Tempered Lunastra': ['When Blue Dust Surpasses Red Lust'],
    'Arch-Tempered Vaal Hazak': ['The Deathly Quiet Curtain'],
    'Arch-Tempered Kushala Daora': ['The Eye of the Storm'],
    "Arch-Tempered Xeno'jiiva": ['Keeper of the Otherworld'],
    'Arch-Tempered Kulve Taroth': ['The Fury of El Dorado'],
    Leshen: ['Contract: Trouble in the Ancient Forest'],
    'Ancient Leshen': ['Contract: Woodland Spirit'],
    Behemoth: ['A Visitor from Eorzea', 'He Taketh It with His Eyes'],
    'Extreme Behemoth': ['A Visitor from Eorzea (Extreme)'],
};

export function tierOf(monster) {
    if (!monster) return null;
    const base = baseMonster(monster);
    if (LOW_TIER.includes(base) || LOW_TIER.includes(monster)) return 'low';
    if (MID_TIER.includes(base) || MID_TIER.includes(monster)) return 'mid';
    if (HIGH_TIER.includes(base) || HIGH_TIER.includes(monster)) return 'high';
    return null;
}

export const TEMPER = {
    NORMAL: 'normal',
    TEMPERED: 'tempered',
    ARCH: 'archtempered',
    SPECIAL: 'special',
};

export const TEMPER_LABEL = {
    normal: '',
    tempered: 'Tempered ',
    archtempered: 'Arch-Tempered ',
    special: '',
};

const ALWAYS_ARCH = new Set(['Velkhana', 'Namielle']);
const SPECIAL_ONLY = new Set([
    'Fatalis',
    'Alatreon',
    'Kulve Taroth',
    'Raging Brachydios',
    'Leshen',
    'Ancient Leshen',
    'Behemoth',
]);
const ALWAYS_TEMPERED = new Set(['Extreme Behemoth']);

export function baseMonster(name) {
    if (!name) return name;
    if (name.startsWith('Arch-Tempered '))
        return name.slice('Arch-Tempered '.length);
    if (name === 'Extreme Behemoth') return 'Behemoth';
    return name;
}

export function temperStates(monster) {
    if (!monster) return ['normal'];
    if (monster.startsWith('Arch-Tempered ')) return ['archtempered'];
    if (ALWAYS_TEMPERED.has(monster)) return ['tempered'];
    if (SPECIAL_ONLY.has(monster)) return ['special'];
    if (ALWAYS_ARCH.has(monster)) return ['archtempered'];
    if (HIGH_TIER.includes(monster)) return ['normal', 'tempered'];
    return ['normal'];
}

const TEMPER_WEIGHTS = {
    normal: 45,
    tempered: 45,
    archtempered: 10,
    special: 1,
};

export function rollTemper(monster) {
    const states = temperStates(monster);
    if (states.length === 1) return states[0];
    const pool = states.flatMap((s) => Array(TEMPER_WEIGHTS[s] || 1).fill(s));
    return pool[Math.floor(Math.random() * pool.length)];
}

export const BOWGUNS = ['Light Bowgun', 'Heavy Bowgun'];

export const QUEST_KINDS = ['Optional', 'Event', 'Arena'];

function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractTargets(quest) {
    const result = [];
    for (const m of quest.monsters) {
        const re = new RegExp(`(\\d+)\\s+${escapeRe(m)}`);
        const match = quest.objective.match(re);
        if (match) {
            const n = Math.min(parseInt(match[1], 10) || 1, 6);
            for (let i = 0; i < n; i += 1) result.push(m);
        } else if (quest.objective.includes(m)) {
            result.push(m);
        }
    }
    return result.length > 0 ? result : quest.monsters;
}

// Objective types we keep: 1 = hunt/slay single, 4 = capture, 16 = multi-target.
// Dropped: 2 (slay N small monsters), 8 (deliver), 32 (story/repel/tutorial).
const HUNT_TYPES = new Set([1, 4, 16]);

export const QUESTS = questsData.quests
    .filter((q) => q.kind !== 'Assigned')
    .filter((q) => HUNT_TYPES.has(q.objectiveType))
    .filter((q) => q.monsters.length > 0)
    .filter((q) => !q.monsters.includes("Safi'jiiva"))
    .map((q) => ({
        ...q,
        kind: q.kind === 'Iceborne' ? 'Optional' : q.kind,
        targets: extractTargets(q),
        isCapture: q.objectiveType === 4,
        temper: 'normal',
    }));

// Special threat quests are filtered out of QUESTS by HUNT_TYPES (they use
// objectiveType 2/32). We surface them through a separate list so they can
// be added back into the Quest-mode pool when their threat is selected.
const RAW_QUESTS_BY_NAME = (() => {
    const out = {};
    for (const q of questsData.quests) out[q.name] = q;
    return out;
})();

export const SPECIAL_THREAT_QUEST_LIST = (() => {
    const out = [];
    for (const [threat, names] of Object.entries(SPECIAL_THREAT_QUESTS)) {
        const states = temperStates(threat);
        const temper = states.length === 1 ? states[0] : 'normal';
        for (const name of names) {
            const raw = RAW_QUESTS_BY_NAME[name];
            if (!raw) continue;
            out.push({
                ...raw,
                kind: raw.kind === 'Iceborne' ? 'Optional' : raw.kind,
                targets: extractTargets(raw),
                isCapture: false,
                temper,
                specialThreat: threat,
            });
        }
    }
    return out;
})();

export function specialThreatQuestsFor(threats) {
    const wanted = new Set(threats);
    return SPECIAL_THREAT_QUEST_LIST.filter((q) => wanted.has(q.specialThreat));
}

const FLAVOR = {
    Rathalos: [
        'A Skyward Calamity',
        'The wyvern king circles above the Ancient Forest. Its roar carries across three canyons.',
    ],
    Nergigante: [
        'The Eater of Elders',
        'Spines regrow with every strike. Pray you break them all before it breaks you.',
    ],
    Diablos: [
        'Horns of the Wastes',
        'The desert trembles. Pack shock traps and leave the bards at home.',
    ],
    Fatalis: [
        'The Black Dragon Returns',
        "Seliana's bell has rung. Few who answer the call are expected to return.",
    ],
    Alatreon: [
        'Harbinger of Elements',
        'Ice, fire, dragon, thunder. Bring nullberries. Bring more nullberries.',
    ],
    Velkhana: [
        'A Frigid Omen',
        'The Hoarfrost Reach has fallen silent. The queen is nesting.',
    ],
    Teostra: [
        'The Emperor of Flame',
        'A pyre walks. Do not approach without blastscale armor.',
    ],
    Kirin: [
        'Thunderous Phantom',
        'A pale flicker under the storm. Patience rewards the patient.',
    ],
    'Kulve Taroth': [
        'The Gilded Wyrm',
        'The goldsmith of the deep crawls toward the surface. A lucrative commission.',
    ],
    "Safi'jiiva": [
        'The Red Dragon Resurges',
        'The Elder Recess burns with a light that should not be. Bring all you have.',
    ],
};

export function flavorFor(monster) {
    if (!monster) return ['', ''];
    return (
        FLAVOR[monster] || [
            `Hunt: ${monster}`,
            'A quarry has been sighted. The Commission requests its tracks and, if possible, its hide.',
        ]
    );
}

const RANK_ORDER = { Low: 1, High: 2, Master: 3 };
const RANK_NAME = { Low: 'LOW RANK', High: 'HIGH RANK', Master: 'MASTER RANK' };

const MONSTER_MIN_RANK = (() => {
    const out = {};
    for (const q of questsData.quests) {
        if (!q.monsters || q.monsters.length === 0) continue;
        const targets = q.monsters.filter((m) => q.objective.includes(m));
        if (!targets.length) continue;
        for (const m of new Set(targets)) {
            const cur = out[m];
            const key = [RANK_ORDER[q.rank] ?? 9, q.stars];
            if (
                !cur ||
                key[0] < cur[0] ||
                (key[0] === cur[0] && key[1] < cur[1])
            ) {
                out[m] = key;
            }
        }
    }
    return out;
})();

const MASTER_6 = { name: RANK_NAME.Master, stars: 6, rank: 'Master' };
const HIGH_9 = { name: RANK_NAME.High, stars: 9, rank: 'High' };

export function rankFor(monster) {
    if (!monster) return { name: '—', stars: 0, rank: null };
    if (SUPER.includes(monster)) return MASTER_6;
    if (BASE_SPECIAL.includes(monster)) return HIGH_9;
    const hit = MONSTER_MIN_RANK[monster];
    if (hit) {
        const [rankKey, stars] = hit;
        const rank = Object.keys(RANK_ORDER).find(
            (k) => RANK_ORDER[k] === rankKey,
        );
        return { name: RANK_NAME[rank], stars, rank };
    }
    return { name: '—', stars: 0, rank: null };
}
