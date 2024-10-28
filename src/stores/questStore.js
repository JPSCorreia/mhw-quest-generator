import { makeAutoObservable } from "mobx";

class QuestStore {
  weapon = '';
  monster = '';
  includeNormalMonsters = true;
  includeMidTierMonsters = true;
  includeEndgameMonsters = true;

  preventRepeatWeapon = false;
  preventRepeatMonster = false;

  reduceBowgunFrequency = false;

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

  toggleWeaponSelection(weapon) {
    this.selectedWeapons[weapon] = !this.selectedWeapons[weapon];
    this.persistState();
  }

  setReduceBowgunFrequency(value) {
    this.reduceBowgunFrequency = value;
    this.persistState();
  }

  addQuestToHistory(weapon, monster) {
    // Add quest and keep last 20
    this.questHistory = [{ weapon, monster }, ...this.questHistory].slice(0, 20);
    this.persistState();
  }

  clearQuestHistory() {
    // Limpar a quest atual e o histórico
    this.weapon = '';
    this.monster = '';
    this.questHistory = [];
    this.persistState();
  }

  persistState() {
    // Save current state to localStorage
    const state = {
      weapon: this.weapon,
      monster: this.monster,
      includeNormalMonsters: this.includeNormalMonsters,
      includeMidTierMonsters: this.includeMidTierMonsters,
      includeEndgameMonsters: this.includeEndgameMonsters,
      selectedSuperEndgameMonsters: this.selectedSuperEndgameMonsters,
      selectedWeapons: this.selectedWeapons,
      preventRepeatWeapon: this.preventRepeatWeapon,
      preventRepeatMonster: this.preventRepeatMonster,
      reduceBowgunFrequency: this.reduceBowgunFrequency,
      questHistory: this.questHistory,
    };
    localStorage.setItem('questState', JSON.stringify(state));
  }
}

const questStore = new QuestStore();
export default questStore;
