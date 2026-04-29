import { makeAutoObservable } from "mobx";

class QuestStore {
  weapon = '';
  monster = '';
  temper = 'normal';
  quest = null;
  includeNormalMonsters = true;
  includeMidTierMonsters = true;
  includeEndgameMonsters = true;

  preventRepeatWeapon = false;
  preventRepeatMonster = false;

  reduceBowgunFrequency = false;

  useQuestMode = false;
  includeCaptureQuests = true;
  selectedQuestKinds = {
    Optional: true,
    Event: true,
    Arena: true,
  };
  selectedRanks = {
    Low: false,
    High: false,
    Master: true,
  };

  selectedWeapons = {
    'Great Sword': true,
    'Sword & Shield': true,
    'Dual Blades': true,
    'Long Sword': true,
    'Hammer': true,
    'Hunting Horn': true,
    'Lance': true,
    'Gunlance': true,
    'Switch Axe': true,
    'Charge Blade': true,
    'Insect Glaive': true,
    'Bow': true,
    'Light Bowgun': true,  // Bowguns com chance reduzida
    'Heavy Bowgun': true,   // Bowguns com chance reduzida
  };

  selectedSuperEndgameMonsters = {
    'Fatalis': true,
    'Alatreon': true,
    'Kulve Taroth': true,
    'Velkhana': true,
    'Namielle': true,
    'Raging Brachydios': true,
  };

  selectedBaseSpecialMonsters = {
    'Arch-Tempered Nergigante': true,
    'Arch-Tempered Kirin': true,
    'Arch-Tempered Teostra': true,
    'Arch-Tempered Lunastra': true,
    'Arch-Tempered Vaal Hazak': true,
    'Arch-Tempered Kushala Daora': true,
    "Arch-Tempered Xeno'jiiva": true,
    'Arch-Tempered Kulve Taroth': true,
    'Leshen': true,
    'Ancient Leshen': true,
    'Behemoth': true,
    'Extreme Behemoth': true,
  };

  questHistory = [];

  constructor() {
    makeAutoObservable(this);

    // Load initial state from localStorage if exists
    const storedState = localStorage.getItem('questState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      Object.assign(this, parsedState);
    }
  }

  setWeapon(weapon) {
    this.weapon = weapon;
    this.persistState();
  }

  setMonster(monster) {
    this.monster = monster;
    this.persistState();
  }

  setTemper(temper) {
    this.temper = temper;
    this.persistState();
  }

  toggleRank(rank) {
    this.selectedRanks[rank] = !this.selectedRanks[rank];
    this.persistState();
  }

  setIncludeNormalMonsters(value) {
    this.includeNormalMonsters = value;
    this.persistState();
  }

  setIncludeMidTierMonsters(value) {
    this.includeMidTierMonsters = value;
    this.persistState();
  }

  setIncludeEndgameMonsters(value) {
    this.includeEndgameMonsters = value;
    this.persistState();
  }

  setPreventRepeatWeapon(value) {
    this.preventRepeatWeapon = value;
    this.persistState();
  }

  setPreventRepeatMonster(value) {
    this.preventRepeatMonster = value;
    this.persistState();
  }

  toggleSuperEndgameMonster(monster) {
    this.selectedSuperEndgameMonsters[monster] = !this.selectedSuperEndgameMonsters[monster];
    this.persistState();
  }

  toggleBaseSpecialMonster(monster) {
    this.selectedBaseSpecialMonsters[monster] = !this.selectedBaseSpecialMonsters[monster];
    this.persistState();
  }

  toggleWeaponSelection(weapon) {
    this.selectedWeapons[weapon] = !this.selectedWeapons[weapon];
    this.persistState();
  }

  setReduceBowgunFrequency(value) {
    this.reduceBowgunFrequency = value;
    this.persistState();
  }

  setUseQuestMode(value) {
    this.useQuestMode = value;
    this.persistState();
  }

  setIncludeCaptureQuests(value) {
    this.includeCaptureQuests = value;
    this.persistState();
  }

  toggleQuestKind(kind) {
    this.selectedQuestKinds[kind] = !this.selectedQuestKinds[kind];
    this.persistState();
  }

  setQuest(quest) {
    this.quest = quest;
    this.persistState();
  }

  addQuestToHistory(weapon, monster, quest = null, temper = 'normal') {
    this.questHistory = [
      { id: Date.now(), weapon, monster, quest, temper },
      ...this.questHistory,
    ].slice(0, 99);
    this.persistState();
  }

  removeQuestFromHistory(id) {
    this.questHistory = this.questHistory.filter((q) => q.id !== id);
    this.persistState();
  }

  clearQuestHistory() {
    this.weapon = '';
    this.monster = '';
    this.temper = 'normal';
    this.quest = null;
    this.questHistory = [];
    this.persistState();
  }

  persistState() {
    // Save current state to localStorage
    const state = {
      weapon: this.weapon,
      monster: this.monster,
      temper: this.temper,
      quest: this.quest,
      includeNormalMonsters: this.includeNormalMonsters,
      includeMidTierMonsters: this.includeMidTierMonsters,
      includeEndgameMonsters: this.includeEndgameMonsters,
      selectedSuperEndgameMonsters: this.selectedSuperEndgameMonsters,
      selectedBaseSpecialMonsters: this.selectedBaseSpecialMonsters,
      selectedWeapons: this.selectedWeapons,
      preventRepeatWeapon: this.preventRepeatWeapon,
      preventRepeatMonster: this.preventRepeatMonster,
      reduceBowgunFrequency: this.reduceBowgunFrequency,
      useQuestMode: this.useQuestMode,
      includeCaptureQuests: this.includeCaptureQuests,
      selectedQuestKinds: this.selectedQuestKinds,
      selectedRanks: this.selectedRanks,
      questHistory: this.questHistory,
    };
    localStorage.setItem('questState', JSON.stringify(state));
  }
}

const questStore = new QuestStore();
export default questStore;
