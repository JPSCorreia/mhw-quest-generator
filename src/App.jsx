import { observer } from "mobx-react-lite";
import questStore from './stores/questStore'; // Import the MobX store
import Result from './components/Result';
import QuestHistory from './components/QuestHistory';
import './App.css';

const allWeapons = {
  melee: ['Great Sword', 'Sword & Shield', 'Dual Blades','Long Sword', 'Hammer', 'Hunting Horn', 'Lance', 'Gunlance', 'Switch Axe', 'Charge Blade', 'Insect Glaive', 'Bow'],
  bowguns: ['Light Bowgun', 'Heavy Bowgun'] // 3x less likely to be selected
};

// Define the arrays of monsters
const normalMonsters = ['Anjanath', 'Banbaro', 'Barroth', 'Beotodus', 'Coral Pukei-Pukei','Diablos', 'Dodogama', 'Great Girros', 'Great Jagras', 'Jyuratodus','Kulu-Ya-Ku', 'Lavasioth', 'Legiana', 'Nightshade Paolumu', 'Odogaron', 'Paolumu', 'Pukei-Pukei', 'Radobaan', 'Rathalos', 'Rathian', 'Tobi-Kadachi', 'Tzitzi-Ya-Ku', 'Uragaan'];
const midTierMonsters = ['Acidic Glavenus', 'Azure Rathalos', 'Black Diablos', 'Brachydios', 'Barioth', 'Ebony Odogaron', 'Fulgur Anjanath', 'Glavenus', 'Nargacuga', 'Pink Rathian', 'Seething Bazelgeuse', 'Shrieking Legiana', 'Tigrex', 'Viper Tobi-Kadachi', 'Yian Garuga', 'Zinogre'];
const endgameMonsters = ['Rajang', 'Blackveil Vaal Hazak', 'Teostra', 'Lunastra', 'Kushala Daora', 'Furious Rajang', 'Gold Rathian', 'Silver Rathalos', "Shara Ishvalda", "Ruiner Nergigante", "Stygian Zinogre", "Brute Tigrex", 'Frostfang Barioth', 'Kirin', 'Savage Deviljho', 'Scarred Yian Garuga'];

const App = observer(() => {

  const handleRandomSelection = () => {

    const selectedSuperEndgameMonsters = Object.keys(questStore.selectedSuperEndgameMonsters).filter((monster) => questStore.selectedSuperEndgameMonsters[monster]);
    const selectedWeapons = Object.keys(questStore.selectedWeapons).filter((weapon) => questStore.selectedWeapons[weapon]);
    
    if (selectedWeapons.length === 0) {
      alert("Please select at least one weapon to generate a quest.");
      return;
    }
    if (
      !questStore.includeNormalMonsters &&
      !questStore.includeMidTierMonsters &&
      !questStore.includeEndgameMonsters &&
      selectedSuperEndgameMonsters.length === 0
    ) {
      alert("Please select at least one monster category to generate a quest.");
      return;
    }

    // Verificar se há apenas uma arma ou monstro e a opção de prevenir repetição está ativada
    if (questStore.preventRepeatWeapon && selectedWeapons.length === 1) {
      alert("Prevent Weapon Repeat is active, but only one weapon is selected. Please select more weapons or disable this option.");
      return;
    }
    if (questStore.preventRepeatMonster && (!questStore.includeNormalMonsters && !questStore.includeMidTierMonsters && !questStore.includeEndgameMonsters && selectedSuperEndgameMonsters.length === 1)) {
      alert("Prevent Monster Repeat is active, but only one monster is selected. Please select more monsters or disable this option.");
      return;
    }

    // Construir a pool de armas com base na opção de frequência reduzida dos bowguns
    let weaponPool = selectedWeapons.flatMap((weapon) => {
      // Se `reduceBowgunFrequency` estiver ligado, adicionamos os bowguns apenas uma vez, e as outras armas 4 vezes
      if (questStore.reduceBowgunFrequency && allWeapons.bowguns.includes(weapon)) {
        return [weapon];  // Bowguns com chance reduzida
      } else if (questStore.reduceBowgunFrequency && !allWeapons.bowguns.includes(weapon)) {
        return [weapon, weapon, weapon, weapon];  // Outras armas adicionadas 4x
      } else {
        return [weapon];  // Frequência normal para todas as armas se a opção estiver desligada
      }
    });

    // Selecionar uma nova arma, garantindo que não é igual à anterior se houver mais de uma opção
    let newWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
    if (questStore.preventRepeatWeapon && selectedWeapons.length > 1) {
      while (newWeapon === questStore.weapon) {
        newWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      }
    }

    // Construir a pool de monstros com as categorias e as seleções do utilizador
    let monsterPool = [];
    if (questStore.includeNormalMonsters) monsterPool = [...monsterPool, ...normalMonsters];
    if (questStore.includeMidTierMonsters) monsterPool = [...monsterPool, ...midTierMonsters];
    if (questStore.includeEndgameMonsters) endgameMonsters.forEach(monster => monsterPool.push(monster, monster));
    selectedSuperEndgameMonsters.forEach(monster => Array(4).fill(monster).forEach(() => monsterPool.push(monster)));

    // Obter um conjunto único de monstros para verificar se há mais de uma opção única
    const uniqueMonsters = new Set(monsterPool);
    
    // Selecionar um novo monstro, garantindo que não é igual ao anterior se houver mais de uma opção
    let newMonster = monsterPool[Math.floor(Math.random() * monsterPool.length)];
    if (questStore.preventRepeatMonster && uniqueMonsters.size > 1) {
      while (newMonster === questStore.monster) {
        newMonster = monsterPool[Math.floor(Math.random() * monsterPool.length)];
      }
    }

    // Gerar quest com as armas e monstros selecionados se houverem armas e monstros selecionados
    questStore.setWeapon(newWeapon);
    questStore.setMonster(newMonster);
    questStore.addQuestToHistory(newWeapon, newMonster);

  };

  const handleClearHistory = () => {
    questStore.clearQuestHistory(); // Limpar o histórico e a quest atual
  };

  return (
    <div className="App">
      <h1>MHW Random Quest Generator</h1>
      <div className="app-container">
        <div className="options-container">
        <h3>Options:</h3>
          <div className="options">

            {/* Opção para permitir frequência reduzida dos Bowguns */}
            <label>
              <input
                type="checkbox"
                checked={questStore.reduceBowgunFrequency}
                onChange={(e) => questStore.setReduceBowgunFrequency(e.target.checked)}
              />
              Reduce Bowgun Frequency
            </label>

            {/* Opções para permitir repetições de armas e monstros */}
            <label>
              <input
                type="checkbox"
                checked={questStore.preventRepeatWeapon}
                onChange={(e) => questStore.setPreventRepeatWeapon(e.target.checked)}
              />
              Prevent Weapon Repeat
            </label>

            <label>
              <input
                type="checkbox"
                checked={questStore.preventRepeatMonster}
                onChange={(e) => questStore.setPreventRepeatMonster(e.target.checked)}
              />
              Prevent Monster Repeat
            </label>

            <h3>Weapons:</h3>
              {Object.keys(questStore.selectedWeapons).map((weapon) => (
                <label key={weapon} className="weapon-option">
                  <input
                    type="checkbox"
                    checked={questStore.selectedWeapons[weapon]}
                    onChange={() => questStore.toggleWeaponSelection(weapon)}
                  />
                  {weapon}
                </label>
              ))}
          </div>

          {/* Checkboxes for individual Super Endgame Monster Selection */}
          <div  style={{ display: 'flex', flexDirection: 'column' }} className="monster-selection">
            
            <h3>Monsters:</h3>

            {/* Checkbox for including Normal Monsters */}
            <label>
              <input
                type="checkbox"
                checked={questStore.includeNormalMonsters}
                onChange={(e) => questStore.setIncludeNormalMonsters(e.target.checked)}
              />
              Include Low Tier Monsters
            </label>

            {/* Checkbox for including Mid Tier Monsters */}
            <label>
              <input
                type="checkbox"
                checked={questStore.includeMidTierMonsters}
                onChange={(e) => questStore.setIncludeMidTierMonsters(e.target.checked)}
              />
              Include Mid Tier Monsters
            </label>

            {/* Checkbox for including Endgame Monsters */}
            <label>
              <input
                type="checkbox"
                checked={questStore.includeEndgameMonsters}
                onChange={(e) => questStore.setIncludeEndgameMonsters(e.target.checked)}
              />
              Include High Tier Monsters
            </label>
            {Object.keys(questStore.selectedSuperEndgameMonsters).map((monster) => (
              <label key={monster} className="monster-option">
                <input
                  type="checkbox"
                  checked={questStore.selectedSuperEndgameMonsters[monster]}
                  onChange={() => questStore.toggleSuperEndgameMonster(monster)}
                />
                {monster}
              </label>
            ))}
          </div>
        </div>

        <div className="generator-container">
          <Result weapon={questStore.weapon} monster={questStore.monster} />
          <div className="button-container">
            <button onClick={handleRandomSelection}  className="generate-button" >Generate Quest</button>
            <button onClick={handleClearHistory} className="clear-button" >Clear History</button>
          </div>
        </div>

        
        <div className="quest-history-container">
          <QuestHistory quests={questStore.questHistory} />
        </div>
      </div>
    </div>
  );
});

export default App;
