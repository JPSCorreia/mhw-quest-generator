import { makeAutoObservable } from "mobx";

class QuestStore {
  weapon = '';
  monster = '';
  includeBowguns = true;
  includeNormalMonsters = true;
  includeMidTierMonsters = true;
  includeEndgameMonsters = true;
  includeSuperEndgameMonsters = true; // Adiciona a nova categoria
  includedSuperEndgameMonsters = {
    Velkhana: true,
    Namielle: true,
    'Raging Brachydios': true,
    Fatalis: true,
    Alatreon: true,
    'Kulve Taroth': true,
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

  setIncludeBowguns(value) {
    this.includeBowguns = value;
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

  setIncludeSuperEndgameMonsters(value) {
    this.includeSuperEndgameMonsters = value;
    this.persistState();
  }

  toggleSuperEndgameMonster(monster) {
    this.includedSuperEndgameMonsters[monster] = !this.includedSuperEndgameMonsters[monster];
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
      includeBowguns: this.includeBowguns,
      includeNormalMonsters: this.includeNormalMonsters,
      includeMidTierMonsters: this.includeMidTierMonsters,
      includeEndgameMonsters: this.includeEndgameMonsters,
      includeSuperEndgameMonsters: this.includeSuperEndgameMonsters,
      includedSuperEndgameMonsters: this.includedSuperEndgameMonsters,
      questHistory: this.questHistory,
    };
    localStorage.setItem('questState', JSON.stringify(state));
  }
}

const questStore = new QuestStore();
export default questStore;
