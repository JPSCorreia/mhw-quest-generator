import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import '../Result.css';

const Result = ({ weapon, monster }) => {
  const [weaponImageSrc, setWeaponImageSrc] = useState(null);
  const [monsterImages, setMonsterImages] = useState({});
  const [versusImageSrc, setVersusImageSrc] = useState(null);

  useEffect(() => {
    // Carregar a imagem da arma dinamicamente
    const loadWeaponIcon = async () => {
      try {
        if (weapon) {
          const image = await import(`../assets/icons/${weapon}.png`);
          setWeaponImageSrc(image.default);
        }
      } catch (err) {
        console.error('Erro ao carregar a imagem da arma:', err);
      }
    };

    // Carregar a imagem do monstro dinamicamente
    const loadMonsterIcon = async () => {
      try {

        const monsters = ['Anjanath', 'Banbaro', 'Barroth', 'Beotodus', 'Coral Pukei-Pukei','Diablos', 'Dodogama', 'Great Girros', 'Great Jagras', 'Jyuratodus','Kulu-Ya-Ku', 'Lavasioth', 'Legiana', 'Nightshade Paolumu', 'Odogaron', 'Paolumu', 'Pukei-Pukei', 'Radobaan', 'Rathalos', 'Rathian', 'Tobi-Kadachi', 'Tzitzi-Ya-Ku', 'Uragaan', 'Acidic Glavenus', 'Azure Rathalos', 'Black Diablos', 'Brachydios', 'Barioth', 'Ebony Odogaron', 'Fulgur Anjanath', 'Glavenus', 'Nargacuga', 'Pink Rathian', 'Seething Bazelgeuse', 'Shrieking Legiana', 'Tigrex', 'Viper Tobi-Kadachi', 'Yian Garuga', 'Zinogre', 'Rajang', 'Blackveil Vaal Hazak', 'Teostra', 'Lunastra', 'Kushala Daora', 'Furious Rajang', 'Gold Rathian', 'Silver Rathalos', "Shara Ishvalda", "Ruiner Nergigante", "Stygian Zinogre", "Brute Tigrex", 'Frostfang Barioth', 'Kirin', 'Savage Deviljho', 'Scarred Yian Garuga', 'Fatalis', 'Alatreon','Kulve Taroth', "Velkhana", "Namielle", "Raging Brachydios"]

        const images = {};
        for (const monster of monsters) {
          const image = await import(`../assets/icons/${monster}.webp`);
          images[monster] = image.default;
        }
        setMonsterImages(images);
      } catch (err) {
        console.error('Erro ao carregar as imagens dos monstros:', err);
      }
    };

    // Carregar a imagem "versus" dinamicamente
    const loadVersusIcon = async () => {
      try {
        const image = await import(`../assets/images/versus.png`);
        setVersusImageSrc(image.default);
      } catch (err) {
        console.error('Erro ao carregar a imagem "versus":', err);
      }
    };

    loadWeaponIcon();
    loadMonsterIcon();
    loadVersusIcon();
  }, [weapon, monster]);

  if (!weapon || !monster) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <h2>Quest</h2>
        <div className="result-container">

          <div className="weapon-container" style={{  width: '240px' }}>
            <h4>{weapon}</h4>
            <div style={{ width: '120px', height: '120px' }}>
              {weaponImageSrc && (
                <img
                  src={weaponImageSrc}
                  alt={weapon}
                  style={{ width: '110px', height: '110px' }}
                />
              )}
            </div>
          </div>

          <div style={{ height: '60px' }}>
            {versusImageSrc && (
              <img 
                src={versusImageSrc} 
                alt="versus"
                style={{ width: '100px', height: '100px', margin: '5px' }}
              />
            )}
          </div>

          <div className="monster-container" style={{  width: '240px' }}>
            <h4>{monster}</h4>
            <div style={{ width: '120px', height: '120px' }}>
              {monsterImages[monster] && (
                <img 
                  src={monsterImages[monster]} 
                  alt={monster} 
                  style={{ width: '120px', height: '120px' }} 
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Result.propTypes = {
  weapon: PropTypes.string,
  monster: PropTypes.string,
};

export default Result;
