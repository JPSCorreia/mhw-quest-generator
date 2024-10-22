import { observer } from "mobx-react-lite";
import questStore from './stores/questStore'; // Import the MobX store
import Result from './components/Result';
import './App.css';

const allWeapons = {
  melee: ['Great Sword', 'Sword and Shield', 'Dual Blades','Long Sword', 'Hammer', 'Hunting Horn', 'Lance', 'Gunlance', 'Switch Axe', 'Charge Blade', 'Insect Glaive', 'Bow'],
  bowguns: ['Light Bowgun', 'Heavy Bowgun']
};

// Define the arrays of monsters
const normalMonsters = ['Anjanath', 'Banbaro', 'Barroth', 'Beotodus', 'Coral Pukei-Pukei','Diablos', 'Dodogama', 'Great Girros', 'Great Jagras', 'Jyuratodus','Kulu-Ya-Ku', 'Lavasioth', 'Legiana', 'Nightshade Paolumu', 'Odogaron', 'Paolumu', 'Pukei-Pukei', 'Radobaan', 'Rathalos', 'Rathian', 'Tobi-Kadachi', 'Tzitzi-Ya-Ku', 'Uragaan'];
const midTierMonsters = ['Acidic Glavenus', 'Azure Rathalos', 'Black Diablos', 'Brachydios', 'Barioth', 'Ebony Odogaron', 'Fulgur Anjanath', 'Glavenus', 'Nargacuga', 'Pink Rathian', 'Seething Bazelgeuse', 'Shrieking Legiana', 'Tigrex', 'Viper Tobi-Kadachi', 'Yian Garuga', 'Zinogre'];
const endgameMonsters = ['Rajang', 'Blackveil Vaal Hazak', 'Teostra', 'Lunastra', 'Kushala Daora', 'Furious Rajang', 'Gold Rathian', 'Silver Rathalos', "Shara Ishvalda", "Ruiner Nergigante", "Stygian Zinogre", "Brute Tigrex", 'Frostfang Barioth', 'Kirin', 'Savage Deviljho', 'Scarred Yian Garuga'];
const superEndgameMonsters = ['Fatalis', 'Alatreon','Kulve Taroth', "Velkhana", "Namielle", "Raging Brachydios"]; // Super endgame monsters

const App = observer(() => {

  const handleRandomSelection = () => {
    // Filter the weapon pool based on Bowgun checkbox
    const weaponPool = questStore.includeBowguns ? [...allWeapons.melee, ...allWeapons.bowguns] : [...allWeapons.melee];
    
    // Generate random weapon and ensure it is not the same as the previous one
    let newWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
    while (newWeapon === questStore.weapon) {
      newWeapon = weaponPool[Math.floor(Math.random() * weaponPool.length)];
    }

    // Build the monster pool based on user's selections
    let monsterPool = [];
    if (questStore.includeNormalMonsters) {
      monsterPool = [...monsterPool, ...normalMonsters];
    }
    if (questStore.includeMidTierMonsters) {
      monsterPool = [...monsterPool, ...midTierMonsters];
    }
    if (questStore.includeEndgameMonsters) {
      // Include selected endgame monsters with double the chance
      endgameMonsters.forEach(monster => {
        monsterPool.push(monster, monster); // Double chance by adding twice
      });
    }
    if (questStore.includeSuperEndgameMonsters) {
      // Include super endgame monsters with 4x the chance
      superEndgameMonsters.forEach(monster => {
        if (questStore.includedSuperEndgameMonsters[monster]) { // Only include selected ones
          for (let i = 0; i < 4; i++) {
            monsterPool.push(monster); // Quadruple chance
          }
        }
      });
    }

    // Generate random monster and ensure it is not the same as the previous one
    let newMonster = monsterPool[Math.floor(Math.random() * monsterPool.length)];
    while (newMonster === questStore.monster) {
      newMonster = monsterPool[Math.floor(Math.random() * monsterPool.length)];
    }

    // Update the selections
    questStore.setWeapon(newWeapon);
    questStore.setMonster(newMonster);
  };

  return (
    <div className="App">
      <h1>MHW Random Quest Generator</h1>

      <h3>Options</h3>
      <div className="options">
        {/* Checkbox for including Bowguns */}
        <label>
          <input
            type="checkbox"
            checked={questStore.includeBowguns}
            onChange={(e) => questStore.setIncludeBowguns(e.target.checked)}
          />
          Include Bowguns
        </label>

        {/* Checkbox for including Normal Monsters */}
        <label>
          <input
            type="checkbox"
            checked={questStore.includeNormalMonsters}
            onChange={(e) => questStore.setIncludeNormalMonsters(e.target.checked)}
          />
          Include Normal Monsters
        </label>

        {/* Checkbox for including Mid Tier Monsters */}
        <label>
          <input
            type="checkbox"
            checked={questStore.includeMidTierMonsters}
            onChange={(e) => questStore.setIncludeMidTierMonsters(e.target.checked)}
          />
          Include Mid-Tier Monsters
        </label>

        {/* Checkbox for including Endgame Monsters */}
        <label>
          <input
            type="checkbox"
            checked={questStore.includeEndgameMonsters}
            onChange={(e) => questStore.setIncludeEndgameMonsters(e.target.checked)}
          />
          Include Endgame Monsters
        </label>

        {/* Checkbox for including Super Endgame Monsters */}
        {/* <label>
          <input
            type="checkbox"
            checked={questStore.includeSuperEndgameMonsters}
            onChange={(e) => questStore.setIncludeSuperEndgameMonsters(e.target.checked)}
          />
          Include Super Endgame Monsters (4x chance)
        </label> */}
      </div>
      {/* Checkboxes for individual Super Endgame Monster Selection */}
      <h3>Include Super Endgame Monsters:</h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      {superEndgameMonsters.map((monster) => (
        <label key={monster} className="include-monster">
          <input
            type="checkbox"
            checked={questStore.includedSuperEndgameMonsters[monster]}
            onChange={() => questStore.toggleSuperEndgameMonster(monster)}
          />
          {monster}
        </label>
      ))}
      </div>
      <div className="button-container">
        <button onClick={handleRandomSelection}>Generate Quest</button>
      </div>
      

      <Result weapon={questStore.weapon} monster={questStore.monster} />
      

    </div>
  );
});

export default App;
